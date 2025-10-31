import { UnimplementedLogServiceService } from "@shipoff/proto";
import { createRPCEntry, RPC_SCHEMA_T } from "@shipoff/services-commons";
import { ExportLogsRequestSchema,IPutLogRequestSchema, StreamLogsRequestSchema } from "@/types/Logs";


export type RPCs = keyof typeof UnimplementedLogServiceService.definition;



export const UNARY_RPC_SCHEMA: Omit<RPC_SCHEMA_T<RPCs>,"StreamLogs"> = {
    IPutLog:createRPCEntry(IPutLogRequestSchema),
    ExportLogs:createRPCEntry(ExportLogsRequestSchema)
} as const

export const STREAM_RPC_SCHEMA: Omit<RPC_SCHEMA_T<RPCs>,"IPutLog"|"ExportLogs"> = {
    StreamLogs:createRPCEntry(StreamLogsRequestSchema)
} as const
