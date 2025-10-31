import { GITHUB_API_ROUTES, MAIN_BACKEND_API } from "@/config/service-route-config";
import { BaseService } from "./base.service";
import { GetUserGithubReposRequest, AllGithubReposResponse, GithubInstallationResponse } from "@shipoff/proto";
import { InferRequest,InferResponse } from "@shipoff/types";

class GithubService extends BaseService {
    constructor() {
        super({
            baseURL: MAIN_BACKEND_API.GITHUB_API,
            serviceName: "GITHUB"
        })
    }

    async getUserRepositories({ skip, limit }:InferRequest<GetUserGithubReposRequest>) {
        try {
            const res = await this._axiosInstance.get<InferResponse<AllGithubReposResponse>>(GITHUB_API_ROUTES.GET_USER_REPOS({ skip, limit }));
            return res.data
        } catch (e:any) {
            return this.handleError(e, undefined, true)
        }
    }

    async getGithubInstallation(){
        try {
            const res = await this._axiosInstance.get<InferResponse<GithubInstallationResponse>>(GITHUB_API_ROUTES.GET_USER_GITHUB_INSTALLATION());
            return res.data
        } catch (e:any) {
            return this.handleError(e, undefined, true)
        }
    }
}

export const githubService = new GithubService()
