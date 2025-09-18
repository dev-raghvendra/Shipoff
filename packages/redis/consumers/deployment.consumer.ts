import Redis from "ioredis";
import { GetRedisClient } from "../redis-client/client";
import { DEPLOYMENT_TOPIC_CONSUMER_GROUPS, TOPICS } from "../config/config";
import { createObject, logger } from "../../services-commons";
import { $DeploymentEvent, DeploymentEvent } from "../types";

export class DeploymentConsumer {
    private _redisClient: Redis;
    readonly _serviceName: keyof typeof DEPLOYMENT_TOPIC_CONSUMER_GROUPS;
    readonly _consumerName: string;

    constructor(serviceName: typeof this._serviceName) {
        this._serviceName = serviceName.toUpperCase() as keyof typeof DEPLOYMENT_TOPIC_CONSUMER_GROUPS  ;
        this._consumerName = `${serviceName}-consumer`;
        this._redisClient = GetRedisClient();
    }

    async readNewMessages(cb: (message: DeploymentEvent<keyof typeof $DeploymentEvent>,ackMessage:()=>Promise<void>) => Promise<boolean>) {
        const groupName = DEPLOYMENT_TOPIC_CONSUMER_GROUPS[this._serviceName];
        const streamName = TOPICS.DEPLOYMENT_TOPIC;
         while (true) {
              try {
                const messages = await this._redisClient.xreadgroup(
                  "GROUP", groupName, this._consumerName,
                  "COUNT", 100,
                  "BLOCK", 0,
                  "STREAMS", streamName, ">"
                );
        
                if (messages) {
                  const [_, records] = messages[0] as [string, Array<[string, string[]]>];
                  for (const [id, fields] of records) {
                    const event = createObject<DeploymentEvent<keyof typeof $DeploymentEvent>>(fields);
                    const willAck = await cb(event, this.ackMessage.bind(this, id));
                    if(!willAck) await this.ackMessage(id);
                  }
                }
              } catch (e: any) {
                logger.error(
                  `UNEXPECTED_ERROR_OCCURED_WHILE_READING_NEW_MESSAGES_ON_${TOPICS.DEPLOYMENT_TOPIC}_IN_${this._serviceName} ${JSON.stringify(e, null, 2)}`
                );
              }
            }
    }
    async readUnackedMessages(cb: (message: DeploymentEvent<keyof typeof $DeploymentEvent>,ackMessage:()=>Promise<void>) => Promise<boolean>) {
        const groupName = DEPLOYMENT_TOPIC_CONSUMER_GROUPS[this._serviceName];
        const streamName = TOPICS.DEPLOYMENT_TOPIC;
        let crrId = "0-0";
            try {
              while (true) {
                const [nextId, messages] = await this._redisClient.xautoclaim(
                  streamName, groupName, this._consumerName, 0, crrId, "COUNT", 100
                ) as [string, Array<[string, string[]]>];
              
                crrId = nextId;
                for (const [id, fields] of messages) {
                  const event = createObject<DeploymentEvent<keyof typeof $DeploymentEvent>>(fields);
                  const willAck = await cb(event, this.ackMessage.bind(this,id));
                  if(!willAck) await this.ackMessage(id);
                }
        
                 if(nextId=="0-0")
                  break;
                }
              return true;
            } catch (e: any) {
              logger.error(
                `UNEXPECTED_ERROR_OCCURED_WHILE_READING_UNACKED_MESSAGES_ON_${TOPICS.DEPLOYMENT_TOPIC}_IN_${this._serviceName}: ${JSON.stringify(e, null, 2)}`
              );
            }
    }

    private async ackMessage(messageId: string) {
        const groupName = DEPLOYMENT_TOPIC_CONSUMER_GROUPS[this._serviceName];
        const streamName = TOPICS.DEPLOYMENT_TOPIC;
        await this._redisClient.xack(streamName, groupName, messageId);
    }

    async initializeConsumerGroup() {
        try {
            const streamName = TOPICS.DEPLOYMENT_TOPIC;
            const groupName = DEPLOYMENT_TOPIC_CONSUMER_GROUPS[this._serviceName];
            await this._redisClient.xgroup("CREATE", streamName, groupName, "$", "MKSTREAM");
            return this;
        } catch (e: any) {
            if (e.message.includes("BUSYGROUP")) {
                return this;
            } else throw e;
        }
    }
}