import { Prisma } from "@prisma/index";
import { createAsyncErrHandler, createGrpcErrorHandler, GrpcAppError } from "@shipoff/services-commons";
import { GrpcResponse } from "@shipoff/services-commons/utils/rpc-utils";
import { BodyLessRequestBodyType, BulkResourceRequestBodyType, InternalEmptyRequestBodyType } from "@shipoff/types";
import { Database, dbService } from "@/db/db-service";
import authExternalService, { AuthExternalService } from "@/externals/auth.external.service";
import { CheckDomainAvailabilityRequestBodyType, CreateProjectRequestBodyType, DeleteEnvVarsRequestBodyType, GetEnvVarsRequestBodyType, GetProjectRequestBodyType, GetProjectsLinkedToTeamRequestBodyType, IGetProjectRequestBodyType, UpdateProjectRequestBodyType, UpsertEnvVarsRequestBodyType } from "@/types/projects";
import { ProjectProducer } from "@/producer/project.producer";
import { status } from "@grpc/grpc-js";
import { logger } from "@/libs/winston";


export class ProjectsService {
    private _dbService: Database;
    private _authService: AuthExternalService;
    private _errHandler : ReturnType<typeof createGrpcErrorHandler>
    private _asyncErrHandler: ReturnType<typeof createAsyncErrHandler>
    private _selectProjectFeilds:Prisma.ProjectSelect
    private _projectProducer: ProjectProducer;

    constructor() {
        this._errHandler = createGrpcErrorHandler({subServiceName:"PROJECT_SERVICE",logger});
        this._asyncErrHandler = createAsyncErrHandler({subServiceName:"PROJECT_SERVICE",logger});
        this._selectProjectFeilds = {
                repository:{
                    take:1,
                    where:{
                        isConnected:true
                    }
                },
                framework:true,
                environmentVariables:{
                    select:{
                        name:true,
                        value:true
                    }
                },
                deployments:{
                    orderBy:{
                        lastDeployedAt:"desc"
                    },
                    take:1,
                    include:{
                        repository:true
                    }
                }
            }
        this._dbService = dbService;
        this._authService = authExternalService;
        this._projectProducer = new ProjectProducer();
    }

    async createProject({authUserData:{userId},reqMeta,...body}: CreateProjectRequestBodyType) {
        
        try {
           const fw = await this._dbService.findUniqueFrameworkById(body.frameworkId);
           if(fw.applicationType==="STATIC"){
               delete body.prodCommand;
           }
           else if(!body.environmentVars?.find(env=>env.name==="PORT")){
              throw new GrpcAppError(status.INVALID_ARGUMENT, "PORT environment variable is required for dynamic projecs");
           }
           const {githubInstallationId} = await this._dbService.findUniqueGithubInstallation({
            where:{
                userId
            }
           });
           const project = await this._dbService.createProject({...body, githubInstallationId});
           this._asyncErrHandler.call(this._projectProducer.publishProjectEvent({
               event:"CREATED",
               projectId: project.projectId,
               userId,
               projectType:fw.applicationType,
               requestId:reqMeta.requestId
           }),"CREATE-PROJECT",reqMeta.requestId);

           return GrpcResponse.OK(project, "Project created");
        } catch (e:any) {
            return this._errHandler(e, "CREATE-PROJECT",reqMeta.requestId);
        }
    }

    async getProject({authUserData,projectId,reqMeta}:GetProjectRequestBodyType){
        try {
            await this._authService.getPermissions({authUserData,permissions:["READ"],scope:"PROJECT",resourceId:projectId,errMsg:"You do not have permission to read this project",reqMeta});
            const project = await this._dbService.findUniqueProject({where:{projectId},include:this._selectProjectFeilds});
            return GrpcResponse.OK(project, "Project found");
        } catch (e:any) {
            return this._errHandler(e,"GET-PROJECT",reqMeta.requestId);
        }
    }

    async getProjectsLinkedToTeam({teamId,authUserData,reqMeta}:GetProjectsLinkedToTeamRequestBodyType){
        try {
            const projectIds = await this._authService.getUserProjectIdsLinkedToTeam({authUserData,teamId,reqMeta});
            const projects = await this._dbService.findManyProjects({where:{
                projectId:{in:projectIds}
            },
            select:{
                projectId:true,
                name:true
            }
            });
            return GrpcResponse.OK(projects,"Projects found");
        } catch (e:any) {
            return this._errHandler(e,"GET-PROJECTS-LINKED-TO-TEAM",reqMeta.requestId);
        }
    }

    async getAllUserProjects({authUserData,reqMeta,limit,skip}:BulkResourceRequestBodyType){
        try {
            const projectIds = await this._authService.getUserProjectIds(authUserData,reqMeta);
            const projects = await this._dbService.findManyProjects({where:{
                projectId:{in:projectIds}
            },
            take:limit,
            skip,
            include:this._selectProjectFeilds});
            return GrpcResponse.OK(projects, "Projects found");
        } catch (e:any) {
            return this._errHandler(e,"GET-ALL-USER-PROJECTS",reqMeta.requestId);
        }
    }

    async getLatestUserProjects({authUserData,reqMeta,limit}:BulkResourceRequestBodyType){
        try {
            const projectIds = await this._authService.getUserProjectIds(authUserData,reqMeta);
            const projects =  await this._dbService.findManyProjects({where:{
                projectId:{in:projectIds}
            },
            take:limit,
            orderBy:{
                createdAt:"desc"
            },
            include:this._selectProjectFeilds})
            return GrpcResponse.OK(projects, "Projects found");
        } catch (e:any) {
            return this._errHandler(e,"GET-LATEST-USER-PROJECTS",reqMeta.requestId);
        }
    }

    async updateProject({authUserData,reqMeta,...body}:UpdateProjectRequestBodyType){
        try {
            await this._authService.getPermissions({
                authUserData,
                scope:"PROJECT",
                resourceId:body.projectId,
                errMsg:"You do not have permission to update this project",
                permissions:["UPDATE"],
                reqMeta
            });
            if(body.updates.framework){
               await this._dbService.findUniqueFrameworkById(body.updates.framework.frameworkId);
            }
            const project = await this._dbService.updateProjectById({projectId:body.projectId,...body.updates});
            return GrpcResponse.OK(project, "Project updated");
        } catch (e:any) {
            return this._errHandler(e, "UPDATE-PROJECT", reqMeta.requestId);
        }
    }

    async deleteProject({authUserData,projectId,reqMeta}:GetProjectRequestBodyType) {
        try {
            await this._authService.getPermissions({
                authUserData,
                scope:"PROJECT",
                resourceId:projectId,
                errMsg:"You do not have permission to delete this project",
                permissions:["DELETE"],
                reqMeta
            });
            const project = await this._dbService.deleteProjectById(projectId);
            this._asyncErrHandler.call(this._projectProducer.publishProjectEvent({
                event:"DELETED",
                projectId,
                userId:authUserData.userId,
                projectType:project.framework.applicationType,
                requestId:reqMeta.requestId
            }),"DELETE-PROJECT",reqMeta.requestId);
            return GrpcResponse.OK(project, "Project deleted");
        } catch (e:any) {
            return this._errHandler(e, "DELETE-PROJECT", reqMeta.requestId);
        }
    }

    async upsertEnvironmentVariables({authUserData,reqMeta,...body}:UpsertEnvVarsRequestBodyType) {
        try {
            await this._authService.getPermissions({
                authUserData,
                scope:"PROJECT",
                resourceId:body.projectId,
                errMsg:"You do not have permission to update environment variables of this project",
                permissions:["UPDATE"],
                reqMeta
            });
            const project = await this._dbService.createEnvironmentVariable(body);
            return GrpcResponse.OK(project, "Environment variables updated");
        } catch (e:any) {
            return this._errHandler(e, "UPSERT-ENVIRONMENT-VARIABLES", reqMeta.requestId);
        }
    }

    async deleteEnvironmentVariable({authUserData,reqMeta,...body}:DeleteEnvVarsRequestBodyType) {
        try {
            await this._authService.getPermissions({
                authUserData,
                scope:"PROJECT",
                resourceId:body.projectId,
                errMsg:"You do not have permission to delete environment variables of this project",
                permissions:["DELETE"],
                reqMeta
            });
            const project = await this._dbService.deleteEnvironmentVariable(body);
            return GrpcResponse.OK(project, "Environment variable deleted");
        } catch (e:any) {
            return this._errHandler(e, "DELETE-ENVIRONMENT-VARIABLE", reqMeta.requestId);
        }
    }

    async getEnvironmentVariables({authUserData,reqMeta,...body}:GetEnvVarsRequestBodyType) {
        try {
            await this._authService.getPermissions({
                authUserData,
                scope:"PROJECT",
                resourceId:body.projectId,
                errMsg:"You do not have permission to read environment variables of this project",
                permissions:["READ"],
                reqMeta
            });
            const envVars = await this._dbService.findManyEnvironmentVariablesByProjectId(body);
            return GrpcResponse.OK(envVars, "Environment variables found");
        } catch (e:any) {
            return this._errHandler(e, "GET-ENVIRONMENT-VARIABLES", reqMeta.requestId);
        }
    }

    async getFrameworks({reqMeta}:BodyLessRequestBodyType){
        try {
            const frameworks = await this._dbService.findManyFrameworks({
                orderBy:{
                    displayName:"asc"
                }
            });
            return GrpcResponse.OK(frameworks, "Frameworks found");
        } catch (e:any) {
            return this._errHandler(e, "GET-FRAMEWORKS", reqMeta.requestId);
        }
    }

    async IGetProject({reqMeta,...where}:IGetProjectRequestBodyType){
        try {
            const project = await this._dbService.findUniqueProject({where,include:this._selectProjectFeilds});
            return GrpcResponse.OK(project, "Project found");
        } catch (e:any) {
            return this._errHandler(e,"I-GET-PROJECT",reqMeta.requestId);
        }
    }

     async IGetStaleEnvironmentIds({reqMeta}:InternalEmptyRequestBodyType){
          try {
               const threeDaysAgo = new Date();
               threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
               const dbClient = this._dbService.getClient()
               const [staleBuildIds, staleRuntimeIds] = await dbClient.$transaction([
                dbClient.buildEnvironment.findMany({
                    where:{
                        OR:[
                            {active:false}
                        ]
                    },
                    select:{
                        buildId:true
                    }
                 }),
                  dbClient.runtimeEnvironment.findMany({
                    where:{
                        OR:[
                            {active:false}
                        ]
                    },
                    select:{
                        runtimeId:true
                    }
                 })
               ])

               const res = [...new Set([
                ...staleBuildIds.map(b=>b.buildId),
                ...staleRuntimeIds.map(r=>r.runtimeId)
               ])]
               const [res1,res2] = await dbClient.$transaction([
                dbClient.buildEnvironment.deleteMany({
                    where:{
                        buildId:{in:staleBuildIds.map(b=>b.buildId)}
                    }
                }),
                dbClient.runtimeEnvironment.deleteMany({
                    where:{
                        runtimeId:{in:staleRuntimeIds.map(r=>r.runtimeId)}
                    }
                })
               ])
               return GrpcResponse.OK(res, "Stale environment ids found");
       } catch (e:any) {
           return this._errHandler(e,"I-GET-STALE-ENVIRONMENT-IDS",reqMeta.requestId);
       }
     }

     async checkDomainAvailability({reqMeta,domain}:CheckDomainAvailabilityRequestBodyType) {
        try {
            await this._dbService.findUniqueProject({
                where:{
                    domain
                },
                select:{
                    projectId:true
                }
            });
            return GrpcResponse.OK({isAvailable:false},"Domain is unavailable")
        } catch (e:any) {
            if(e.code === status.NOT_FOUND) return GrpcResponse.OK({isAvailable:true},"Domain is available");
            return this._errHandler(e,"CHECK-DOMAIN-AVAILABILITY",reqMeta.requestId);
        }
    }
}
