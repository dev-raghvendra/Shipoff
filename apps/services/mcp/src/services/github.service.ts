import { GetProjectClient } from "@shipoff/grpc-clients";
import { AllGithubReposResponse, BodyLessRequest, CreateGithubInstallationRequest, GetGithubRepoRequest, GetUserGithubReposRequest, GithubInstallation, GithubInstallationResponse, ProjectsServiceClient } from "@shipoff/proto";
import { promisifyGrpcCall } from "@shipoff/services-commons/utils/rpc-utils";
import { InferResponse } from "@shipoff/types";

export class GithubService {
    private _githubService: ProjectsServiceClient;

    constructor() {
        this._githubService = GetProjectClient();
    }

    async getUserGithubRepositories(data: any):Promise<InferResponse<AllGithubReposResponse>> {
        try {
            const req = GetUserGithubReposRequest.fromObject(data);
            const response = await promisifyGrpcCall(this._githubService.GetUserGithubRepos.bind(this._githubService), req);
            return response;
        } catch (e:any) {
            return e;
        }
    }

    async getGithubRepositoryDetails(data: any) {
        try {
            const req = GetGithubRepoRequest.fromObject(data);
            const response = await promisifyGrpcCall(this._githubService.GetGithubRepo.bind(this._githubService), req);
            return response;
        } catch (e:any) {
            return e;
        }
    }

    async githubInstallationCallback(data: any) {
        try {
            const req = CreateGithubInstallationRequest.fromObject(data);
            const response = await promisifyGrpcCall(this._githubService.CreateGithubInstallation.bind(this._githubService), req);
            return response;
        } catch (e:any) {
            return e;
        }
    }

    async getGithubInstallation(data: any) :Promise<InferResponse<GithubInstallationResponse>> {
        try {
            const req = BodyLessRequest.fromObject(data);
            const response = await promisifyGrpcCall(this._githubService.GetGithubInstallation.bind(this._githubService), req);
            return response;
        } catch (e:any) {
            return e;
        }
    }
}