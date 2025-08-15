import Redis from "ioredis";
import { GetRedisClient } from "../redis-client/client";
import { CONTAINER_TOPIC_CONSUMER_GROUPS, TOPICS } from "../config/config";

export class ContainerConsumer {
  private _redisClient: Redis;
  private _serviceName:keyof typeof CONTAINER_TOPIC_CONSUMER_GROUPS;
  private _consumerName:string;
   constructor(serviceName:string){
    this._serviceName = serviceName.toUpperCase() as keyof typeof CONTAINER_TOPIC_CONSUMER_GROUPS;
    this._consumerName = `${serviceName}-${process.pid}`;
    this._redisClient = GetRedisClient();
  }
  


  async readNewMessages(cb:(message:any)=>Promise<void>){
      const groupName = CONTAINER_TOPIC_CONSUMER_GROUPS[this._serviceName];
      const streamName = TOPICS.CONTAINER_TOPIC;
      while(true){
         const messages = await this._redisClient.xreadgroup("GROUP", groupName, this._consumerName, "COUNT", 1, "BLOCK", 0, "STREAMS", streamName, ">");
         if(messages.length){
            await cb(messages[0])
            await this.ackMessage((messages[0] as string[])[0]);
         }
      }
  }

  async readUnackedMessages(cb:(message:any)=>Promise<void>){
      const groupName = CONTAINER_TOPIC_CONSUMER_GROUPS[this._serviceName];
      const streamName = TOPICS.CONTAINER_TOPIC;
      const unackedMessages = await this._redisClient.xautoclaim(streamName, groupName, this._consumerName, 0, "0-0","COUNT", 100);
      for (const message of unackedMessages) {
          await cb(message);
          await this.ackMessage((message as string[])[0])
      }
  }

  private async ackMessage(messageId:string){
      const groupName = CONTAINER_TOPIC_CONSUMER_GROUPS[this._serviceName];
      const streamName = TOPICS.CONTAINER_TOPIC;
      await this._redisClient.xack(streamName, groupName, messageId);
  }

  async initializeConsumerGroup(){
      try {
         const streamName = TOPICS.CONTAINER_TOPIC;
         const groupName = CONTAINER_TOPIC_CONSUMER_GROUPS[this._serviceName];
         await this._redisClient.xgroup("CREATE", streamName, groupName, "$", "MKSTREAM");
         return this;
      } catch (e:any) {
         if(e.message.includes("BUSYGROUP")){
          return this;
         }
         else throw e;
      }
  }
}




