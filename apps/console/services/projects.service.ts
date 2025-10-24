import { MAIN_BACKEND_API, PROJECTS_API_ROUTES } from "@/config/service-route-config";
import { BaseService } from "./base.service";
import { InferRequest } from "@/types/request";
import { AllDeploymentsResponse, AllProjectsResponse, BulkResourceRequest, DeploymentResponse, GetAllDeploymentsRequest, GetDeploymentRequest, GetProjectRequest, ProjectResponse } from "@shipoff/proto";
import { InferResponse } from "@/types/response";

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
}

const projectService = new ProjectService();
export default projectService;