export type ContainerEvent <T extends keyof typeof $ContainerEvent> = {
    projectId:string;
    domain:string;
    event: T;
    podURL:string;
    containerId:string;
    containerName:string;
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
    STARTING = "STARTING",
    RUNNING = "RUNNING",
    STOPPED = "STOPPED",
    ERROR = "ERROR"
}

export enum $DeploymentEvent {
    CREATED = "CREATED",
    DELETED = "DELETED",
}

export enum $ProjectEvent {
    CREATED = "CREATED",
    DELETED = "DELETED",
}