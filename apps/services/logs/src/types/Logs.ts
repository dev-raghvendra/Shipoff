import z from "zod";
import { optionalString, RequestMetaSchema, UserSchema ,LogBodySchema} from "@shipoff/types";


export const IPutLogRequestSchema = z.object({
   logs:z.array(LogBodySchema).min(1)
}).strict()

export const GetLogsRequestSchema = z.object({
    authUserData:UserSchema,
    reqMeta:RequestMetaSchema,
    projectId:z.string().min(1),
    environmentId:z.string().min(1),
    lastBatchId:optionalString()
}).strict()

export const StreamLogsRequestSchema = z.object({
    authUserData:UserSchema,
    environmentId:z.string().min(1),
    reqMeta:RequestMetaSchema,
    projectId:z.string().min(1)
}).strict()

export const ExportLogsRequestSchema = z.object({
    authUserData:UserSchema,
    reqMeta:RequestMetaSchema,
    deploymentId:z.string().min(1),
    projectId:z.string().min(1),
}).strict()

export type IPutLogRequestBodyType = z.infer<typeof IPutLogRequestSchema>;
export type GetLogsRequestBodyType = z.infer<typeof GetLogsRequestSchema>;
export type StreamLogsRequestBodyType = z.infer<typeof StreamLogsRequestSchema>;
export type ExportLogsRequestBodyType = z.infer<typeof ExportLogsRequestSchema>;
export type logBody = Omit<z.infer<typeof LogBodySchema>,"envId">;