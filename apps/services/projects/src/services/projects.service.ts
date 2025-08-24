import { Prisma } from "@prisma/index";
import { createAsyncErrHandler, createGrpcErrorHandler } from "@shipoff/services-commons";
import { GrpcResponse } from "@shipoff/services-commons/utils/rpc-utils";
import { BodyLessRequestBodyType, BulkResourceRequestBodyType } from "@shipoff/types";
import { Database, dbService } from "@/db/db-service";
import authExternalService, { AuthExternalService } from "@/externals/auth.external.service";
import { CreateProjectRequestBodyType, DeleteEnvVarsRequestBodyType, GetEnvVarsRequestBodyType, GetProjectRequestBodyType, IGetProjectRequestBodyType, UpdateProjectRequestBodyType, UpsertEnvVarsRequestBodyType } from "@/types/projects";
import { ProjectProducer } from "@/producer/project.producer";


export class ProjectsService {
    private _dbService: Database;
    private _authService: AuthExternalService;
    private _errHandler : ReturnType<typeof createGrpcErrorHandler>
    private _asyncErrHandler: ReturnType<typeof createAsyncErrHandler>
    private _selectProjectFeilds:Prisma.ProjectSelect
    private _projectProducer: ProjectProducer;

    constructor() {
        this._errHandler = createGrpcErrorHandler({serviceName:"PROJECT_SERVICE"});
        this._asyncErrHandler = createAsyncErrHandler({serviceName:"PROJECT_SERVICE"});
        this._selectProjectFeilds = {
                repository:true,
                name:true,
                domain:true,
                framework:true,
                buildCommand:true,
                prodCommand:true,
                projectId:true,
                environmentVariables:{
                    select:{
                        envName:true,
                        envValue:true
                    }
                },
                createdAt:true,
                updatedAt:true
            }
        this._dbService = dbService;
        this._authService = authExternalService;
        this._projectProducer = new ProjectProducer();
    }

    async createProject({authUserData:{userId},...body}: CreateProjectRequestBodyType) {
        try {
           const fw = await this._dbService.findUniqueFrameworkById(body.frameworkId);
           if(fw.applicationType==="STATIC"){
               delete body.prodCommand;
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
               userId
           }),"CREATE-PROJECT");

           return GrpcResponse.OK(project, "Project created");
        } catch (e:any) {
            return this._errHandler(e, "CREATE-PROJECT");
        }
    }

    async getProject({authUserData,projectId}:GetProjectRequestBodyType){
        try {
            await this._authService.getPermissions({authUserData,permissions:["READ"],scope:"PROJECT",resourceId:projectId,errMsg:"You do not have permission to read this project"});
            const project = await this._dbService.findUniqueProjectById(projectId,this._selectProjectFeilds);
            return GrpcResponse.OK(project, "Project found");
        } catch (e:any) {
            return this._errHandler(e,"GET-PROJECT");
        }
    }

    async IGetProject({projectId}:IGetProjectRequestBodyType){
        try {
            const project = await this._dbService.findUniqueProjectById(projectId,this._selectProjectFeilds);
            return GrpcResponse.OK(project, "Project found");
        } catch (e:any) {
            return this._errHandler(e,"GET-PROJECT");
        }
    }

    async getAllUserProjects({authUserData}:BodyLessRequestBodyType){
        try {
            const projectIds = await this._authService.getUserProjectIds(authUserData);
            const projects = await this._dbService.findManyProjects({where:{
                projectId:{in:projectIds}
            },
            select:this._selectProjectFeilds})
            return GrpcResponse.OK(projects, "Projects found");
        } catch (e:any) {
            return this._errHandler(e,"GET-ALL-USER-PROJECTS");
        }
    }

    async updateProject({authUserData,...body}:UpdateProjectRequestBodyType){
        try {
            await this._authService.getPermissions({
                authUserData,
                scope:"PROJECT",
                resourceId:body.projectId,
                errMsg:"You do not have permission to update this project",
                permissions:["UPDATE"]
            });
            if(body.updates.framework){
               await this._dbService.findUniqueFrameworkById(body.updates.framework.frameworkId);
            }
            const project = await this._dbService.updateProjectById(body);
            return GrpcResponse.OK(project, "Project updated");
        } catch (e:any) {
            return this._errHandler(e, "UPDATE-PROJECT");
        }
    }

    async deleteProject({authUserData,projectId}:GetProjectRequestBodyType) {
        try {
            await this._authService.getPermissions({
                authUserData,
                scope:"PROJECT",
                resourceId:projectId,
                errMsg:"You do not have permission to delete this project",
                permissions:["DELETE"]
            });
            const project = await this._dbService.deleteProjectById(projectId);
            this._asyncErrHandler.call(this._projectProducer.publishProjectEvent({
                event:"DELETED",
                projectId,
                userId:authUserData.userId
            }),"DELETE-PROJECT");
            return GrpcResponse.OK(project, "Project deleted");
        } catch (e:any) {
            return this._errHandler(e, "DELETE-PROJECT");
        }
    }

    async upsertEnvironmentVariables({authUserData,...body}:UpsertEnvVarsRequestBodyType) {
        try {
            await this._authService.getPermissions({
                authUserData,
                scope:"PROJECT",
                resourceId:body.projectId,
                errMsg:"You do not have permission to update environment variables of this project",
                permissions:["UPDATE"]
            });
            const project = await this._dbService.createEnvironmentVariable(body);
            return GrpcResponse.OK(project, "Environment variables updated");
        } catch (e:any) {
            return this._errHandler(e, "UPSERT-ENVIRONMENT-VARIABLES");
        }
    }

    async deleteEnvironmentVariable({authUserData,...body}:DeleteEnvVarsRequestBodyType) {
        try {
            await this._authService.getPermissions({
                authUserData,
                scope:"PROJECT",
                resourceId:body.projectId,
                errMsg:"You do not have permission to delete environment variables of this project",
                permissions:["DELETE"]
            });
            const project = await this._dbService.deleteEnvironmentVariable(body);
            return GrpcResponse.OK(project, "Environment variable deleted");
        } catch (e:any) {
            return this._errHandler(e, "DELETE-ENVIRONMENT-VARIABLE");
        }
    }

    async getEnvironmentVariables({authUserData,...body}:GetEnvVarsRequestBodyType) {
        try {
            await this._authService.getPermissions({
                authUserData,
                scope:"PROJECT",
                resourceId:body.projectId,
                errMsg:"You do not have permission to read environment variables of this project",
                permissions:["READ"]
            });
            const envVars = await this._dbService.findManyEnvironmentVariablesByProjectId(body);
            return GrpcResponse.OK(envVars, "Environment variables found");
        } catch (e:any) {
            return this._errHandler(e, "GET-ENVIRONMENT-VARIABLES");
        }
    }

    async getFrameworks({skip,limit}:BulkResourceRequestBodyType){
        try {
            const frameworks = await this._dbService.findManyFrameworks({
                skip,
                orderBy:{
                    displayName:"asc"
                },
                take:limit
            });
            return GrpcResponse.OK(frameworks, "Frameworks found");
        } catch (e:any) {
            return this._errHandler(e, "GET-FRAMEWORKS");
        }
    }
}
