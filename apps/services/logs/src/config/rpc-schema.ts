import { UnimplementedLogServiceService } from "@shipoff/proto";
import { createRPCEntry, RPC_SCHEMA_T } from "@shipoff/services-commons";
import { IPutLogRequestSchema } from "@/types/Logs";


export type RPCs = keyof typeof UnimplementedLogServiceService.definition;



export const RPC_SCHEMA: RPC_SCHEMA_T<RPCs> = {
    IPutLog:createRPCEntry(IPutLogRequestSchema),
} as const
