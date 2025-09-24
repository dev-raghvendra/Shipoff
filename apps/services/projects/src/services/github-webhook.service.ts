import { createGrpcErrorHandler, GrpcResponse } from "@shipoff/services-commons";
import { Database, dbService } from "@/db/db-service";
import { DeploymentEventProducerService } from "@/producer/deployment.producer";
import { verifySignature } from "@/libs/crypto";
import { CreateDeploymentRequestDBBodyType } from "@/types/deployments";
import { DeploymentWebhookPayload, GithubWebhookRequestBodyType } from "@/types/webhooks";
import { $DeploymentEvent } from "@shipoff/redis";
import { logger } from "@/libs/winston";

export class GithubWebhookService {
    private _dbService: Database;
    private _errHandler: ReturnType<typeof createGrpcErrorHandler>;
    private _deploymentProducer: DeploymentEventProducerService;

    constructor() {
        this._dbService = dbService;
        this._errHandler = createGrpcErrorHandler({ subServiceName: "GITHUB_WEBHOOK_SERVICE", logger });
        this._deploymentProducer = new DeploymentEventProducerService();
    }

    private async codePushed(payload:string, signature:string, requestId:string) {
       try {
          await verifySignature(payload, signature);
          const parsedPayload = JSON.parse(payload) as DeploymentWebhookPayload;
          const repo = await this._dbService.findUniqueRepository({
            where:{
                githubRepoId:parsedPayload.repository.id.toString()
            },
            select:{
                repositoryId:true,
                projectId:true,
                project:{
                    select:{
                        domain:true,
                        framework:true
                    }
                },
                branch:true
            }
          })
          if(parsedPayload.ref.replace("refs/heads/","") !== repo.branch) return GrpcResponse.OK(null, "No new deployment, branch is same as last deployment");
              const deploymentData  : CreateDeploymentRequestDBBodyType = {
              projectId:repo.projectId,
              commitHash:parsedPayload.head_commit?.id || "unknown",
              status:"QUEUED",
              commitMessage:parsedPayload.head_commit?.message || "no commit message",
              author:parsedPayload.head_commit?.author.name || "unknown",
              repositoryId:repo.repositoryId
          }
            const deployment = await this._dbService.startTransaction(async(tx)=>{
               await tx.deployment.updateMany({
                    where:{
                        projectId:repo.projectId,
                        status:"QUEUED"
                    },
                    data:{
                        status:"INACTIVE"
                    }
                })
                return tx.deployment.create({
                    data:deploymentData
                })
            });
            await this._deploymentProducer.publishDeploymentRequested({
                event:$DeploymentEvent.CREATED,
                projectId:repo.projectId,
                domain:repo.project.domain,
                deploymentId:deployment.deploymentId,
                commitHash:deployment.commitHash,
                projectType:repo.project.framework.applicationType,
                requestId
            });

          return GrpcResponse.OK(deployment, "Deployment created");
       } catch (e:any) {
           return this._errHandler(e, "CODE-PUSHED",requestId);
       }
    }

    private async repositoryDeleted(payload:string, signature:string, requestId:string) {
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
            return this._errHandler(e, "REPOSITORY-DELETED",requestId);
        }
    }

    private async installationDeleted(payload:string, signature:string, requestId:string){
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
            return this._errHandler(e, "GITHUB-INSTALLATION-DELETED",requestId);
        }
    }

    private async repositoryRemovedFromInstallation(payload:string, signature:string, requestId:string) {
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
            return this._errHandler(e, "REPOSITORY-REMOVED-FROM-INSTALLATION",requestId);
        }
    }

    async webhooks({payload,signature,eventType,reqMeta}:GithubWebhookRequestBodyType){
        try {
            const {action} = JSON.parse(payload);
            switch(eventType) {
                case "push":
                    return this.codePushed(payload, signature,reqMeta.requestId);
                case "repository":
                    if(action === "deleted") {
                        return this.repositoryDeleted(payload, signature,reqMeta.requestId);
                    }
                    return GrpcResponse.OK(null, "No action taken for repository event");
                case "installation":
                    if(action === "deleted") {
                        return this.installationDeleted(payload, signature,reqMeta.requestId);
                    } 
                    return GrpcResponse.OK(null, "No action taken for installation event");
                case "installation_repositories":
                    if(action === "removed") {
                        return this.repositoryRemovedFromInstallation(payload, signature,reqMeta.requestId);
                    }
                    return GrpcResponse.OK(null, "No action taken for installation repositories event");
                default:
                    return GrpcResponse.OK(null, "No action taken for unknown event type");
            }
        } catch (e:any) {
            return this._errHandler(e, "GITHUB-WEBHOOK", reqMeta.requestId);
        }
    }

  
}



