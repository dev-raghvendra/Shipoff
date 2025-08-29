import { GetOrchestratorClient } from "@shipoff/grpc-clients";
import { IGetContainerCredsRequest, IGetContainerRequest, OrchestratorServiceClient } from "@shipoff/proto";
import { promisifyGrpcCall } from "@shipoff/services-commons";

export class OrchestratorService {
  private _orchestratorService : OrchestratorServiceClient
  constructor() {
    this._orchestratorService = GetOrchestratorClient();
  }

  async getBuildContainerCreds(body:any){
    try {
        const req = IGetContainerCredsRequest.fromObject(body)
        const response = await promisifyGrpcCall(this._orchestratorService.IGetBuildContainerCreds.bind(this._orchestratorService), req);
        return response;
      } catch (e:any) {
        return e;
    }
  }

  async getProdContainerCreds(body:any){
    try {
        const req = IGetContainerCredsRequest.fromObject(body)
        const response = await promisifyGrpcCall(this._orchestratorService.IGetProdContainerCreds.bind(this._orchestratorService), req);
        return response;
    } catch (e:any) {
        return e;
    }
  }

}