import { model, Schema , InferSchemaType} from "mongoose";

export const k8DeploymentSchema = new Schema({
    status:{type:Schema.Types.String, enum:["PROVISIONING","RUNNING","PRODUCTION","FAILED", "TERMINATED"],required:true},
    projectId:{type:Schema.Types.String, required:true},
    deploymentId:{type:Schema.Types.String, required:true},
    terminatedAt:{type:Schema.Types.Number, default:null,required:false},
    lastIngressedAt:{type:Schema.Types.Number, default:null,required:false},
},{timestamps:true});

export type K8DeploymentDocument = Omit<InferSchemaType<typeof k8DeploymentSchema>,"createdAt"|"updatedAt">
export const K8DeploymentModel = model("K8Deployment", k8DeploymentSchema,"k8deployments");


