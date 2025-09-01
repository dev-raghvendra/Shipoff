import { OrchestratorWebhookService } from "@/services/orchestrator-webhook.service";
import { OrchestratorWebhookRequestBodyType } from "@/types/container";
import { sendUnaryData, ServerUnaryCall, status } from "@grpc/grpc-js";
import { OrchestratorWebhookRequest, google } from "@shipoff/proto";

export class OrchestratorWebhookHandler {
    private _webhookService : OrchestratorWebhookService

    constructor(){
        this._webhookService = new OrchestratorWebhookService();
    }

    async handleIOrchestratorWebhook(call:ServerUnaryCall<OrchestratorWebhookRequest & {body:OrchestratorWebhookRequestBodyType}, google.protobuf.Empty>,callBack:sendUnaryData<google.protobuf.Empty>){
        try {
            const {code,message} = await this._webhookService.IWebhook(call.request.body);
            if(code!==status.OK) return callBack({code:code,message:message});
            return callBack(null,google.protobuf.Empty.fromObject({}));
        } catch (e:any) {
            return callBack({
                code:status.INTERNAL,
                message:"Internal server error"
            });
        }
    }
}