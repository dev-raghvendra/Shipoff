import { createGrpcErrorHandler, GrpcResponse } from "@shipoff/services-commons";
import { Database, dbService } from "@/db/db-service";
import { DeploymentEventProducerService } from "@/producer/deployment.producer";
import githubExternalService, { GithubExternalService } from "@/externals/github.external.service";
import { verifySignature } from "@/libs/crypto";
import { CreateDeploymentRequestDBBodyType } from "@/types/deployments";
import { GithubWebhookRequestType, DeploymentWebhookPayload, CreateGithubInstallationRequestBodyType } from "@/types/webhooks";

export class GithubWebhookService {
    private _dbService: Database;
    private _errHandler: ReturnType<typeof createGrpcErrorHandler>;
    private _githubService: GithubExternalService
    private _deploymentProducer: DeploymentEventProducerService;

    constructor() {
        this._dbService = dbService;
        this._errHandler = createGrpcErrorHandler({ serviceName: "GITHUB_WEBHOOK_SERVICE" });   
        this._githubService = githubExternalService;
        this._deploymentProducer = new DeploymentEventProducerService();
    }

    private async codePushed(payload:string,signature:string) {
       try {
          await verifySignature(payload, signature);
          const body = JSON.parse(payload) as DeploymentWebhookPayload;
          const repo = await this._dbService.findUniqueRepository({
            where:{
                githubRepoId:body.repository.id.toString()
            }
          })
          if(body.ref !== repo.project.branch) return GrpcResponse.OK(null, "No new deployment, branch is same as last deployment");
              const deploymentData  : CreateDeploymentRequestDBBodyType = {
              projectId:repo.projectId,
              commitHash:body.head_commit?.id || "unknown",
              status:"QUEUED",
              commitMessage:body.head_commit?.message || "no commit message",
              author:body.head_commit?.author.name || "unknown",
              repositoryId:repo.repositoryId
          }
          const res = await Promise.all([
              this._dbService.createDeployment(deploymentData),
              this._deploymentProducer.publishDeploymentRequested({
                  repoFullName:repo.githubRepoName,
                  branch:repo.project.branch,
                  projectId:repo.projectId,
                  domain:repo.project.domain
              })
          ]);
          
          return GrpcResponse.OK(res, "Deployment created");
       } catch (e:any) {
           return this._errHandler(e, "CREATE-DEPLOYMENT");
       }
    }

    private async repositoryDeleted(payload:string, signature:string) {
        try {
            await verifySignature(payload, signature);
            const body = JSON.parse(payload) as {repository: {id: number, full_name: string}};
            const repo = await this._dbService.deleteUniqueRepository({
                where: {
                    githubRepoId: body.repository.id.toString(),
                }
            });
            return GrpcResponse.OK(repo, "Repository deleted successfully");
        } catch (e:any) {
            return this._errHandler(e, "DELETE-REPOSITORY");
        }
    }

    private async installationDeleted(payload:string, signature:string){
        try {
            await verifySignature(payload, signature);
            const body = JSON.parse(payload) as {installation: {id: number}};
            const installation = await this._dbService.deleteGithubInstallation({
                where: {
                    githubInstallationId: body.installation.id.toString()
                }
            });
            return GrpcResponse.OK(installation, "Github installation deleted successfully");
        } catch (e:any) {
            return this._errHandler(e, "DELETE-GITHUB-INSTALLATION");
        }
    }

    private async repositoryRemovedFromInstallation(payload:string, signature:string) {
        try {
            await verifySignature(payload, signature);
            const body = JSON.parse(payload) as {repositories: {id: number}[]};
            const res =await this._dbService.deleteManyRepositories({
                where: {
                     githubRepoId:{
                        in: body.repositories.map(repo => repo.id.toString())
                     }
                    }
            });
            return GrpcResponse.OK(res, "Repositories removed from installation");
        } catch (e:any) {
            return this._errHandler(e, "REMOVE-REPOSITORIES-FROM-INSTALLATION");
        }
    }

    async webhooks({payload,signature,eventType,action}:GithubWebhookRequestType){
        try {
            switch(eventType) {
                case "push":
                    return this.codePushed(payload, signature);
                case "repository":
                    if(action === "deleted") {
                        return this.repositoryDeleted(payload, signature);
                    }
                    return GrpcResponse.OK(null, "No action taken for repository event");
                case "installation":
                    if(action === "deleted") {
                        return this.installationDeleted(payload, signature);
                    } 
                    return GrpcResponse.OK(null, "No action taken for installation event");
                case "installation_repositories":
                    if(action === "removed") {
                        return this.repositoryRemovedFromInstallation(payload, signature);
                    }
                    return GrpcResponse.OK(null, "No action taken for installation repositories event");
                default:
                    return GrpcResponse.OK(null, "No action taken for unknown event type");
            }
        } catch (e:any) {
            return this._errHandler(e, "GITHUB-WEBHOOK");
        }
    }

    async createGithubInstallation({authUserData:{userId}, installation_id}:CreateGithubInstallationRequestBodyType) {
        try {
            const {githubInstallationId,githubUserName} = await this._githubService.getInstallationDetails(installation_id);
            const res = await this._dbService.createGithubInstallation({
                data:{
                    githubInstallationId,
                    githubUserName,
                    userId
                }
            })
            return GrpcResponse.OK(res, "Github installation created successfully");
        } catch (e:any) {
            return this._errHandler(e, "CREATE-GITHUB-INSTALLATION");
        }
    }
    
}



