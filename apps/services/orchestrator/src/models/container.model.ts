import { model, Schema , InferSchemaType} from "mongoose";

export const containerSchema = new Schema({
    containerId:{type:Schema.Types.String, required:true},
    domain:{type:Schema.Types.String, required:true},
    status:{type:Schema.Types.String, enum:["PROVISIONING","RUNNING","PRODUCTION","FAILED", "TERMINATED"],required:true},
    nodePort:{type:Schema.Types.Number, required:false},
    projectId:{type:Schema.Types.String, required:true},
    deploymentId:{type:Schema.Types.String, required:true},
    terminatedAt:{type:Schema.Types.Number, default:null,required:false},
    lastIngressedAt:{type:Schema.Types.Number, default:null,required:false},
},{timestamps:true,_id:false});

export type ContainerDocument = Omit<InferSchemaType<typeof containerSchema>,"createdAt"|"updatedAt">
export const ContainerModel = model("Container", containerSchema,"container");


