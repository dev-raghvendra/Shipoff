import { GetCloneURIRequestSchema, IDeploymentIngressedRequestSchema, OrchestratorWebhookRequestSchema } from "@/types/orchestrator";
import { UnimplementedOrchestratorServiceService } from "@shipoff/proto";
import { createRPCEntry, RPC_SCHEMA_T } from "@shipoff/services-commons";

type RPCs = keyof typeof UnimplementedOrchestratorServiceService.definition;

export const RPC_SCHEMA:RPC_SCHEMA_T<RPCs> = {
    IGetCloneURI:createRPCEntry(GetCloneURIRequestSchema),
    IOrchestratorWebhook:createRPCEntry(OrchestratorWebhookRequestSchema),
    IDeploymentIngressed:createRPCEntry(IDeploymentIngressedRequestSchema),
}
