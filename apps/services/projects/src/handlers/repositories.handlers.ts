import { ServerUnaryCall, sendUnaryData, status } from "@grpc/grpc-js";
import { LinkRepositoryRequest, UnlinkRepositoryRequest, RepositoryResponse } from "@shipoff/proto";
import { RepositoriesService } from "services/repositories.service";
import { LinkRepositoryRequestBodyType, UnlinkRepositoryRequestBodyType } from "types/repositories";

export class RepositoriesHandlers {
    private _repositoriesService: RepositoriesService;

    constructor() {
        this._repositoriesService = new RepositoriesService();
    }

    async handleUnlinkRepository(call: ServerUnaryCall<UnlinkRepositoryRequest & { body: UnlinkRepositoryRequestBodyType }, RepositoryResponse>, callback: sendUnaryData<RepositoryResponse>) {
        try {
            const { code, res, message } = await this._repositoriesService.unlinkRepository(call.request.body);
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

    async handleLinkRepository(call: ServerUnaryCall<LinkRepositoryRequest & { body: LinkRepositoryRequestBodyType }, RepositoryResponse>, callback: sendUnaryData<RepositoryResponse>) {
        try {
            const { code, res, message } = await this._repositoriesService.linkRepository(call.request.body);
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