import { logger } from "@/libs/winston";
import { GetOrchestratorClient } from "@shipoff/grpc-clients";
import { IDeploymentIngressedRequest, OrchestratorServiceClient } from "@shipoff/proto";
import { promisifyGrpcCall, createSyncErrHandler } from "@shipoff/services-commons";
import {RequestMetaType} from "@shipoff/types"

export class OrchestratorService {
    private _projectClient : OrchestratorServiceClient
    private _errHandler : ReturnType<typeof createSyncErrHandler>

    constructor(){
        this._projectClient = GetOrchestratorClient()
        this._errHandler = createSyncErrHandler({subServiceName:"ORCHESTRATOR_SERVICE",logger})
    }

    async deploymentIngressed(projectId:string,reqMeta:RequestMetaType){
        try {
            const payload = {
                projectId,
                reqMeta
            }
            const req = IDeploymentIngressedRequest.fromObject(payload)
            await  promisifyGrpcCall(this._projectClient.IDeploymentIngressed.bind(this._projectClient),req)
        } catch (e:any) {
            this._errHandler(e,"DEPLOYMENT_INGRESSED",reqMeta.requestId)
        }
    }
}