export type ContainerEvent <T extends keyof typeof $ContainerEvent> = {
    projectId:string;
    event: T;
    containerId:string;
}

export type DeploymentEvent <T extends keyof typeof $DeploymentEvent> =  {
    event:T;
    projectId:string;
    deploymentId:string;
    domain:string
}

export type AuthEvent<T extends keyof typeof $AuthEvent> = {
    userId:string;
    action:T;
}

export type ProjectEvent<T extends keyof typeof $ProjectEvent> = {
    projectId:string;
    userId:string
    event:T;
}

export enum $AuthEvent {
    DELETED = "DELETED"
}

export enum $ContainerEvent {
    PROVISIONING = "PROVISIONING",  
    RUNNING = "RUNNING",
    PRODUCTION = "PRODUCTION",
    FAILED = "FAILED",
    TERMINATED = "TERMINATED",
}

export enum $DeploymentEvent {
    CREATED = "CREATED",
    DELETED = "DELETED",
}

export enum $ProjectEvent {
    CREATED = "CREATED",
    DELETED = "DELETED",
}