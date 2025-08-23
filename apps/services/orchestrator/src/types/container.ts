import z from "zod";

export type Container = {
    containerId:string,
    name:string,
    domain:string,
    status:"PROVISIONING"|"RUNNING"|"FAILED"|"KILLED",
    nodePort:number,
    projectId:string
}