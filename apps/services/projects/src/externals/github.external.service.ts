import { status } from "@grpc/grpc-js";
import { GrpcAppError } from "@shipoff/services-commons";
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";
import { createGithubJwt } from "libs/jwt";


interface GithubAxiosRequestConfig extends AxiosRequestConfig {
    installationId:string;
} 

export interface GitHubRepository {
  githubRepoId: string; 
  githubRepoName: string; 
  githubRepoFullName: string;
  githubRepoPrivate: boolean;
  owner: {
    githubUserId: string;
    githubUserLogin: string;
    githubUserType: "User" | "Organization";
  };
  githubRepoURI: string;
  githubRepoDefaultBranch: string;
}

export class GithubExternalService {
    private _BASE_URI:string;
    private _axiosInstance: AxiosInstance;
    private _accessTokenCache: Map<string, {token: string, expiresAt: number}> = new Map();
    private _exceptionRoutes : string[]

    constructor() {
        this._BASE_URI = "https://api.github.com";
        this._accessTokenCache = new Map();
        this._exceptionRoutes = [`/access_tokens`]
        this._axiosInstance = axios.create({
            baseURL: this._BASE_URI,
            headers:{
                "Content-Type":"application/vnd.github+json"
            }
        })
        this._axiosInstance.interceptors.request.use(async(config)=>{
            const customConfig = config as GithubAxiosRequestConfig;
            if(customConfig.installationId && !this._exceptionRoutes.some(route=>customConfig.url?.includes(route))){
                const cachedToken = this._accessTokenCache.get(customConfig.installationId);
                if(cachedToken && cachedToken.expiresAt > Date.now()){
                    config.headers["Authorization"] = `token ${cachedToken.token}`;
                }
                else{
                    if(cachedToken) this._accessTokenCache.delete(customConfig.installationId)
                    await this.refreshAccessToken(customConfig.installationId)
                    const newToken = this._accessTokenCache.get(customConfig.installationId);
                    config.headers["Authorization"] = `token ${newToken?.token}`;
                }
            }
            (config as any).installationId ? delete (config as any).installationId : null;
            return config;
        })
    }

    async refreshAccessToken(installationId:string){
          try {
             const route = `app/installations/${installationId}/access_tokens`;
             const token = await createGithubJwt();
             const res  = await this._axiosInstance.post(route,undefined,{
                installationId,
                headers:{
                    Authorization:`Bearer ${token}`,
                    "X-GitHub-Api-Version":"2022-11-28"
                }
            } as GithubAxiosRequestConfig);
             res.data && this._accessTokenCache.set(installationId, {
                token: res.data.token,
                expiresAt: new Date(res.data.expires_at).getTime() - 3000
            });
            return res.data.token;
          } catch (e:any) {
            if(e.response?.headers["x-ratelimit-remaining"]==0){
                throw new GrpcAppError(status.UNAVAILABLE,"User have made too many attempts, please try after sometime")
            }
            else if (e.response && e.response.status === 404){
                throw new GrpcAppError(status.NOT_FOUND,"User haven't connected their GitHub account yet.");
             }
            else if (e.response && e.response.status === 403) {
                 throw new GrpcAppError(status.PERMISSION_DENIED,"User doesn't have permission to access this resource.");
             }
            throw new GrpcAppError(status.INTERNAL,"Unexpected error occured",e)
          }
    }
    
    private formatRepositoryData(repo: any) {
        if (repo instanceof Array) {
            return repo.map(r => ({
                githubRepoId: r.id.toString(),
                githubRepoName: r.name,
                githubRepoFullName: r.full_name,
                githubRepoURI: r.html_url,
                githubRepoDefaultBranch: r.default_branch,
                githubRepoPrivate: r.private
            }));
        } else {
            return {
                githubRepoId: repo.id.toString(),
                githubRepoName: repo.name,
                githubRepoFullName: repo.full_name,
                githubRepoURI: repo.html_url,
                githubRepoDefaultBranch: repo.default_branch,
                githubRepoPrivate: repo.private,
            };
        }
    }

    async  getUserRepositories(installationId:string,limit?:number,skip?:number): Promise<GitHubRepository[]> {
        try {
            const pagination = {
                    ...(limit ? {per_page: limit} : {}),
                    ...(skip && limit ? {page: Math.floor(skip/limit) + 1} : {})
            }
            const route = `/installation/repositories`;
            const res = await this._axiosInstance.get(route,{
                headers:{
                    "X-GitHub-Api-Version":"2022-11-28"
                },
                installationId,
                params:pagination
            } as GithubAxiosRequestConfig);
            return this.formatRepositoryData(res.data.repositories) as GitHubRepository[];
        } catch (e:any) {
            if(e instanceof AxiosError){
                if(e.response?.headers["x-ratelimit-remaining"]==0){
                    throw new GrpcAppError(status.UNAVAILABLE,"User have made too many attempts, please try after sometime");
                }
                else if (e.response && e.response.status === 404){
                    throw new GrpcAppError(status.NOT_FOUND,"User doesn't have any repositories or haven't granted access");
                }
                else if (e.response && e.response.status === 403) {
                    throw new GrpcAppError(status.PERMISSION_DENIED,"User doesn't have permission to access this resource.");
                }
            }
            else if(e instanceof GrpcAppError) {
                throw e;
            }
            throw new GrpcAppError(status.INTERNAL,"Unexpected error occured",e);
        }
    } 

    async getRepositoryDetails(installationId:string, repoId:string):Promise<GitHubRepository> {
        try {
            const repos = await this.getUserRepositories(installationId,100,0);
            const repo = repos.find(r=>r.githubRepoId === repoId);
            if (!repo) {
                throw new GrpcAppError(status.NOT_FOUND,"Repository not found");
            }
            return repo;
        } catch (e:any) {
           throw e;
        }
    }
    
    async getInstallationDetails(installationId:string) {
        try {
            const route = `/app/installations/${installationId}`;
            const token = await createGithubJwt();
            const res = await this._axiosInstance.get(route,{
                headers:{
                    "X-GitHub-Api-Version":"2022-11-28",
                    "Authorization": `Bearer ${token}`
                }
            });
            const installation = {
                githubInstallationId: res.data.id.toString(),
                githubUserName: res.data.account.login,
            }
            return installation;
        } catch (e:any) {
            if (e instanceof GrpcAppError) {
                throw e;
            }
            else if (e.response && e.response.status === 404) {
                throw new GrpcAppError(status.NOT_FOUND,"Installation not found or user doesn't have access to it.");
            }
            else if (e.response && e.response.status === 403) {
                throw new GrpcAppError(status.PERMISSION_DENIED,"User doesn't have permission to access this resource.");
            }
            else if(e.response?.headers["x-ratelimit-remaining"]==0){
                throw new GrpcAppError(status.UNAVAILABLE,"User have made too many attempts, please try after sometime");
            }
            throw new GrpcAppError(status.INTERNAL,"Unexpected error occured",e);
        }
    }

}


const githubExternalService = new GithubExternalService();
export default githubExternalService;