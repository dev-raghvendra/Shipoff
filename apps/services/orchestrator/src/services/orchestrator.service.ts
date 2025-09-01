import { Database } from "@/db/db-service";
import { ProjectExternalService } from "@/externals/project.external.service";
import { GetCloneURIRequestBodyType, GetContainerRequestBodyType } from "@/types/container";
import {
    createGrpcErrorHandler,
    createJwtErrHandler,
    GrpcResponse,
    JsonWebTokenError,
    verifyJwt,
} from "@shipoff/services-commons";

export class OrchestratorService {
    private _dbService: Database;
    private _errHandler: ReturnType<typeof createGrpcErrorHandler>;
    private _projectService: ProjectExternalService;
    private _jwtErrHandler: ReturnType<typeof createJwtErrHandler>;
    constructor() {
        this._dbService = new Database();
        this._errHandler = createGrpcErrorHandler({
            serviceName: "CONTAINER_SERVICE",
        });
        this._projectService = new ProjectExternalService();
        this._jwtErrHandler = createJwtErrHandler({
            expiredErrMsg: "Time limit exceeded.",
            invalidErrMsg: "Malformed Clone request.",
        });
    }

    async IGetContainerByDomain({projectId}: GetContainerRequestBodyType) {
        try {
            const container = await this._dbService.findContainer({
                projectId,
            });
            return GrpcResponse.OK(container, "Container found");
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
