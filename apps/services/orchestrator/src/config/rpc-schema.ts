import { GetCloneURIRequestSchema, OrchestratorWebhookRequestSchema, StartK8DeploymentRequestSchema } from "@/types/orchestrator";
import { UnimplementedOrchestratorServiceService } from "@shipoff/proto";
import { createRPCEntry, RPC_SCHEMA_T } from "@shipoff/services-commons";

type RPCs = keyof typeof UnimplementedOrchestratorServiceService.definition;

export const RPC_SCHEMA:RPC_SCHEMA_T<RPCs> = {
    IStartK8Deployment:createRPCEntry(StartK8DeploymentRequestSchema),
    IGetCloneURI:createRPCEntry(GetCloneURIRequestSchema),
    IOrchestratorWebhook:createRPCEntry(OrchestratorWebhookRequestSchema),
}
