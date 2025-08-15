import { ServerUnaryCall, sendUnaryData, status } from "@grpc/grpc-js";
import { GetUserGithubReposRequest, AllGithubReposResponse, GetGithubRepoRequest, GithubRepoResponse, GetGithubRepoAccessTokenRequest, GetGithubRepoAccessTokenResponse, BodyLessRequest, GithubInstallation, GithubInstallationResponse } from "@shipoff/proto";
import { BodyLessRequestBodyType } from "@shipoff/types";
import { GithubRepositoriesService } from "@/services/github.service";
import { GetUserGithubRepositoriesRequestBodyType, GetGithubRepositoryDetailsRequestBodyType, GetGithubRepositoryAccessTokenRequestBodyType } from "@/types/repositories";

export class GithubRepositoriesHandlers {
    private _githubRepositoriesService: GithubRepositoriesService;

    constructor() {
        this._githubRepositoriesService = new GithubRepositoriesService();
    }

    async handleGetUserGithubRepositories(call: ServerUnaryCall<GetUserGithubReposRequest & { body: GetUserGithubRepositoriesRequestBodyType }, AllGithubReposResponse>, callback: sendUnaryData<AllGithubReposResponse>) {
        try {
            const { code, res, message } = await this._githubRepositoriesService.getUserGithubRepositories(call.request.body);
            if (code !== 0) return callback({ code, message });
            const response = AllGithubReposResponse.fromObject({ code, message, res });
            return callback(null, response);
        } catch (e: any) {
            return callback({
                code: status.INTERNAL,
                message: "Internal server error"
            });
        }
    }

    async handleGetGithubRepo(call: ServerUnaryCall<GetGithubRepoRequest & { body: GetGithubRepositoryDetailsRequestBodyType }, GithubRepoResponse>, callback: sendUnaryData<GithubRepoResponse>) {
        try {
            const { code, res, message } = await this._githubRepositoriesService.getGithubRepsitoryDetails(call.request.body);
            if (code !== 0) return callback({ code, message });
            const response = GithubRepoResponse.fromObject({ code, message, res });
            return callback(null, response);
        } catch (e: any) {
            return callback({
                code: status.INTERNAL,
                message: "Internal server error"
            });
        }
    }  

    async handleGithubRepoAccessToken(call: ServerUnaryCall<GetGithubRepoAccessTokenRequest & { body: GetGithubRepositoryAccessTokenRequestBodyType }, GetGithubRepoAccessTokenResponse>, callback: sendUnaryData<GetGithubRepoAccessTokenResponse>) {
        try {
            const { code, res, message } = await this._githubRepositoriesService.getGithubRepoAccessToken(call.request);
            if (code !== 0) return callback({ code, message });
            const response = GetGithubRepoAccessTokenResponse.fromObject({ code, message, res });
            return callback(null, response);
        } catch (e: any) {
            return callback({
                code: status.INTERNAL,
                message: "Internal server error"
            });
        }
    }

    async handleGetGithubInstallation(call: ServerUnaryCall<BodyLessRequest & {body:BodyLessRequestBodyType}, GithubInstallationResponse>, callback: sendUnaryData<GithubInstallationResponse>) {
        try {
            const {code, res, message} = await this._githubRepositoriesService.getGithubInstallation(call.request.body);
            if (code !== 0) return callback({ code, message });
            const response = GithubInstallationResponse.fromObject({ code, message, res });
            return callback(null, response);
        } catch (e:any) {
            return callback({
                code: status.INTERNAL,
                message: "Internal server error"
            });
        }
    }
}