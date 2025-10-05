import { OrchestratorService } from "@/services/orchestrator.service";
import { GetCloneURIRequestBodyType, IDeploymentIngressedRequestType, StartK8DeploymentRequestBodyType } from "@/types/orchestrator";
import { sendUnaryData, ServerUnaryCall, status } from "@grpc/grpc-js";
import { CloneURIResponse, google, IDeploymentIngressedRequest, IGetCloneURIRequest, IStartK8DeploymentRequest, IStartK8DeploymentResponse } from "@shipoff/proto";

export class OrchestratorHandler {
    private orchestratorService : OrchestratorService
    constructor(){
        this.orchestratorService = new OrchestratorService();
    }

    async handleIGetCloneURI(call:ServerUnaryCall<IGetCloneURIRequest & {body:GetCloneURIRequestBodyType},CloneURIResponse>,callback:sendUnaryData<CloneURIResponse>){
        try {
            const {code,res,message} = await this.orchestratorService.IGetCloneURI(call.request.body);
            if(code!==status.OK) return callback({code:code,message:message});
            const response  = CloneURIResponse.fromObject({code,res,message});
            return callback(null,response);
        } catch (e:any) {
            return callback({code:status.INTERNAL,message:"Internal server error"});
        }
    }

    async handleIDeploymentIngressed(call:ServerUnaryCall<IDeploymentIngressedRequest & {body:IDeploymentIngressedRequestType},google.protobuf.Empty>,callback:sendUnaryData<google.protobuf.Empty>){
        try {
            const {code,res,message} = await this.orchestratorService.IDeploymentIngressed(call.request.body);
            if(code!==status.OK) return callback({code,message});
            const response  = google.protobuf.Empty.fromObject({});
            return callback(null,response);
        } catch (e:any) {
            return callback({code:status.INTERNAL,message:"Internal server error"});
        }
    }
}