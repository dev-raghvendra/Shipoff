import { ServerUnaryCall, sendUnaryData, status } from "@grpc/grpc-js";
import {  AllDeploymentsResponse, DeleteDeploymentRequest, DeploymentResponse, GetAllDeploymentsRequest, GetDeploymentRequest, RedeployRequest } from "@shipoff/proto";
import { DeploymentsService } from "services/deployments.service";
import { DeleteDeploymentRequestBodyType, GetAllDeploymentsRequestBodyType, GetDeploymentRequestBodyType, RedeployRequestBodyType } from "types/deployments";

export class DeploymentsHandlers {
    private _deploymentsService: DeploymentsService;

    constructor() {
        this._deploymentsService = new DeploymentsService();
    }

   async handleGetDeployment(call: ServerUnaryCall<GetDeploymentRequest & { body: GetDeploymentRequestBodyType }, DeploymentResponse>, callback: sendUnaryData<DeploymentResponse>) {
        try {
            const { code, res, message } = await this._deploymentsService.getDeployment(call.request.body);
            if (code !== 0) return callback({ code, message });
            const response = DeploymentResponse.fromObject({ code, message, res });
            return callback(null, response);
        } catch (e: any) {
            return callback({
                code: status.INTERNAL,
                message: "Internal server error"
            });
        }
   }

    async handleGetAllDeployments(call: ServerUnaryCall<GetAllDeploymentsRequest & { body: GetAllDeploymentsRequestBodyType }, AllDeploymentsResponse>, callback: sendUnaryData<AllDeploymentsResponse>) {
        try {
            const { code, res, message } = await this._deploymentsService.getAllDeployments(call.request.body);
            if (code !== 0) return callback({ code, message });
            const response = AllDeploymentsResponse.fromObject({ code, message, res });
            return callback(null, response);
        } catch (e: any) {
            return callback({
                code: status.INTERNAL,
                message: "Internal server error"
            });
        }
    }

    async handleDeleteDeployment(call: ServerUnaryCall<DeleteDeploymentRequest & { body: DeleteDeploymentRequestBodyType }, DeploymentResponse>, callback: sendUnaryData<DeploymentResponse>) {
        try {
            const { code, res, message } = await this._deploymentsService.deleteDeployment(call.request.body);
            if (code !== 0) return callback({ code, message });
            const response = DeploymentResponse.fromObject({ code, message, res });
            return callback(null, response);
        } catch (e:any) {
            return callback({
                code: status.INTERNAL,
                message: "Internal server error"
            });
        }
    }

    async handleRedeploy(call: ServerUnaryCall<RedeployRequest & { body: RedeployRequestBodyType }, DeploymentResponse>, callback: sendUnaryData<DeploymentResponse>) {
        try {
            const { code, res, message } = await this._deploymentsService.redeploy(call.request.body);
            if (code !== 0) return callback({ code, message });
            const response = DeploymentResponse.fromObject({ code, message, res });
            return callback(null, response);
        } catch (e:any) {
            return callback({
                code: status.INTERNAL,
                message: "Internal server error"
            });
        }
    }
}