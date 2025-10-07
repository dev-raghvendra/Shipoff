import { z, ZodType } from "zod";

export async function validateBody<T extends ZodType>(schema:T,body:unknown): Promise<z.infer<T> | null>{
     try {
         return await schema.parseAsync(body)
     } catch (error) {
         console.error("Validation Error:",error)
         return null
     }
}
