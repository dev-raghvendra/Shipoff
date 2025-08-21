import { status } from "@grpc/grpc-js";
import { DeploymentEvent, $DeploymentEvent } from "@shipoff/redis";
import { TOPICS } from "@shipoff/redis/config/config";
import { GetRedisClient } from "@shipoff/redis/redis-client/client";
import { flatenObject } from "@shipoff/services-commons";
import { GrpcAppError } from "@shipoff/services-commons";
import {Redis} from "ioredis";


export class DeploymentEventProducerService {
    private _redisClient : Redis
    constructor(){
        this._redisClient = GetRedisClient();
    }

    async publishDeploymentRequested(message:DeploymentEvent<keyof typeof $DeploymentEvent>) {
        try {
            const topic = TOPICS.DEPLOYMENT_TOPIC;
            const flattenedMessage = flatenObject(message);
        const messageId = await this._redisClient.xadd(topic, "*", ...flattenedMessage)
        return messageId;
        } catch (e:any) {
            throw new GrpcAppError(status.INTERNAL, "Failed to publish deployment requested event", e);
        }
    }
    
}
