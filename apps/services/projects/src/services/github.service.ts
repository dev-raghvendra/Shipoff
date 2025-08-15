import { createGrpcErrorHandler, GrpcResponse } from "@shipoff/services-commons";
import { Database, dbService } from "@/db/db-service";
import githubExternalService, { GithubExternalService } from "@/externals/github.external.service";
import { GetUserGithubRepositoriesRequestBodyType, GetGithubRepositoryDetailsRequestBodyType } from "@/types/repositories";
import { BodyLessRequestBodyType } from "@shipoff/types";

export class GithubRepositoriesService {
    private _dbService: Database;
    private _githubService: GithubExternalService;
    private _errHandler: ReturnType<typeof createGrpcErrorHandler>;

    constructor() {
        this._dbService = dbService;
        this._githubService = githubExternalService;
        this._errHandler = createGrpcErrorHandler({ serviceName: "GITHUB_REPOSITORY_SERVICE" });
    }

        async getUserGithubRepositories({authUserData, skip, limit}:GetUserGithubRepositoriesRequestBodyType){
            try {
                const installation = await this._dbService.findUniqueGithubInstallation({
                    where:{
                        userId: authUserData.userId
                    }
                })
                const repositories = await this._githubService.getUserRepositories(installation.githubInstallationId, limit, skip);
                return GrpcResponse.OK(repositories, "Github repositories fetched successfully");
            } catch (e:any) {
                return this._errHandler(e, "GET-USER-GITHUB-REPOSITORIES");
            }
        }
    
        async getGithubRepsitoryDetails({authUserData, githubRepoId}:GetGithubRepositoryDetailsRequestBodyType){
            try {
                const installation = await this._dbService.findUniqueGithubInstallation({
                    where:{
                        userId: authUserData.userId
                    }
                })
                const repository = await this._githubService.getRepositoryDetails(installation.githubInstallationId,githubRepoId);
                return GrpcResponse.OK(repository, "Github repository details fetched successfully");
            } catch (e:any) {
                return this._errHandler(e, "GET-GITHUB-REPOSITORY-DETAILS");
            }
        }

        async getGithubRepoAccessToken({githubRepoId}:{githubRepoId:string}){
            try {
                const repo = await this._dbService.findUniqueRepository({
                    where:{
                        githubRepoId
                    },
                    select:{
                       githubInstallationId:true,
                    }
                })
                const accessToken = await this._githubService.refreshAccessToken(repo.githubInstallationId);
                return GrpcResponse.OK(accessToken, "Github repository access token fetched successfully");
            } catch (e:any) {
                return this._errHandler(e, "GET-GITHUB-REPOSITORY-ACCESS-TOKEN");
            }
        }

        async getGithubInstallation({authUserData:{userId}}:BodyLessRequestBodyType){
            try {
                const installation = await this._dbService.findUniqueGithubInstallation({
                    where:{
                        userId
                    }
                })
                return GrpcResponse.OK(installation, "Github installation fetched successfully");
            } catch (e:any) {
                return this._errHandler(e, "GET-GITHUB-INSTALLATION");
            }
        }
}