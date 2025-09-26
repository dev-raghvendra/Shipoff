import { SECRETS } from "@/config";
import { CONFIG } from "@/config";
import { ProjectExternalService } from "@/externals/project.external.service";
import { STATE_CHANGED, TRAFFIC_DETECTED } from "@/types/orchestrator";
import { Project } from "@shipoff/proto";
import { createJwt, StringValue } from "@shipoff/services-commons";

export class ContainerConfigUtil {
    private _projectService: ProjectExternalService;

    constructor() {
        this._projectService = new ProjectExternalService();
    };

    async getBuildContainerConfig(projectId: string,deploymentId:string,commitHash:string,requestId:string) {
            const project = await this._projectService.getProjectById(projectId,requestId);
            const commonConfig = await this._getCommonConfig(project,"build",deploymentId,commitHash)
            commonConfig.envs.push({
                name: "BUILD_COMMAND",
                value: project.buildCommand
            }, {
                name: "BUCKET_URI",
                value: `${SECRETS.BUCKET_URI}/${project.domain}`
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
    async getProdContainerConfig(projectId: string,deploymentId:string,commitHash:string,requestId:string) {
        const project = await this._projectService.getProjectById(projectId,requestId);
        const commonConfig = await this._getCommonConfig(project,"prod",deploymentId,commitHash)
        commonConfig.envs.push({
            name:"PROD_COMMAND",
            value: project.prodCommand
        })
        return commonConfig
    }

    private async _getCommonConfig(project:Project,type:"build"|"prod",deploymentId:string,commitHash:string){
        const image = `${CONFIG.BASE_IMAGE_PREFIX}:${project.framework.runtime}-${project.framework.applicationType}`.toLowerCase()
        const containerId = `${type[0]}-${deploymentId}-${Date.now()}`
        const buildId = `build-${deploymentId}-${Date.now()}`
        const runtimeId = `run-${deploymentId}-${Date.now()}`
        console.log(buildId)
        console.log(runtimeId)
        const webhooks = await Promise.all([
            this._createWebhookToken(project,deploymentId,containerId,buildId,runtimeId,"PROVISIONING","10M"),
            this._createWebhookToken(project,deploymentId,containerId,buildId,runtimeId,"RUNNING","10M"),
            this._createWebhookToken(project,deploymentId,containerId,buildId,runtimeId,"PRODUCTION","20M"),
            this._createWebhookToken(project,deploymentId,containerId,buildId,runtimeId,"TERMINATED","30D"),
            this._createWebhookToken(project,deploymentId,containerId,buildId,runtimeId,"FAILED","30D"),
            this._createWebhookToken(project,deploymentId,containerId,buildId,runtimeId,"INGRESSED","30D")
        ])
        return {envs:[...project.environmentVariables,
            {
                name:"DOMAIN",
                value:project.domain
            },{
                name:"ORCHESTRATOR_URL",
                value:CONFIG.ORCHESTRATOR_URL
            },{
                name:"BUILD_COMMAND",
                value:project.buildCommand
            },{
                name:"WEBHOOK_URI",
                value:CONFIG.ORCHESTRATOR_WEBHOOK_URI
            },{
                name:"GITHUB_REPO_FULLNAME",
                value:project.repository.githubRepoFullName
            },{
                name:"REPO_BRANCH",
                value:project.repository.branch
            },{
                name:"OUT_DIR",
                value:project.outDir
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
                value:await createJwt({githubRepoId:project.repository.githubRepoId,githubRepoFullName:project.repository.githubRepoFullName},"20m")
            },{
                name:"COMMIT_HASH",
                value:commitHash
            },{
                name:"SOFT_MEMORY_LIMIT",
                value:`${500*1024*1024}`
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
                value:project.framework.applicationType
            }],image,containerId}
    }


    private async _createWebhookToken(project: Project, deploymentId:string, containerId:string,builId:string,runtimeId:string, action: "PROVISIONING" | "RUNNING" | "FAILED" | "TERMINATED" | "PRODUCTION" | "INGRESSED", expiresIn:StringValue){
        return await createJwt<STATE_CHANGED | TRAFFIC_DETECTED>({
            action,
            projectId: project.projectId,
            containerId,
            builId,
            runtimeId,
            deploymentId,
            projectType: project.framework.applicationType as "STATIC" | "DYNAMIC"
        },expiresIn,SECRETS.ORCHESTRATOR_WEBHOOK_PAYLOAD_SECRET)
    }
}


