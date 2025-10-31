import { GetOrchestratorClient } from "@shipoff/grpc-clients";
import { IGetCloneURIRequest, OrchestratorServiceClient } from "@shipoff/proto";
import { promisifyGrpcCall } from "@shipoff/services-commons";

export class OrchestratorService {
  private _orchestratorService : OrchestratorServiceClient
  constructor() {
    this._orchestratorService = GetOrchestratorClient();
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