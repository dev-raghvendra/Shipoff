import z from "zod";

export const IPutLogRequestSchema = z.object({
   logs:z.array(z.object({
     message:z.string(),
     level:z.enum(['INFO','ERROR', 'SUCCESS']),
     timestamp:z.string().min(1),
     type:z.enum(['SYSTEM','BUILD','RUNTIME']),
     envId:z.string().min(1)
   })).min(1),
})

export type IPutLogRequestBodyType = z.infer<typeof IPutLogRequestSchema>;