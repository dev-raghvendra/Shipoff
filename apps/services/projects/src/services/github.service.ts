import { createGrpcErrorHandler, GrpcResponse } from "@shipoff/services-commons";
import { Database, dbService } from "@/db/db-service";
import githubExternalService, { GithubExternalService } from "@/externals/github.external.service";
import { GetUserGithubRepositoriesRequestBodyType, GetGithubRepositoryDetailsRequestBodyType, GetGithubRepositoryAccessTokenRequestBodyType } from "@/types/repositories";
import { BodyLessRequestBodyType } from "@shipoff/types";
import { CreateGithubInstallationRequestBodyType } from "@/types/webhooks";
import { logger } from "@/libs/winston";


export class GithubService {
    private _dbService: Database;
    private _githubService: GithubExternalService;
    private _errHandler: ReturnType<typeof createGrpcErrorHandler>;

    constructor() {
        this._dbService = dbService;
        this._githubService = githubExternalService;
        this._errHandler = createGrpcErrorHandler({ subServiceName: "GITHUB_SERVICE",logger });
    }

    async getUserGithubRepositories({authUserData, skip, limit, reqMeta}:GetUserGithubRepositoriesRequestBodyType){
            try {
                const installation = await this._dbService.findUniqueGithubInstallation({
                    where:{
                        userId: authUserData.userId
                    }
                })
                const repositories = await this._githubService.getUserRepositories(installation.githubInstallationId, limit, skip);
                return GrpcResponse.OK(repositories, "Github repositories fetched successfully");
            } catch (e:any) {
                return this._errHandler(e, "GET-USER-GITHUB-REPOSITORIES",reqMeta.requestId);
            }
    }

    async getGithubRepsitoryDetails({authUserData, githubRepoId, reqMeta}:GetGithubRepositoryDetailsRequestBodyType){
            try {
                const installation = await this._dbService.findUniqueGithubInstallation({
                    where:{
                        userId: authUserData.userId
                    }
                })
                const repository = await this._githubService.getRepositoryDetails(installation.githubInstallationId,githubRepoId);
                return GrpcResponse.OK(repository, "Github repository details fetched successfully");
            } catch (e:any) {
                return this._errHandler(e, "GET-GITHUB-REPOSITORY-DETAILS",reqMeta.requestId);
            }
        }
    async IGetGithubRepoAccessToken({reqMeta,githubRepoId,projectId}:GetGithubRepositoryAccessTokenRequestBodyType){
            try {
                const installation = await this._dbService.findUniqueRepository({
                    where:{
                        projectId_githubRepoId:{
                            projectId,
                            githubRepoId
                        }
                    },
                    select:{
                        githubInstallationId:true
                    }
                })
                const accessToken = await this._githubService.refreshAccessToken(installation.githubInstallationId);
                return GrpcResponse.OK(accessToken, "Github repository access token fetched successfully");
            } catch (e:any) {
                return this._errHandler(e, "GET-GITHUB-REPOSITORY-ACCESS-TOKEN",reqMeta.requestId);
            }
        }
 
        async getGithubInstallation({authUserData:{userId}, reqMeta}:BodyLessRequestBodyType){
            try {
                const installation = await this._dbService.findUniqueGithubInstallation({
                    where:{
                        userId
                    }
                })
                return GrpcResponse.OK(installation, "Github installation fetched successfully");
            } catch (e:any) {
                return this._errHandler(e, "GET-GITHUB-INSTALLATION",reqMeta.requestId);
            }
        }

      async createGithubInstallation({authUserData:{userId}, installation_id, reqMeta}:CreateGithubInstallationRequestBodyType) {
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
            return this._errHandler(e, "CREATE-GITHUB-INSTALLATION",reqMeta.requestId);
        }
    }
    
}