import { GetOrchestratorClient, GetProjectClient } from "@shipoff/grpc-clients";
import { GithubWebhookRequest, OrchestratorServiceClient, OrchestratorWebhookRequest, ProjectsServiceClient } from "@shipoff/proto";
import { promisifyGrpcCall } from "@shipoff/services-commons/utils/rpc-utils";

export class WebhookService {
    private _githubWebhookService: ProjectsServiceClient;
    private _orchestratorWebhookService:OrchestratorServiceClient

    constructor() {
        this._githubWebhookService = GetProjectClient();
        this._orchestratorWebhookService = GetOrchestratorClient();
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

    async orchestratorWebhook(event:any){
        try {
            const req = OrchestratorWebhookRequest.fromObject(event);
            const response = await promisifyGrpcCall(this._orchestratorWebhookService.IOrchestratorWebhook.bind(this._orchestratorWebhookService), req);
            return response;
        } catch (e:any) {
            return e;
        }
    }
}