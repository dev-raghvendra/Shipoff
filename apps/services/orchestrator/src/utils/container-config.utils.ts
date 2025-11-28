import { SECRETS } from "@/config";
import { CONFIG } from "@/config";
import { ProjectExternalService } from "@/externals/project.external.service";
import { STATE_CHANGED } from "@/types/orchestrator";
import { DeploymentResponse} from "@shipoff/proto";
import { createJwt, StringValue } from "@shipoff/services-commons";
import { InferResponse } from "@shipoff/types";

export class ContainerConfigUtil {
    private _projectService: ProjectExternalService;

    constructor() {
        this._projectService = new ProjectExternalService();
    };

    async getBuildContainerConfig(event:"REQUESTED" | "CREATED",projectId: string,deploymentId:string,commitHash:string,requestId:string) {
            const deployment =  event === "CREATED"
            ? await this._projectService.getDeploymentById(deploymentId,requestId)
            : await this._projectService.getLastDeployment(projectId,requestId)
            const commonConfig = await this._getCommonConfig(deployment,"build",deploymentId,commitHash)
            commonConfig.envs.push({
                name: "BUILD_COMMAND",
                value: deployment.project.buildCommand
            }, {
                name: "BUCKET_URI",
                value: `${SECRETS.BUCKET_URI}/${projectId}`
            }, {
                name: "BUCKET_ENDPOINT",
                value: SECRETS.BUCKET_ENDPOINT
            }, {
                name: "AWS_ACCESS_KEY_ID",
                value: SECRETS.ORCHESTRATOR_OCI_ACCESS_KEY
            }, {
                name: "AWS_SECRET_ACCESS_KEY",
                value: SECRETS.ORCHESTRATOR_OCI_SECRET_KEY
            }, {
                name: "AWS_DEFAULT_REGION",
                value: SECRETS.BUCKET_REGION
            })
            return commonConfig
    }
    async getProdContainerConfig(event:"REQUESTED" | "CREATED", projectId: string,deploymentId:string,commitHash:string,requestId:string) {
         const deployment =  event === "CREATED"
            ? await this._projectService.getDeploymentById(deploymentId,requestId)
            : await this._projectService.getLastDeployment(projectId,requestId)
        const commonConfig = await this._getCommonConfig(deployment,"prod",deploymentId,commitHash)
        commonConfig.envs.push({
            name:"PROD_COMMAND",
            value: deployment?.project?.prodCommand
        })
        return commonConfig
    }

    private async _getCommonConfig(deployment:InferResponse<DeploymentResponse>["res"],type:"build"|"prod",deploymentId:string,commitHash:string){
        const image = `${CONFIG.BASE_IMAGE_PREFIX}:${deployment.project.framework.runtime}-${deployment.project.framework.applicationType}`.toLowerCase()
        const containerId = `${type[0]}-${deploymentId}-${Date.now()}`
        const buildId = `build-${deploymentId}-${Date.now()}`
        const runtimeId = `run-${deploymentId}-${Date.now()}`
        // console.log(`ws://localhost:8000/ws/logs/stream?envId=${buildId}&projectId=${project.projectId}`)
        // console.log(`ws://localhost:8000/ws/logs/stream?envId=${runtimeId}&projectId=${project.projectId}`)
        // console.log(`http://localhost:8000/apis/v1/log/${project.projectId}/${buildId}`)
        // console.log(`http://localhost:8000/apis/v1/log/${project.projectId}/${runtimeId}`)
        const webhooks = await Promise.all([
            this._createWebhookToken(deployment,deploymentId,containerId,buildId,runtimeId,"PROVISIONING","10M"),
            this._createWebhookToken(deployment,deploymentId,containerId,buildId,runtimeId,"RUNNING","10M"),
            this._createWebhookToken(deployment,deploymentId,containerId,buildId,runtimeId,"PRODUCTION","20M"),
            this._createWebhookToken(deployment,deploymentId,containerId,buildId,runtimeId,"TERMINATED","30D"),
            this._createWebhookToken(deployment,deploymentId,containerId,buildId,runtimeId,"FAILED","30D")
        ])
        return {envs:[...deployment.project.environmentVariables,
            {
                name:"DOMAIN",
                value:deployment.project.domain
            },{
                name:"ORCHESTRATOR_URL",
                value:CONFIG.ORCHESTRATOR_URL
            },{
                name:"BUILD_COMMAND",
                value:deployment.project.buildCommand
            },{
                name:"WEBHOOK_URI",
                value:CONFIG.ORCHESTRATOR_WEBHOOK_URI
            },{
                name:"GITHUB_REPO_FULLNAME",
                value:deployment.repository.githubRepoFullName
            },{
                name:"REPO_BRANCH",
                value:deployment.repository.branch
            },{
                name:"OUT_DIR",
                value:deployment.project.outDir
            },{
                name:"PROVISIONING_WEBHOOK",
                value:webhooks[0]
            },{
                name:"RUNNING_WEBHOOK",
                value:webhooks[1]
            },{
                name:"PRODUCTION_WEBHOOK",
                value:webhooks[2]
            },{
                name:"TERMINATED_WEBHOOK",
                value:webhooks[3]
            },{
                name:"FAILED_WEBHOOK",
                value:webhooks[4]
            },{
                name:"CLONE_TOKEN",
                value:await createJwt({githubRepoId:deployment.repository.githubRepoId,githubRepoFullName:deployment.repository.githubRepoFullName,projectId:deployment.projectId},"20m")
            },{
                name:"COMMIT_HASH",
                value:commitHash
            },{
                name:"SOFT_MEMORY_LIMIT",
                value:`${CONFIG.FREE_TIER_MEMORY_LIMIT_BYTES}`
            },{
                name:"BUILD_ID",
                value:buildId
            },{
                name:"RUNTIME_ID",
                value:runtimeId
            },{
                name:"ENVIRONMENT_TYPE",
                value:CONFIG.ENV
            },{
                name:"PROJECT_TYPE",
                value:deployment.project.framework.applicationType
            }],image,containerId}
    }

    private async _createWebhookToken(deployment: InferResponse<DeploymentResponse>["res"], deploymentId:string, containerId:string,builId:string,runtimeId:string, action: "PROVISIONING" | "RUNNING" | "FAILED" | "TERMINATED" | "PRODUCTION", expiresIn:StringValue){
        return await createJwt<STATE_CHANGED>({
            action,
            projectId: deployment.projectId,
            containerId,
            builId,
            runtimeId,
            deploymentId,
            projectType: deployment.project.framework.applicationType as "STATIC" | "DYNAMIC"
        },expiresIn,SECRETS.ORCHESTRATOR_WEBHOOK_PAYLOAD_SECRET)
    }
}


