import { SECRETS } from "@/config";
import { CONFIG } from "@/config";
import { ProjectExternalService } from "@/externals/project.external.service";
import { STATE_CHANGED, TRAFFIC_DETECTED } from "@/types/container";
import { Project } from "@shipoff/proto";
import { createJwt } from "@shipoff/services-commons";

export class ContainerConfigUtil {
    private _projectService: ProjectExternalService;

    constructor() {
        this._projectService = new ProjectExternalService();
    };

    async getBuildContainerConfig(projectId: string) {
            const project = await this._projectService.getProjectById(projectId);
            const commonConfig = await this._getCommonConfig(project,"build")
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
    async getProdContainerConfig(projectId: string) {
        const project = await this._projectService.getProjectById(projectId);
        const commonConfig = await this._getCommonConfig(project,"prod")
        const ingressedWebhook = await createJwt<TRAFFIC_DETECTED>({
            projectId: project.projectId,
            action:"INGRESSED",
            containerId:commonConfig.containerId
        },"30D",SECRETS.ORCHESTRATOR_WEBHOOK_PAYLOAD_SECRET)
        commonConfig.envs.push({
            name:"PROD_COMMAND",
            value: project.prodCommand
        },{
            name:"INGRESSED_WEBHOOK",
            value:ingressedWebhook
        })
        return commonConfig
    }

    private async _getCommonConfig(project:Project,type:"build"|"prod"){
        const image = `${project.framework.runtime}-${project.framework.applicationType}`.toLowerCase()
        const containerId = `${type}-container-${project.projectId}-${Date.now()}`
        const webhooks = await Promise.all([
            createJwt<STATE_CHANGED>({
                projectId:project.projectId,
                action:"PROVISIONING",
                containerId
            },"10M",SECRETS.ORCHESTRATOR_WEBHOOK_PAYLOAD_SECRET),
            createJwt<STATE_CHANGED>({
                projectId:project.projectId,
                action:"RUNNING",
                containerId
            },"10M",SECRETS.ORCHESTRATOR_WEBHOOK_PAYLOAD_SECRET),
            createJwt<STATE_CHANGED>({
                projectId:project.projectId,
                action:"PRODUCTION",
                containerId
            },"20M",SECRETS.ORCHESTRATOR_WEBHOOK_PAYLOAD_SECRET),
            createJwt<STATE_CHANGED>({
                projectId:project.projectId,
                action:"TERMINATED",
                containerId
            },"30D",SECRETS.ORCHESTRATOR_WEBHOOK_PAYLOAD_SECRET),
            createJwt<STATE_CHANGED>({
                projectId:project.projectId,
                action:"FAILED",
                containerId
            },"30D",SECRETS.ORCHESTRATOR_WEBHOOK_PAYLOAD_SECRET),
        ])
        return {envs:[...project.environmentVars,
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
            }],image,containerId}
    }

}


