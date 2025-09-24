import z from "zod";
import { optionalString, RequestMetaSchema, UserSchema } from "@shipoff/types";


export const logBodySchema = z.object({
     message:z.string(),
     level:z.enum(['INFO','ERROR', 'SUCCESS']),
     timestamp:z.string().min(1),
     type:z.enum(['SYSTEM','BUILD','RUNTIME']),
     envId:z.string().min(1)
})

export const IPutLogRequestSchema = z.object({
   logs:z.array(logBodySchema).min(1)
}).strict()

export const GetLogsRequestSchema = z.object({
    authUserData:UserSchema,
    deploymentId:z.string().min(1),
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

export type IPutLogRequestBodyType = z.infer<typeof IPutLogRequestSchema>;
export type GetLogsRequestBodyType = z.infer<typeof GetLogsRequestSchema>;
export type StreamLogsRequestBodyType = z.infer<typeof StreamLogsRequestSchema>;
export type logBody = Omit<z.infer<typeof logBodySchema>,"envId">;