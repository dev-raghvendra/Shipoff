import { status } from "@grpc/grpc-js";
import { $ProjectEvent, ProjectEvent } from "@shipoff/redis";
import { TOPICS } from "@shipoff/redis/config/config";
import { GetRedisClient } from "@shipoff/redis/redis-client/client";
import { flatenObject } from "@shipoff/services-commons";
import { GrpcAppError } from "@shipoff/services-commons";
import Redis from "ioredis";

export class ProjectProducer {
    private _redisClient : Redis

    constructor() {
        this._redisClient = GetRedisClient();
    }

    async publishProjectEvent(message:ProjectEvent<keyof typeof $ProjectEvent>) {
        try {
            const topic = TOPICS.PROJECT_TOPIC;
            const flattenedMessage = flatenObject(message) 
            const messageId = await this._redisClient.xadd(topic,"MAXLEN","100", "*", ...flattenedMessage) 
            return messageId;
        } catch (e:any) {
            throw new GrpcAppError(status.INTERNAL, "Failed to publish project created event",e)
        }
    }
}