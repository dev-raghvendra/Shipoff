import z from "zod";

export const IPutLogRequestSchema = z.object({
    message:z.string(),
    level:z.enum(['info','error', 'success']),
    timestamp:z.string().min(1),
    type:z.enum(['SYSTEM','BUILD','RUNTIME']),
    environmentId:z.string().min(1),
})

export type IPutLogRequestBodyType = z.infer<typeof IPutLogRequestSchema>;