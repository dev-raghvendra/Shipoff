import { MAIN_BACKEND_API, PROJECTS_API_ROUTES } from "@/config/service-route-config";
import { BaseService } from "./base.service";
import { InferRequest } from "@shipoff/types";
import { AllDeploymentsResponse, AllProjectsResponse, BulkResourceRequest, CreateProjectRequest, LinkRepositoryRequest, DeleteEnvVarsRequest, DeleteEnvVarsResponse, DeploymentResponse, EnvVarsResponse, FrameworkResponse, GetAllDeploymentsRequest, GetDeploymentRequest, ProjectsLinkedToTeamResponse, GetProjectRequest, GetProjectsLinkedToTeamRequest, ProjectResponse, RepositoryResponse, UpdateProjectRequest, UpsertEnvVarsRequest, CheckDomainAvailabilityRequest, CheckDomainAvailabilityResponse, DeleteDeploymentRequest, RedeployRequest, UnlinkRepositoryRequest } from "@shipoff/proto";
import { InferResponse } from "@shipoff/types";

export class ProjectService extends BaseService {
     constructor(){
        super({
            baseURL:MAIN_BACKEND_API.PROJECTS_API,
            serviceName:"PROJECTS"
        })
     }

     async getAllProjects({skip,limit}:InferRequest<BulkResourceRequest>){
        try {
            const res = await this._axiosInstance.get<InferResponse<AllProjectsResponse>>(PROJECTS_API_ROUTES.GET_PROJECTS({skip,limit}))
            return res.data
        } catch (e:any) {
            return this.handleError(e,undefined,true)
        }
     }

     async getLatestProjects({skip,limit}:InferRequest<BulkResourceRequest,"skip">){
        try {
            const res = await this._axiosInstance.get<InferResponse<AllProjectsResponse>>(PROJECTS_API_ROUTES.GET_LATEST_PROJECTS({skip,limit}))
            return res.data
        } catch (e:any) {
            return this.handleError(e,undefined,true)
        }
     }

     async getProject({projectId}:InferRequest<GetProjectRequest>){
         try {
             const res = await this._axiosInstance.get<InferResponse<ProjectResponse>>(PROJECTS_API_ROUTES.GET_PROJECT({projectId}))
             return res.data  
         } catch (e:any) {
             return this.handleError(e,undefined,true)
         }
     }

     async getDeployment({projectId,deploymentId}:InferRequest<GetDeploymentRequest>){
         try {
            const res = await this._axiosInstance.get<InferResponse<DeploymentResponse>>(PROJECTS_API_ROUTES.GET_DEPLOYMENT({
                projectId,
                deploymentId
            }))
            return res.data
         } catch (e:any) {
            return this.handleError(e,undefined,true)
         }
     }

     async getAllDeployments({projectId,limit,skip}:InferRequest<GetAllDeploymentsRequest>){
        try {
            const res = await this._axiosInstance.get<InferResponse<AllDeploymentsResponse>>(PROJECTS_API_ROUTES.GET_DEPLOYMENTS({
                projectId,
                limit,
                skip
            }))
            return res.data
        } catch (e:any) {
            return this.handleError(e,undefined,true)
        }
     }

     async getLatestDeployments({skip,limit}:InferRequest<BulkResourceRequest,"skip">){
        try {
            const res = await this._axiosInstance.get<InferResponse<AllDeploymentsResponse>>(PROJECTS_API_ROUTES.GET_LATEST_DEPLOYMENTS({skip,limit}))
            return res.data
        } catch (e:any) {
            return this.handleError(e,undefined,true)
        }
     }

     async getFrameworks(){
        try {
            const res = await this._axiosInstance.get<InferResponse<FrameworkResponse>>(PROJECTS_API_ROUTES.GET_FRAMEWORKS())
            return res.data
        } catch (e:any) {
            return this.handleError(e,undefined,true)
        }
     }

     async updateProject({projectId,updates}:InferRequest<UpdateProjectRequest>){
        try {
            const res = await this._axiosInstance.patch<InferResponse<ProjectResponse>>(PROJECTS_API_ROUTES.UPDATE_PROJECT({projectId}), {
                updates
            })
            return res.data
        } catch (e:any) {
            return this.handleError(e,undefined,true)
        }
     }

     async createOrUpdateEnvVars({projectId,envs}:InferRequest<UpsertEnvVarsRequest>){
        try {
            const res = await this._axiosInstance.put<InferResponse<EnvVarsResponse>>(PROJECTS_API_ROUTES.UPSERT_ENV_VAR({projectId}), {
               envs
            })
            return res.data
        } catch (e:any) {
            return this.handleError(e,undefined,true)
        }
     }

     async deleteEnvVars({projectId,envVarKeys}:InferRequest<DeleteEnvVarsRequest>){
        try {
            const res = await this._axiosInstance.delete<InferResponse<DeleteEnvVarsResponse>>(PROJECTS_API_ROUTES.DELETE_ENV_VARS({projectId}),{
                params:{
                    keys:envVarKeys
                }
            })
            return res.data
        } catch (e:any) {
            return this.handleError(e,undefined,true)
        }
     }
     async unlinkRepository({projectId}:InferRequest<UnlinkRepositoryRequest>){
       try {
        const res = await this._axiosInstance.delete<InferResponse<RepositoryResponse>>(PROJECTS_API_ROUTES.UNLINK_REPO({projectId}))
        return res.data
       } catch (e:any) {
           return this.handleError(e,undefined,true)
       }
     }

     async linkRepository({projectId,githubRepoId,branch,githubRepoFullName,githubRepoURI,rootDir}:InferRequest<LinkRepositoryRequest>){
        try {
            const res = await this._axiosInstance.post(PROJECTS_API_ROUTES.LINK_REPO({projectId}),{
                githubRepoId,
                githubRepoFullName,
                githubRepoURI,
                rootDir,
                branch
            })
            return res.data
        } catch (e:any) {
            return this.handleError(e,undefined,true)
        }
     }

     async createProject(data:InferRequest<CreateProjectRequest>){
        try {
            const res = await this._axiosInstance.post<InferResponse<ProjectResponse>>(PROJECTS_API_ROUTES.CREATE_PROJECT(), data)
            return res.data
        } catch (e:any) {
            return this.handleError(e,undefined,true)
        }
     }

     async getProjectsLinkedToTeam({teamId}:InferRequest<GetProjectsLinkedToTeamRequest>){
        try {
            const res = await this._axiosInstance.get<InferResponse<ProjectsLinkedToTeamResponse>>(PROJECTS_API_ROUTES.GET_PROJECTS_LINKED_TO_TEAM({teamId}))
            return res.data
        } catch (e:any) {
            return this.handleError(e,undefined,true)
        }
     }

     async checkDomainAvailability({domain}:InferRequest<CheckDomainAvailabilityRequest>){
        try {
            const res = await this._axiosInstance.get<InferResponse<CheckDomainAvailabilityResponse>>(PROJECTS_API_ROUTES.CHECK_DOMAIN_AVAILABILITY({domain}))
            return res.data
        } catch (e:any) {
            return this.handleError(e,undefined,true)
        }
     }

     async deleteDeployment({projectId, deploymentId}:InferRequest<DeleteDeploymentRequest>){
        try {
            const res = await this._axiosInstance.delete<InferResponse<DeploymentResponse>>(PROJECTS_API_ROUTES.DELETE_DEPLOYMENT({projectId, deploymentId}))
            return res.data
        } catch (e:any) {
            return this.handleError(e,undefined,true)
        }
     }

     async redeployDeployment({projectId, deploymentId}:InferRequest<RedeployRequest>){
        try {
            const res = await this._axiosInstance.post<InferResponse<DeploymentResponse>>(PROJECTS_API_ROUTES.REDEPLOY_DEPLOYMENT({projectId, deploymentId}))
            return res.data
        } catch (e:any) {
            return this.handleError(e,undefined,true)
        }
     }
}

const projectService = new ProjectService();
export default projectService;