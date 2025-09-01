import { GetCloneURIRequestSchema, GetContainerRequestSchema, OrchestratorWebhookRequestSchema } from "@/types/container";
import { UnimplementedOrchestratorServiceService } from "@shipoff/proto";
import { createRPCEntry, RPC_SCHEMA_T } from "@shipoff/services-commons";

type RPCs = keyof typeof UnimplementedOrchestratorServiceService.definition;

export const RPC_SCHEMA:RPC_SCHEMA_T<RPCs> = {
    IGetContainer:createRPCEntry(GetContainerRequestSchema),
    IGetCloneURI:createRPCEntry(GetCloneURIRequestSchema),
    IOrchestratorWebhook:createRPCEntry(OrchestratorWebhookRequestSchema),
}
