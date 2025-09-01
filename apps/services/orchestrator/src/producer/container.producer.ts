import { status } from "@grpc/grpc-js";
import { $ContainerEvent, ContainerEvent } from "@shipoff/redis";
import { TOPICS } from "@shipoff/redis/config/config";
import { GetRedisClient } from "@shipoff/redis/redis-client/client";
import { flatenObject, GrpcAppError } from "@shipoff/services-commons";
import Redis from "ioredis";

export class ContainerProducer {
    private _redisClient:Redis
    constructor(){
        this._redisClient = GetRedisClient();
    }

    async publishContainerEvent(message:ContainerEvent<keyof typeof $ContainerEvent>){
        try {
            const topic = TOPICS.CONTAINER_TOPIC;
            const flattenedMessage = flatenObject(message);
            const messageId = await this._redisClient.xadd(topic,"MAXLEN","100","*",...flattenedMessage);
            return messageId
        } catch (e:any) {
            throw new GrpcAppError(status.INTERNAL, "Failed to publish container event", e)
        }
    }
}