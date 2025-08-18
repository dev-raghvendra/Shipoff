import { Redis } from "ioredis";
import { PROJECT_TOPIC_CONSUMER_GROUPS, TOPICS } from "../config/config";
import { GetRedisClient } from "../redis-client/client";
import logger from "../../services-commons/libs/winston";
import { $ProjectEvent, ProjectEvent } from "../types";
import { createObject } from "../../services-commons";

export class ProjectConsumer {
  private _redisClient: Redis;
  private _serviceName: keyof typeof PROJECT_TOPIC_CONSUMER_GROUPS;
  private _consumerName: string;

  constructor(serviceName: keyof typeof PROJECT_TOPIC_CONSUMER_GROUPS) {
    this._redisClient = GetRedisClient();
    this._serviceName = serviceName;
    this._consumerName = `${serviceName}-consumer`;
  }

  async readNewMessages(cb: (message: ProjectEvent<keyof typeof $ProjectEvent>) => Promise<void>) {
    const groupName = PROJECT_TOPIC_CONSUMER_GROUPS[this._serviceName];
    const streamName = TOPICS.PROJECT_TOPIC;

    while (true) {
      try {
        const messages = await this._redisClient.xreadgroup(
          "GROUP", groupName, this._consumerName,
          "COUNT", 1,
          "BLOCK", 0,
          "STREAMS", streamName, ">"
        );

        if (messages) {
          const [_, records] = messages[0] as [string, Array<[string, string[]]>];
          for (const [id, fields] of records) {
            const event = createObject<ProjectEvent<keyof typeof $ProjectEvent>>(fields);
            await cb(event);
            await this.ackMessage(id);
          }
        }
      } catch (e: any) {
        logger.error(
          `UNEXPECTED_ERROR_OCCURED_WHILE_READING_NEW_MESSAGES_ON_${TOPICS.PROJECT_TOPIC}_IN_${this._serviceName} ${JSON.stringify(e, null, 2)}`
        );
      }
    }
  }

  async readUnackedMessages(cb: (message: ProjectEvent<keyof typeof $ProjectEvent>) => Promise<void>) {
    const groupName = PROJECT_TOPIC_CONSUMER_GROUPS[this._serviceName];
    const streamName = TOPICS.PROJECT_TOPIC;
    let crrId = "0-0";
    try {
      while (true) {
        const [nextId, messages] = await this._redisClient.xautoclaim(
          streamName, groupName, this._consumerName, 0, crrId, "COUNT", 100
        ) as [string, Array<[string, string[]]>];
      
        crrId = nextId;
        for (const [id, fields] of messages) {
          const event = createObject<ProjectEvent<keyof typeof $ProjectEvent>>(fields);
          await cb(event);
          await this.ackMessage(id);
        }

        if(nextId=="0-0")
          break;
      }
      return true;
    } catch (e: any) {
      logger.error(
        `UNEXPECTED_ERROR_OCCURED_WHILE_READING_UNACKED_MESSAGES_ON_${TOPICS.PROJECT_TOPIC}_IN_${this._serviceName}: ${JSON.stringify(e, null, 2)}`
      );
    }
  }

  private async ackMessage(messageId: string) {
    const groupName = PROJECT_TOPIC_CONSUMER_GROUPS[this._serviceName];
    const streamName = TOPICS.PROJECT_TOPIC;
    await this._redisClient.xack(streamName, groupName, messageId);
  }

  async initializeConsumerGroup() {
    try {
      const streamName = TOPICS.PROJECT_TOPIC;
      const groupName = PROJECT_TOPIC_CONSUMER_GROUPS[this._serviceName];
      await this._redisClient.xgroup("CREATE", streamName, groupName, "$", "MKSTREAM");
      return this;
    } catch (e: any) {
      if (e.message.includes("BUSYGROUP")) {
        return this;
      } else {
        throw e;
      }
    }
  }
}
