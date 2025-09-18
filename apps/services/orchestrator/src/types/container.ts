import z from "zod";

 

export type Container = {
    containerId:string,
    name:string,
    domain:string,
    status:"PROVISIONING"|"RUNNING"|"FAILED"|"KILLED",
    nodePort:number,
    projectId:string
}

export const GetContainerRequestSchema = z.object({
    projectId: z.string().min(3).max(100)
}).strict();

export const GetCloneURIRequestSchema = z.object({
    jwt:z.string().min(10)
}).strict();

export const OrchestratorWebhookRequestSchema = z.object({
    payload:z.string().min(10),
    event:z.enum(["TRAFFIC_DETECTED","STATE_CHANGED"])
}).strict();

export type TRAFFIC_DETECTED = {
    projectId:string;
    containerId:string;
    action:"INGRESSED";
    deploymentId:string;    
}

export type STATE_CHANGED = {
    projectId:string;
    containerId:string;
    deploymentId:string;
    action:"PROVISIONING"|"RUNNING"|"FAILED"|"TERMINATED"|"PRODUCTION"
}

export type OrchestratorWebhookRequestBodyType = z.infer<typeof OrchestratorWebhookRequestSchema>;
export type GetContainerRequestBodyType = z.infer<typeof GetContainerRequestSchema>;
export type GetCloneURIRequestBodyType = z.infer<typeof GetCloneURIRequestSchema>;