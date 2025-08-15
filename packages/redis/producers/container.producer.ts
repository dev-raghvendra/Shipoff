import Redis from "ioredis";
import { TOPICS } from "../config/config";
import { GetRedisClient } from "../redis-client/client";
import { ContainerEvent, $ContainerStatus } from "../types";
import { flatenObject } from "../utils/message-utils";

export class ContainerProducer {
    private _redisClient : Redis
    constructor(){
        this._redisClient = GetRedisClient();
    }

    async publishContainerStarted(message:Omit<ContainerEvent<$ContainerStatus.STARTING>,"status">){
        const topic = TOPICS.CONTAINER_TOPIC;
        const flattenedMessage = flatenObject({status:$ContainerStatus.STARTING,...message});
        const messageId = await this._redisClient.xadd(topic, "*", ...flattenedMessage)
        return messageId;
    }

    async publishContainerStopped(message:Omit<ContainerEvent<$ContainerStatus.STOPPED>,"status">){
        const topic = TOPICS.CONTAINER_TOPIC;
        const flattenedMessage = flatenObject({status:$ContainerStatus.STOPPED,...message});
        const messageId = await this._redisClient.xadd(topic, "*", ...flattenedMessage)
        return messageId;
    }

    async publishContainerRunning(message:Omit<ContainerEvent<$ContainerStatus.RUNNING>,"status">){
        const topic = TOPICS.CONTAINER_TOPIC;
        const flattenedMessage = flatenObject({status:$ContainerStatus.RUNNING,...message});
        const messageId = await this._redisClient.xadd(topic, "*", ...flattenedMessage)
        return messageId;
    }

    async publishContainerError(message:Omit<ContainerEvent<$ContainerStatus.ERROR>,"status">){
        const topic = TOPICS.CONTAINER_TOPIC;
        const flattenedMessage = flatenObject({status:$ContainerStatus.ERROR,...message});
        const messageId = await this._redisClient.xadd(topic, "*", ...flattenedMessage)
        return messageId;
    }
}