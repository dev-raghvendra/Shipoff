import { ServerUnaryCall, sendUnaryData, status } from "@grpc/grpc-js";
import { GithubWebhookRequest, google } from "@shipoff/proto";
import { GithubWebhookService } from "services/github-webhook.service";
import { GithubWebhookRequestBodyType } from "types/webhooks";

export class GithubWebhookHandlers {
    private _githubWebhookService: GithubWebhookService;

    constructor() {
        this._githubWebhookService = new GithubWebhookService();
    }

    async handleGithubWebhook(call: ServerUnaryCall<GithubWebhookRequest & { body: GithubWebhookRequestBodyType }, google.protobuf.Empty>, callback: sendUnaryData<google.protobuf.Empty>) {
        try {
            const { code, message } = await this._githubWebhookService.webhooks(call.request.body);
            if (code !== 0) return callback({ code, message });
            return callback(null, google.protobuf.Empty.fromObject({}));
        } catch (e: any) {
            return callback({
                code: status.INTERNAL,
                message: "Internal server error"
            });
        }
    }
    
}