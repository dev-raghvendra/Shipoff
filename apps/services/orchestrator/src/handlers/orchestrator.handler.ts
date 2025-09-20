import { OrchestratorService } from "@/services/orchestrator.service";
import { GetCloneURIRequestBodyType, StartK8DeploymentRequestBodyType } from "@/types/orchestrator";
import { sendUnaryData, ServerUnaryCall, status } from "@grpc/grpc-js";
import { CloneURIResponse, IGetCloneURIRequest, IStartK8DeploymentRequest, IStartK8DeploymentResponse } from "@shipoff/proto";

export class OrchestratorHandler {
    private orchestratorService : OrchestratorService
    constructor(){
        this.orchestratorService = new OrchestratorService();
    }

    async handleIStartK8Deployment(call:ServerUnaryCall<IStartK8DeploymentRequest & {body:StartK8DeploymentRequestBodyType},IStartK8DeploymentResponse>,callback:sendUnaryData<IStartK8DeploymentResponse>){
        try {
            const {code,res,message} = await this.orchestratorService.IStartK8Deployment(call.request.body);
            if(code!==status.OK) return callback({code:code,message:message});
            const response = IStartK8DeploymentResponse.fromObject({code,message});
            return callback(null,response);
        } catch (e:any) {
            return callback({code:status.INTERNAL,message:"Internal server error"});
        }
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



}