import z from "zod";

 

export type Container = {
    containerId:string,
    name:string,
    domain:string,
    status:"PROVISIONING"|"RUNNING"|"FAILED"|"KILLED",
    nodePort:number,
    projectId:string
}

export const StartK8DeploymentRequestSchema = z.object({
    projectId: z.string().min(3).max(100),
    projectType:z.enum(["STATIC","DYNAMIC"]),
    deploymentId:z.string().min(3).max(100),
    commitHash:z.string().min(7).max(40)
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
export type StartK8DeploymentRequestBodyType = z.infer<typeof StartK8DeploymentRequestSchema>;
export type GetCloneURIRequestBodyType = z.infer<typeof GetCloneURIRequestSchema>;