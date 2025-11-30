import { ProjectExternalService } from "@/externals/project.external.service";
import { IDeploymentIngressedRequestType, GetCloneURIRequestBodyType, StartK8DeploymentRequestBodyType } from "@/types/orchestrator";
import {
    createGrpcErrorHandler,
    createJwtErrHandler,
    createSyncErrHandler,
    GrpcResponse,
    JsonWebTokenError,
    verifyJwt,
} from "@shipoff/services-commons";
import {logger} from "@/libs/winston";
import { Database } from "@/db/db-service";
import { K8Service, K8ServiceClient } from "./k8.service";

export class OrchestratorService {
    private _dbService : Database
    private _projectService: ProjectExternalService;
    private _k8sService: K8Service;
    private _grpcErrHandler: ReturnType<typeof createGrpcErrorHandler>;
    private _jwtErrHandler: ReturnType<typeof createJwtErrHandler>;
    private _syncErrHandler:ReturnType<typeof createSyncErrHandler>
    constructor() {
        this._dbService = new Database();
        this._k8sService = K8ServiceClient;
        this._projectService = new ProjectExternalService();
        this._grpcErrHandler = createGrpcErrorHandler({
            subServiceName: "CONTAINER_SERVICE",
            logger
        });
        this._jwtErrHandler = createJwtErrHandler({
            expiredErrMsg: "Time limit exceeded.",
            invalidErrMsg: "Malformed Clone request.",
        });

        this._syncErrHandler = createSyncErrHandler({subServiceName:"ORCHESTRATOR_SERVICE",logger})
        setInterval(async()=>await this._cleanupFreeTierInactiveDynamicDeployments(),13*60*1000);
    }

    async IDeploymentIngressed({projectId,reqMeta}: IDeploymentIngressedRequestType) {
        try {
            const deployment = await this._dbService.findAndUpdateK8Deployment({
                projectId,
                status:"PRODUCTION"
            },{
                lastIngressedAt:Date.now()
            })
            return GrpcResponse.OK(deployment,"Ingress time updated");
        } catch (e: any) {
            return this._grpcErrHandler(e, "I-GET-CONTAINER",reqMeta.requestId);
        }
    }

    async IGetCloneURI({jwt,reqMeta}:GetCloneURIRequestBodyType){
        try {
            const {githubRepoId,projectId,githubRepoFullName} = await verifyJwt<{githubRepoId:string,projectId:string,githubRepoFullName:string}>(jwt)
            const accessToken = await this._projectService.getGithubRepoAccessToken(projectId,githubRepoId,reqMeta.requestId);
            const REPO_CLONE_URI = `https://x-access-token:${accessToken}@github.com/${githubRepoFullName}` 
            return GrpcResponse.OK({REPO_CLONE_URI},"Clone URI fetched");
        } catch (e:any) {
            if(e instanceof JsonWebTokenError) return this._jwtErrHandler(e)
            return this._grpcErrHandler(e, "I-GET-CLONE-URI",reqMeta.requestId);
        }
    }

    private async _cleanupFreeTierInactiveDynamicDeployments(){
        try {
            const res = await this._dbService.findManyK8Deployment({
                status:"PRODUCTION",
                projectType:"DYNAMIC",
                lastIngressedAt:{$lt:Date.now() - 15*60*1000}
            })
            res.forEach(async(deployment)=>{
                await this._k8sService.deleteFreeTierDeployment(deployment.projectId,
                    "user-dynamic-apps",
                    "N/A"
                )
            })
        } catch (e:any) {
            this._syncErrHandler(e,"CLEANUP-FREE-TIER-INACTIVE-DYNAMIC-DEPLOYMENTS","N/A");
        }
    }
}
