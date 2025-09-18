import { ContainerDocument, ContainerModel } from "@/models/container.model";
import { status } from "@grpc/grpc-js";
import { GrpcAppError } from "@shipoff/services-commons";
import { FilterQuery } from "mongoose";

export class Database{
    async createContainer(body:ContainerDocument){
        const container = await ContainerModel.create(body)
        return container.toObject();
    }

    async findContainer(filter:FilterQuery<ContainerDocument>){
        try {
            const container = await ContainerModel.findOne(filter).sort({createdAt:-1});
            if(container) return container.toObject();
            throw new GrpcAppError(status.NOT_FOUND, "Container not found");
        } catch (e:any) {
            throw new GrpcAppError(status.INTERNAL, e.message, e);
        }
    }

    async upsertContainer(filter:FilterQuery<ContainerDocument>, update:Partial<ContainerDocument>){
        try {
            const container = await ContainerModel.findOneAndUpdate(filter,update,{
                new:true,
                upsert:true,
                setDefaultsOnInsert:true
            })
            if(container) return container.toObject();
            throw new GrpcAppError(status.NOT_FOUND, "Container not found");
        } catch (e:any) {
            throw new GrpcAppError(status.INTERNAL, e.message, e);
        }
    }

    async findAndUpdateContainer(filter:FilterQuery<ContainerDocument>, update:Partial<ContainerDocument>){
        try {
            const container = await ContainerModel.findOneAndUpdate(filter,update,{
                new:true
            })
            if(container) return container.toObject();
            throw new GrpcAppError(status.NOT_FOUND, "Container not found");
        } catch (e:any) {
            throw new GrpcAppError(status.INTERNAL, e.message, e);
        }
    }

    async deleteManyContainer(filter:FilterQuery<ContainerDocument>){
        try {
            await ContainerModel.deleteMany(filter)
            return true;
        } catch (e:any) {
            throw new GrpcAppError(status.INTERNAL, e.message, e);
        }
    }
}

export const dbService = new Database();