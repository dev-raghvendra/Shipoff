import { GetContainerByDomain, GetContainerCreds } from "@/types/container";
import { UnimplementedOrchestratorServiceService } from "@shipoff/proto";
import { createRPCEntry, RPC_SCHEMA_T } from "@shipoff/services-commons";

type RPCs = keyof typeof UnimplementedOrchestratorServiceService.definition;

export const RPC_SCHEMA:RPC_SCHEMA_T<RPCs> = {
    GetContainer:createRPCEntry(GetContainerByDomain),
    GetBuildContainerCreds:createRPCEntry(GetContainerCreds),
    GetProdContainerCreds:createRPCEntry(GetContainerCreds),
}