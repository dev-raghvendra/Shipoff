import { model, Schema } from "mongoose";

export const containerSchema = new Schema({
    containerId:{type:Schema.Types.String, required:true},
    name:{type:Schema.Types.String, required:true},
    domain:{type:Schema.Types.String, required:true},
    status:{type:Schema.Types.String, enum:["PROVISIONING","RUNNING","FAILED", "KILLED"],required:true},
    nodePort:{type:Schema.Types.Number, required:true},
    projectId:{type:Schema.Types.String, required:true},
    deploymentId:{type:Schema.Types.String, required:true},
    terminatedAt:{type:Schema.Types.Date, default:null},
    lastIngressedAt:{type:Schema.Types.Date, default:null},
},{timestamps:true,_id:false});

export const ContainerModel = model("Container", containerSchema,"container");

