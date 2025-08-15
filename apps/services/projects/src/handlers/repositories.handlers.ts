import { ServerUnaryCall, sendUnaryData, status } from "@grpc/grpc-js";
import { CreateRepositoryRequest, DeleteRepositoryRequest, GetRepositoryRequest, RepositoryResponse } from "@shipoff/proto";
import { RepositoriesService } from "services/repositories.service";
import { DeleteDeploymentRequestBodyType } from "types/deployments";
import { CreateRepositoryRequestBodyType, GetRepositoryRequestBodyType } from "types/repositories";

export class RepositoriesHandlers {
    private _repositoriesService: RepositoriesService;

    constructor() {
        this._repositoriesService = new RepositoriesService();
    }
    
    async handleGetRepository(call: ServerUnaryCall<GetRepositoryRequest & { body: GetRepositoryRequestBodyType }, RepositoryResponse>, callback: sendUnaryData<RepositoryResponse>) {
        try {
            const { code, res, message } = await this._repositoriesService.getRepository(call.request.body);
            if (code !== 0) return callback({ code, message });
            const response = RepositoryResponse.fromObject({ code, message, res });
            return callback(null, response);
        } catch (e: any) {
            return callback({
                code:status.INTERNAL,
                message: "Internal server error"
            });
        }
    }

    async handleDeleteUniqueRepository(call: ServerUnaryCall<DeleteRepositoryRequest & { body: DeleteDeploymentRequestBodyType }, RepositoryResponse>, callback: sendUnaryData<RepositoryResponse>) {
        try {
            const { code, res, message } = await this._repositoriesService.deleteUniqueRepository(call.request.body);
            if (code !== 0) return callback({ code, message });
            const response = RepositoryResponse.fromObject({ code, message, res });
            return callback(null, response);
        } catch (e: any) {
            return callback({
                code:status.INTERNAL,
                message: "Internal server error"
            });
        }
    }

    async handleCreateRepository(call: ServerUnaryCall<CreateRepositoryRequest & { body: CreateRepositoryRequestBodyType }, RepositoryResponse>, callback: sendUnaryData<RepositoryResponse>) {
        try {
            const { code, res, message } = await this._repositoriesService.createRepository(call.request.body);
            if (code !== 0) return callback({ code, message });
            const response = RepositoryResponse.fromObject({ code, message, res });
            return callback(null, response);
        } catch (e: any) {
            return callback({
                code:status.INTERNAL,
                message: "Internal server error"
            });
        }
    }
}