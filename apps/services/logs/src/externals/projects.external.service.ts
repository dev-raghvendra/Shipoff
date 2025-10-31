import { GetProjectClient } from "@shipoff/grpc-clients";
import { DeploymentResponse, GetDeploymentRequest, InternalEmptyRequest, ProjectsServiceClient } from "@shipoff/proto";
import { promisifyGrpcCall } from "@shipoff/services-commons";
import { InferResponse, InternalEmptyRequestBodyType, RequestMetaType, UserType } from "@shipoff/types";

export class ProjectsExternalService {
    private _projectsService : ProjectsServiceClient;
    constructor(){
        this._projectsService = GetProjectClient()
    }

    async getStaleEnvironmentIds(body:InternalEmptyRequestBodyType){
            const req = InternalEmptyRequest.fromObject(body)
            const res = await promisifyGrpcCall(this._projectsService.IGetStaleEnvironmentIds.bind(this._projectsService),req)
            return res.res
    }

    async getDeploymentDetails(body:{projectId:string,deploymentId:string,authUserData:UserType,reqMeta:RequestMetaType}){

         const req = GetDeploymentRequest.fromObject(body)
         const res = await promisifyGrpcCall(this._projectsService.GetDeployment.bind(this._projectsService),req) as InferResponse<DeploymentResponse>;
         return res.res
    }
}