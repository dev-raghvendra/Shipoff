import { ServerUnaryCall, sendUnaryData, status } from "@grpc/grpc-js";
import { GetUserGithubReposRequest, AllGithubReposResponse, GetGithubRepoRequest, GithubRepoResponse, GetGithubRepoAccessTokenRequest, GetGithubRepoAccessTokenResponse, BodyLessRequest, GithubInstallation, GithubInstallationResponse, DeploymentResponse, google } from "@shipoff/proto";
import { BodyLessRequestBodyType } from "@shipoff/types";
import { GithubService } from "@/services/github.service";
import { GetUserGithubRepositoriesRequestBodyType, GetGithubRepositoryDetailsRequestBodyType, GetGithubRepositoryAccessTokenRequestBodyType } from "@/types/repositories";
import { CreateGithubInstallationRequestBodyType } from "@/types/webhooks";

export class GithubHandlers {
    private _githubService: GithubService;

    constructor() {
        this._githubService = new GithubService();
    }

    async handleGetUserGithubRepositories(call: ServerUnaryCall<GetUserGithubReposRequest & { body: GetUserGithubRepositoriesRequestBodyType }, AllGithubReposResponse>, callback: sendUnaryData<AllGithubReposResponse>) {
        try {
            const { code, res, message } = await this._githubService.getUserGithubRepositories(call.request.body);
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
            const { code, res, message } = await this._githubService.getGithubRepsitoryDetails(call.request.body);
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
            const { code, res, message } = await this._githubService.getGithubRepoAccessToken(call.request);
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
            const {code, res, message} = await this._githubService.getGithubInstallation(call.request.body);
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

    async handleCreateGithubInstallation(call: ServerUnaryCall<{ body: CreateGithubInstallationRequestBodyType }, DeploymentResponse>, callback: sendUnaryData<google.protobuf.Empty>) {
        try {
            const { code, message } = await this._githubService.createGithubInstallation(call.request.body);
            if (code !== 0) return callback({ code, message });
            return callback(null,google.protobuf.Empty.fromObject({}));
        } catch (e: any) {
            return callback({
                code: status.INTERNAL,
                message: "Internal server error"
            });
        }
    }
}

