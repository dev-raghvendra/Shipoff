import {Prisma, PrismaClient} from "@prisma/client"
import { generateId, GrpcAppError } from "@shipoff/services-commons";
import { CreateProjectRequestDBBodyType, DeleteEnvVarsRequestDBBodyType, GetEnvVarsRequestDBBodyType, UpdateProjectRequestDBBodyType, UpsertEnvVarsRequestDBBodyType } from "types/projects";
import {status} from "@grpc/grpc-js";
import { DefaultArgs, PrismaClientKnownRequestError } from "@prisma/runtime/library";
import { CreateDeploymentRequestDBBodyType } from "types/deployments";
import { CreateRepositoryRequestDBBodyType } from "types/repositories";
import { RetryThrottler } from "@grpc/grpc-js/build/src/retrying-call";
import { Deployment } from "@shipoff/proto";

const MODEL_MAP = {
    Project:"prj",
    Repository:"repo",
    Deployment:"dep",
    EnvironmentVariable:"env-var"
} as const;
export class Database {
    private _client : PrismaClient;
    constructor(){
        this._client = new PrismaClient();
    }

    async createProject(body:CreateProjectRequestDBBodyType){
      try {
        const projectId = generateId("Project", MODEL_MAP);
        const res = await this._client.project.create({
        data: {
            projectId,
            name: body.name,
            domain:body.domain,
            frameworkId:body.frameworkId,
            prodCommand:body.prodCommand,
            buildCommand:body.buildCommand,
            outDir:body.outDir,
            repository:{
                create:{
                    repositoryId:generateId("Repository", MODEL_MAP),
                    githubRepoId:body.githubRepoId,
                    githubRepoFullName:body.githubRepoFullName,
                    githubRepoURI:body.githubRepoURI,
                    branch:body.branch,
                    githubInstallationId:body.githubInstallationId
                }
            },
            environmentVariables:{
                create:body.environmentVars?.map(envVar=>({
                name:envVar.name,
                value:envVar.value
               }))
            }
        },
        include:{
            repository:true,
            framework:true,
            environmentVariables:true
        }
    })

      return res;
      } catch (error) {
        if(error instanceof PrismaClientKnownRequestError) {
            if(error.code === "P2002") {
                if((error.meta?.target as string[]).includes("name")) {
                  throw new GrpcAppError(status.ALREADY_EXISTS,"Environment variable names must be unique");
               }
               else if((error.meta?.target as string[]).includes("domain")) {
                  throw new GrpcAppError(status.ALREADY_EXISTS,"Project with the provided domain already exists");
               }
               else if((error.meta?.target as string[]).some(target=>target.includes("github"))) {
                   throw new GrpcAppError(status.ALREADY_EXISTS,"Github repository is already linked with a project");
               }
            }
        }
        throw new GrpcAppError(status.INTERNAL, "Failed to create project", {
            error
        });
      }
    }

    async findUniqueProject<T extends Prisma.ProjectFindUniqueArgs>(args:T): Promise<Prisma.ProjectGetPayload<T>>{
        const res = await this._client.project.findUnique(args);
        if(res)return res as Prisma.ProjectGetPayload<T>; 
        throw new GrpcAppError(status.NOT_FOUND, "Project not found", {
            projectId: args.where.projectId
        });
    }

    async findManyProjects(arg:Prisma.ProjectFindManyArgs){
        const res = await this._client.project.findMany(arg);
        if(res.length)return res;
        throw new GrpcAppError(status.NOT_FOUND, "User does not have any projects");
    }

    async updateProjectById({projectId,framework,...rest}:UpdateProjectRequestDBBodyType){
        try {
            const res = await this._client.project.update({
                where:{
                    projectId
                },
                data:{
                    ...rest,
                    ...(framework ? {...framework} : {})
                }
            })
            return res;
        } catch (e:any) {
            if(e instanceof PrismaClientKnownRequestError) {
                if(e.code === "P2025") {
                    throw new GrpcAppError(status.NOT_FOUND, "Project not found", {
                        projectId
                    });
                }
                else if(e.code === "P2002") {
                    throw new GrpcAppError(status.ALREADY_EXISTS, "Project with domain name already exists", {
                        domain: rest.domain
                    });
                }
            }
            throw new GrpcAppError(status.INTERNAL, "Unexpected error occurred", {
                error: e
            });
        }
    }

    async deleteProjectById(projectId:string){
        try {
            const res = await this._client.project.delete({
                where: { projectId },
                include:{
                    framework:true,
                }
            });
            return res;
        } catch (e:any) {
            if(e instanceof PrismaClientKnownRequestError) {
                if(e.code === "P2025") {
                    throw new GrpcAppError(status.NOT_FOUND, "Project not found", {
                        projectId
                    });
                }
            }
            throw new GrpcAppError(status.INTERNAL, "Unexpected error occurred", {
                error: e
            });
        }
    }

    async createDeployment(body:CreateDeploymentRequestDBBodyType){
        try {
            const deploymentId = generateId("Deployment", MODEL_MAP);
            const res = this.startTransaction(async(tx)=>{
                await tx.deployment.updateMany({
                    where:{
                        projectId:body.projectId,
                        status:"QUEUED"
                    },
                    data:{
                        status:"INACTIVE"
                    }
                })

                return tx.deployment.create({
                    data:{
                        deploymentId,
                        ...body
                    }
                })
            })
            return res;
        } catch (e:any) {
            if(e instanceof PrismaClientKnownRequestError) {
                if(e.code === "P2002") {
                    throw new GrpcAppError(status.ALREADY_EXISTS, "Deployment with this commit hash already exists", {
                        commitHash: body.commitHash
                    });
                }
            }
            throw new GrpcAppError(status.INTERNAL, "Failed to create deployment", {
                error: e
            });
        }
    }

    async findUniqueDeploymentById(deploymentId: string) {
        
        const res = await this._client.deployment.findUnique({
            where: { deploymentId },
            select:{
                    project:{
                        select:{
                            projectId:true,
                            domain:true,
                            framework:{
                                select:{
                                  applicationType:true
                                }
                            }
                        }
                    },
                    repository:{
                        select:{
                            githubRepoFullName:true,
                            githubRepoId:true,
                            branch:true
                        }
                    },
                    commitHash:true,
                    deploymentId:true,
                    commitMessage:true,
                    author:true,
                    createdAt:true,
                    status:true,
                    buildEnvironment:{orderBy:{startedAt:"desc"},take:1,select:{ buildId:true, startedAt:true }},
                    runtimeEnvironment:{orderBy:{startedAt:"desc"},take:1,select:{ runtimeId:true, startedAt:true }}
            }
        });
        if(res)return res;
        throw new GrpcAppError(status.NOT_FOUND, "Deployment not found", {
            deploymentId
        });
    }

    async updateDeploymentById(deploymentId:string, projectId:string, data:Partial<Omit<CreateDeploymentRequestDBBodyType,"projectId"> & {lastDeployedAt?:string}>) {
        try {
            const res = await this.startTransaction(async(tx)=>{
                if(data.status === "QUEUED"){
                    await tx.deployment.updateMany({
                        where:{
                            projectId,
                            status:"QUEUED"
                        },
                        data:{
                            status:"INACTIVE"
                        }
                    })
                }
                return tx.deployment.update({
                    where:{
                        deploymentId,
                        projectId
                    },
                    data,
                    select:{
                    project:{
                        select:{
                            projectId:true,
                            domain:true,
                            framework:{
                                select:{
                                  applicationType:true
                                }
                            }
                        }
                    },
                    repository:{
                        select:{
                            githubRepoFullName:true,
                            githubRepoId:true,
                            branch:true
                        }
                    },
                    commitHash:true,
                    deploymentId:true,
                    commitMessage:true,
                    author:true,
                    createdAt:true,
                    status:true
            }
                })
            })
            return res;
        } catch (e:any) {
            if(e instanceof PrismaClientKnownRequestError) {
                if(e.code === "P2025") {
                    throw new GrpcAppError(status.NOT_FOUND, "Deployment not found", {
                        deploymentId
                    });
                }
                else if(e.code === "P2002") {
                    throw new GrpcAppError(status.ALREADY_EXISTS, "Deployment with this commit hash already exists", {
                        commitHash: data.commitHash
                    });
                }
            }
            throw new GrpcAppError(status.INTERNAL, "Unexpected error occurred", {
                error: e
            });
        }
    }

    async findManyDeployments<T extends Prisma.DeploymentFindManyArgs>(args:T){
        const res = await this._client.deployment.findMany(args);
        if(res.length)return res as Prisma.DeploymentGetPayload<T>[];
        throw new GrpcAppError(status.NOT_FOUND, "No deployments found");
    }

    async deleteDeploymentById(deploymentId: string) {
        try {
            const res = await this._client.deployment.delete({
                where: { deploymentId },
                select:{
                    project:{
                        select:{
                            projectId:true,
                            domain:true,
                            framework:{
                                select:{
                                  applicationType:true
                                }
                            }
                        }
                    },
                    repository:{
                        select:{
                            githubRepoFullName:true,
                            githubRepoId:true,
                            branch:true
                        }
                    },
                    commitHash:true,
                    deploymentId:true,
                    commitMessage:true,
                    author:true,
                    createdAt:true
                }
            });
            return res;
        } catch (e:any) {
            if(e instanceof PrismaClientKnownRequestError) {
                if(e.code === "P2025") {
                    throw new GrpcAppError(status.NOT_FOUND, "Deployment not found", {
                        deploymentId
                    });
                }
            }
            throw new GrpcAppError(status.INTERNAL, "Unexpected error occurred", {
                error: e
            });
        }
    }

    async createRepository(body:CreateRepositoryRequestDBBodyType){
        try {
            const res = await this._client.repository.create({
                data:{
                    repositoryId:generateId("Repository",MODEL_MAP),
                    githubRepoId:body.githubRepoId,
                    projectId:body.projectId,
                    githubInstallationId:body.githubInstallationId,
                    githubRepoFullName:body.githubRepoFullName,
                    githubRepoURI:body.githubRepoURI
                }
            })
            return res;
        } catch (e:any) {
             if(e instanceof PrismaClientKnownRequestError) {
            if(e.code === "P2002") {
                if((e.meta?.target as string[]).includes("projectId")){
                    throw new GrpcAppError(status.ALREADY_EXISTS, "Project is already linked to a repository", {
                    domain:body.projectId
                });
                }
                else{
                    throw new GrpcAppError(status.ALREADY_EXISTS, "Project with this github repository already exists", {
                    domain:body.githubRepoId
                });
                }
                }
            }
            throw new GrpcAppError(status.INTERNAL, "Failed to create repository", e);
        }
    }

    async findUniqueRepository<T extends Prisma.RepositoryFindUniqueArgs>(args:T):Promise<Prisma.RepositoryGetPayload<T>>{
        const res = await this._client.repository.findUnique(args);
        if(res)return res as Prisma.RepositoryGetPayload<T> ;
        throw new GrpcAppError(status.NOT_FOUND, "Repository not found", {
            args
        });
    }
    
    async deleteUniqueRepository(args:Prisma.RepositoryDeleteArgs){
        try {
            const res = await this._client.repository.delete(args);
            return res;
        } catch (e:any) {
            if(e instanceof PrismaClientKnownRequestError) {
                if(e.code === "P2025") {
                    throw new GrpcAppError(status.NOT_FOUND, "Repository not found for project", {
                            repositoryId: args.where.projectId
                    });
                }
            }
            throw new GrpcAppError(status.INTERNAL, "Unexpected error occurred", {
                error: e
            });
        }
    }

    async deleteManyRepositories(args:Prisma.RepositoryDeleteManyArgs){
        try {
            const res = await this._client.repository.deleteMany(args);
            if(res.count === 0) {
                throw new GrpcAppError(status.NOT_FOUND, "No repositories found for the given criteria", {
                    where: args.where
                });
            }
            return res;
        } catch (e:any) {
            if(e instanceof PrismaClientKnownRequestError) {
                if(e.code === "P2025") {
                    throw new GrpcAppError(status.NOT_FOUND, "Repositories not found for project", {
                        where: args.where
                    });
                }
            }
            throw new GrpcAppError(status.INTERNAL, "Unexpected error occurred", {
                error: e
            });
        }
    }

    async createGithubInstallation(args:Prisma.GithubInstallationCreateArgs){
        try {
            const res = await this._client.githubInstallation.create(args);
            return res;
        } catch (e:any) {
            if(e instanceof PrismaClientKnownRequestError) {
                if(e.code === "P2002") {
                    throw new GrpcAppError(status.ALREADY_EXISTS, "Github installation already exists", {
                        domain: args.data.githubInstallationId
                    });
                }
            }
            throw new GrpcAppError(status.INTERNAL, "Failed to create Github installation", {
                e
            });
        }
    }

    async findUniqueGithubInstallation(args:Prisma.GithubInstallationFindUniqueArgs){
        const res = await this._client.githubInstallation.findUnique(args);
        if(res)return res;
        throw new GrpcAppError(status.NOT_FOUND, "Github Installation not found", {
            args
        });
    }

    async deleteGithubInstallation(args:Prisma.GithubInstallationDeleteArgs){
        try {
            const res = await this._client.githubInstallation.delete(args);
            return res;
        } catch (e:any) {
            if(e instanceof PrismaClientKnownRequestError) {
                if(e.code === "P2025") {
                    throw new GrpcAppError(status.NOT_FOUND, "Github Installation not found", {
                        githubInstallationId: args.where.githubInstallationId
                    });
                }
            }
            throw new GrpcAppError(status.INTERNAL, "Unexpected error occurred", {
                error: e
            });
        }
    }

    async createFramework(args: Prisma.FrameworkCreateManyArgs) {
        try {
            const res = await this._client.framework.createMany(args);
            return res;
        } catch (e:any) {
            if(e instanceof PrismaClientKnownRequestError) {
                if(e.code === "P2002") {
                    throw new GrpcAppError(status.ALREADY_EXISTS, "Framework already exists", e);
                }
            }
            throw new GrpcAppError(status.INTERNAL, "Failed to create Framework", {
                e
            });
        }
    }

    async findUniqueFrameworkById(frameworkId: string) {
        const res = await  this._client.framework.findUnique({
            where: { frameworkId }
        });
        if(res)return res;
        throw new GrpcAppError(status.NOT_FOUND, "Framework not found", {
            frameworkId
        });
    }

    async findManyFrameworks(args: Prisma.FrameworkFindManyArgs) {
        const res = await this._client.framework.findMany(args);
        if(res.length)return res;
        throw new GrpcAppError(status.NOT_FOUND, "Frameworks not found", {
            args
        });
    }

    async createEnvironmentVariable({projectId,envs}:UpsertEnvVarsRequestDBBodyType){
        if(!envs) throw new GrpcAppError(status.INVALID_ARGUMENT, "Environment variables are required");
        const values = envs.map((_,i)=> `($1, $${i+2}, $${i+3})`).join(", ")
        const params = [projectId, ...envs.flatMap(envVar=> [envVar.name, envVar.value])];
        const q = `INSERT INTO "EnvironmentVariable" ("projectId","name","value") VALUES ${values} ON CONFLICT ("projectId", "name") DO UPDATE SET "value" = EXCLUDED."value"`
        const res = await this._client.$executeRawUnsafe(q,...params);
        if(res) return res;
        throw new GrpcAppError(status.INTERNAL, "Failed to create environment variables", {
            projectId,
            envs
        });
    }
    
    async deleteEnvironmentVariable({projectId,name}:DeleteEnvVarsRequestDBBodyType){
        try {
            const res = await this._client.environmentVariable.delete({
                where: {
                    projectId_name: {
                        projectId,
                        name
                    }
                }
            });
            return res;
        } catch (e:any) {
            if(e instanceof PrismaClientKnownRequestError) {
                if(e.code === "P2025") {
                    throw new GrpcAppError(status.NOT_FOUND, "Environment variable not found", {
                        projectId,
                        name
                    });
                }
            }
            throw new GrpcAppError(status.INTERNAL, "Unexpected error occurred", {
                error: e
            });
        }
    }

    async findManyEnvironmentVariablesByProjectId({projectId}:GetEnvVarsRequestDBBodyType){
        const res = await this._client.environmentVariable.findMany({
            where: { projectId }
        });
        if(res)return res;
        throw new GrpcAppError(status.NOT_FOUND, "Environment variables not found", {
            projectId
        });
    }
    startTransaction<T extends any>(fn:(tx: Omit<PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">)=>Promise<T>){
        return this._client.$transaction(fn)
    }

    startParallelTransaction(fn:(client:PrismaClient)=>Promise<any>[]){
        return Promise.all([fn(this._client)])
    }
    getClient(){
        return this._client
    }
}


export const dbService = new Database();