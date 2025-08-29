import { ContainerService } from "@/services/container.service";
import { GetContainerByDomainBodyType, GetContainerCredsBodyType } from "@/types/container";
import { sendUnaryData, ServerUnaryCall, status } from "@grpc/grpc-js";
import {ContainerCredsResponse, ContainerResponse, IGetContainerCredsRequest, IGetContainerRequest} from "@shipoff/proto"

export class ContainerHandler {
    private _containerService : ContainerService
    constructor(){
        this._containerService = new ContainerService();
    }

    async handleIGetContainerByDomain(call:ServerUnaryCall<IGetContainerRequest & {body:GetContainerByDomainBodyType},ContainerResponse>,callback:sendUnaryData<ContainerResponse>){
        try {
            const {code,res,message} = await this._containerService.IGetContainerByDomain(call.request.body.domain);
            if(code!==status.OK) return callback({code:code,message:message});
            const response = ContainerResponse.fromObject({code,res,message});
            return callback(null,response);
        } catch (e:any) {
            return callback({code:status.INTERNAL,message:"Internal server error"});
        }
    }

    async handleIGetBuildContainerCreds(call:ServerUnaryCall<IGetContainerCredsRequest & {body:GetContainerCredsBodyType},ContainerCredsResponse>,callback:sendUnaryData<ContainerCredsResponse>){
        try {
            const {code,res,message} = await this._containerService.IGetBuildContainerCreds(call.request.body.jwt);
            if(code!==status.OK) return callback({code:code,message:message});
            const response = ContainerCredsResponse.fromObject({code,res,message});
            return callback(null,response);
        } catch (e:any) {
            return callback({code:status.INTERNAL,message:"Internal server error"});
        }
    }

    async handleIGetProdContainerCreds(call:ServerUnaryCall<IGetContainerCredsRequest & {body:GetContainerCredsBodyType},ContainerCredsResponse>,callback:sendUnaryData<ContainerCredsResponse>){
        try {
            const {code,res,message} = await this._containerService.IGetProdContainerCreds(call.request.body.jwt);
            if(code!==status.OK) return callback({code:code,message:message});
            const response = ContainerCredsResponse.fromObject({code,res,message});
            return callback(null,response);
        } catch (e:any) {
            return callback({code:status.INTERNAL,message:"Internal server error"});
        }
    }

}