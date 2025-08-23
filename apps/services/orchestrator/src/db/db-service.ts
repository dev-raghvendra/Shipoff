import { ContainerModel } from "@/models/container.model";
import { Container } from "@/types/container";
import { status } from "@grpc/grpc-js";
import { GrpcAppError } from "@shipoff/services-commons";
import { FilterQuery } from "mongoose";

export class Database{
    async createContainer(body:Container){
        const container = await ContainerModel.create(body)
        return container.toObject();
    }

    async findContainer(filter:FilterQuery<Container>){
        try {
            const container = await ContainerModel.findOne(filter)
            if(container) return container.toObject();
            throw new GrpcAppError(status.NOT_FOUND, "Container not found");
        } catch (e:any) {
            throw new GrpcAppError(status.INTERNAL, e.message, e);
        }
    }
}

