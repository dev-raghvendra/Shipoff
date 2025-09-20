import { K8DeploymentDocument, K8DeploymentModel } from "@/models/k8.deployment.model";
import { status } from "@grpc/grpc-js";
import { GrpcAppError } from "@shipoff/services-commons";
import { FilterQuery } from "mongoose";

export class Database{
    async createK8Deployment(body:K8DeploymentDocument){
        const deployment = await K8DeploymentModel.create(body)
        return deployment.toObject();
    }

    async findK8Deployment(filter:FilterQuery<K8DeploymentDocument>){
        try {
            const deployment = await K8DeploymentModel.findOne(filter).sort({createdAt:-1});
            if(deployment) return deployment.toObject();
            throw new GrpcAppError(status.NOT_FOUND, "Deployment not found");
        } catch (e:any) {
            throw new GrpcAppError(status.INTERNAL, e.message, e);
        }
    }

    async upsertK8Deployment(filter:FilterQuery<K8DeploymentDocument>, update:Partial<K8DeploymentDocument>){
        try {
            const deployment = await K8DeploymentModel.findOneAndUpdate(filter,update,{
                new:true,
                upsert:true,
                setDefaultsOnInsert:true
            })
            if(deployment) return deployment.toObject();
            throw new GrpcAppError(status.NOT_FOUND, "Container not found");
        } catch (e:any) {
            throw new GrpcAppError(status.INTERNAL, e.message, e);
        }
    }

    async findAndUpdateK8Deployment(filter:FilterQuery<K8DeploymentDocument>, update:Partial<K8DeploymentDocument>){
        try {
            const deployment = await K8DeploymentModel.findOneAndUpdate(filter,update,{
                new:true
            })
            if(deployment) return deployment.toObject();
            throw new GrpcAppError(status.NOT_FOUND, "Deployment not found");
        } catch (e:any) {
            throw new GrpcAppError(status.INTERNAL, e.message, e);
        }
    }

    async deleteManyK8Deployment(filter:FilterQuery<K8DeploymentDocument>){
        try {
            await K8DeploymentModel.deleteMany(filter)
            return true;
        } catch (e:any) {
            throw new GrpcAppError(status.INTERNAL, e.message, e);
        }
    }
}

export const dbService = new Database();