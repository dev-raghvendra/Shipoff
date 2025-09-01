import { OrchestratorService } from "@/services/orchestrator.service";
import { GetCloneURIRequestBodyType, GetContainerRequestBodyType } from "@/types/container";
import { sendUnaryData, ServerUnaryCall, status } from "@grpc/grpc-js";
import { CloneURIResponse, ContainerResponse, IGetCloneURIRequest, IGetContainerRequest } from "@shipoff/proto";

export class OrchestratorHandler {
    private orchestratorService : OrchestratorService
    constructor(){
        this.orchestratorService = new OrchestratorService();
    }

    async handleIGetContainer(call:ServerUnaryCall<IGetContainerRequest & {body:GetContainerRequestBodyType},ContainerResponse>,callback:sendUnaryData<ContainerResponse>){
        try {
            const {code,res,message} = await this.orchestratorService.IGetContainerByDomain(call.request.body);
            if(code!==status.OK) return callback({code:code,message:message});
            const response = ContainerResponse.fromObject({code,res,message});
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