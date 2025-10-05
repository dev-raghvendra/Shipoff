import { CachedProject, projectCache } from "@/cache/project.cache";
import { DeploymentEvent } from "@shipoff/redis";
import { TOPICS } from "@shipoff/redis/config/config";
import { GetRedisClient } from "@shipoff/redis/redis-client/client";
import { flatenObject } from "@shipoff/services-commons";
import { GrpcAppError } from "@shipoff/services-commons";
import {Redis} from "ioredis";


export class DeploymentProducer {
    private _redisClient : Redis
    constructor(){
        this._redisClient = GetRedisClient();
    }

    async publishDeploymentRequested(project:CachedProject,requestId:string) {
        try {
            if(project.deploymentRequested) return "ALREADY-REQUESTED"
            const message : DeploymentEvent<"REQUESTED"> = {
                projectId: project.projectId,
                deploymentId: "N/A",
                domain: "N/A",
                projectType: project.projectType,
                event: "REQUESTED",
                commitHash: "N/A",
                requestId
            }
            const topic = TOPICS.DEPLOYMENT_TOPIC;
            const flattenedMessage = flatenObject(message);
            const messageId = await this._redisClient.xadd(topic,"MAXLEN","100","*", ...flattenedMessage)
            projectCache.markDeploymentRequested(message.projectId)
            return messageId;
        } catch (e:any) {
            throw new GrpcAppError(13, "Failed to publish deployment requested event", e);
        }
    }
}
