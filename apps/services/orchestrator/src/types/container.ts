import z from "zod";

export type Container = {
    containerId:string,
    name:string,
    domain:string,
    status:"PROVISIONING"|"RUNNING"|"FAILED"|"KILLED",
    nodePort:number,
    projectId:string
}

export const GetContainerByDomain = z.object({
    domain: z.string().min(3).max(100)
}).strict();

export const GetContainerCreds = z.object({
    jwt:z.string().min(10)
}).strict();

export type GetContainerByDomainBodyType = z.infer<typeof GetContainerByDomain>;
export type GetContainerCredsBodyType = z.infer<typeof GetContainerCreds>;  