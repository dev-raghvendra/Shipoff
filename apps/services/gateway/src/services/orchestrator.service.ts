import { GetOrchestratorClient } from "@shipoff/grpc-clients";
import { IGetCloneURIRequest, IStartK8DeploymentRequest, OrchestratorServiceClient } from "@shipoff/proto";
import { promisifyGrpcCall } from "@shipoff/services-commons";

export class OrchestratorService {
  private _orchestratorService : OrchestratorServiceClient
  constructor() {
    this._orchestratorService = GetOrchestratorClient();
  }

  async getK8Deployment(body:any){
    try {
        const req = IStartK8DeploymentRequest.fromObject(body)
        const response = await promisifyGrpcCall(this._orchestratorService.IStartK8Deployment.bind(this._orchestratorService), req);
        return response;
      } catch (e:any) {
        return e;
    }
  }

  async getCloneURI(body:any){
     try {
         const req = IGetCloneURIRequest.fromObject(body)
         const response = await promisifyGrpcCall(this._orchestratorService.IGetCloneURI.bind(this._orchestratorService), req);
         return response;
     } catch (e:any) {
         return e;
     }
  }

}