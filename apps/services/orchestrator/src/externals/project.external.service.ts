import {GetProjectClient} from "@shipoff/grpc-clients"
import { IGetDeploymentRequest, IGetGithubRepoAccessTokenRequest, IGetLastDeploymentRequest, IGetProjectRequest, ProjectsServiceClient } from "@shipoff/proto"
import { promisifyGrpcCall } from "@shipoff/services-commons";
import { InferResponse } from "@shipoff/types";


export class ProjectExternalService {
    private _projectService : ProjectsServiceClient;
    constructor(){
        this._projectService = GetProjectClient();
    }

    async getProjectById(projectId:string,requestId:string){
        try {
            const req = IGetProjectRequest.fromObject({ projectId,reqMeta:{requestId} });
            const res = await promisifyGrpcCall(this._projectService.IGetProject, req );
            return res.res as InferResponse<typeof res>["res"];
        } catch (e:any) {
            throw e
        }
    }
    
    async getLastDeployment(projectId:string,requestId:string){
        try {
            const req = IGetLastDeploymentRequest.fromObject({ projectId,reqMeta:{requestId} });
            const res = await promisifyGrpcCall(this._projectService.IGetLastDeployment, req );
            return res.res as InferResponse<typeof res>["res"];
        } catch (e:any) {
            throw e
        }
    }

    async getDeploymentById(deploymentId:string,requestId:string){
        try {
            const req = IGetDeploymentRequest.fromObject({ deploymentId,reqMeta:{requestId} });
            const res = await promisifyGrpcCall(this._projectService.IGetDeployment, req );
            return res.res as InferResponse<typeof res>["res"];
        } catch (e:any) {
            throw e
        }
    }

    async getGithubRepoAccessToken(projectId:string,githubRepoId:string,requestId:string){
        try {
            const req = IGetGithubRepoAccessTokenRequest.fromObject({projectId,githubRepoId,reqMeta:{requestId}});
            const res = await promisifyGrpcCall(this._projectService.IGetGithubRepoAccessToken, req );
            return res.res as InferResponse<typeof res>["res"];
        } catch (e:any) {
            throw e
        }
    }
}