import { GetOrchestratorClient } from "@shipoff/grpc-clients";
import { IGetCloneURIRequest, IGetContainerRequest, OrchestratorServiceClient } from "@shipoff/proto";
import { promisifyGrpcCall } from "@shipoff/services-commons";

export class OrchestratorService {
  private _orchestratorService : OrchestratorServiceClient
  constructor() {
    this._orchestratorService = GetOrchestratorClient();
  }

  async getContainer(body:any){
    try {
        const req = IGetContainerRequest.fromObject(body)
        const response = await promisifyGrpcCall(this._orchestratorService.IGetContainer.bind(this._orchestratorService), req);
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