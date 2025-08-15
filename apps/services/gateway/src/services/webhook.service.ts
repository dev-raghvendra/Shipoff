import { GetProjectClient } from "@shipoff/grpc-clients";
import { GithubWebhookRequest, ProjectsServiceClient } from "@shipoff/proto";
import { promisifyGrpcCall } from "@shipoff/services-commons/utils/rpc-utils";

export class GithubWebhookService {
    private _githubWebhookService: ProjectsServiceClient;

    constructor() {
        this._githubWebhookService = GetProjectClient();
    }

    async githubWebHook(event: any) {
        try {
            const req = GithubWebhookRequest.fromObject(event);
            const response = await promisifyGrpcCall(this._githubWebhookService.GithubWebhook.bind(this._githubWebhookService), req);
            return response;
        } catch (e:any) {
            return e;
        }
    }

}