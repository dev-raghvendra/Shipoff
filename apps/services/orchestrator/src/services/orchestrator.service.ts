import { Database } from "@/db/db-service";
import { ProjectExternalService } from "@/externals/project.external.service";
import { GetCloneURIRequestBodyType, StartK8DeploymentRequestBodyType } from "@/types/container";
import {
    createGrpcErrorHandler,
    createJwtErrHandler,
    GrpcResponse,
    JsonWebTokenError,
    verifyJwt,
} from "@shipoff/services-commons";
import { K8Service, K8ServiceClient } from "./k8.service";
import {logger} from "@/libs/winston";

export class OrchestratorService {
    private _k8ServiceClient: K8Service;
    private _errHandler: ReturnType<typeof createGrpcErrorHandler>;
    private _projectService: ProjectExternalService;
    private _jwtErrHandler: ReturnType<typeof createJwtErrHandler>;
    constructor() {
        this._k8ServiceClient = K8ServiceClient;
        this._errHandler = createGrpcErrorHandler({
            subServiceName: "CONTAINER_SERVICE",
            logger
        });
        this._projectService = new ProjectExternalService();
        this._jwtErrHandler = createJwtErrHandler({
            expiredErrMsg: "Time limit exceeded.",
            invalidErrMsg: "Malformed Clone request.",
        });
    }

    async IStartK8Deployment({projectId,projectType,deploymentId,commitHash}: StartK8DeploymentRequestBodyType) {
        try {
            const deployment = await this._k8ServiceClient.tryCreatingFreeTierDeployment({
                projectId,
                deploymentId,
                commitHash,
                projectType
             })
            return GrpcResponse.OK(deployment,"K8 Deployment started");
        } catch (e: any) {
            return this._errHandler(e, "I-GET-CONTAINER");
        }
    }

    async IGetCloneURI({jwt}:GetCloneURIRequestBodyType){
        try {
            const {githubRepoId,githubRepoFullName} = await verifyJwt<{githubRepoId:string,githubRepoFullName:string}>(jwt)
            const accessToken = await this._projectService.getRepositoryAccessToken(githubRepoId);
            const REPO_CLONE_URI = `https://x-access-token:${accessToken}@github.com/${githubRepoFullName}` 
            return GrpcResponse.OK({REPO_CLONE_URI},"Clone URI fetched");
        } catch (e:any) {
            if(e instanceof JsonWebTokenError) return this._jwtErrHandler(e)
            return this._errHandler(e, "I-GET-CLONE-URI")
        }
    }
}
