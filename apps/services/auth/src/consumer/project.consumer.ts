import { dbService } from "@/db/db-service";
import { $ProjectEvent, ProjectConsumer as Consumer } from "@shipoff/redis";
import { logger } from "@shipoff/services-commons/libs/winston";



type IProjectConsumer =  {
   [key in keyof typeof $ProjectEvent]: (projectId: string, userId: string) => Promise<void>;
}

export class ProjectConsumer implements IProjectConsumer {
   private _consumer: Consumer;
   constructor(){
    this._consumer = new Consumer("AUTH_SERVICE");
   }

   
    CREATED = async (projectId:string,userId:string)=>{
      try {
         await dbService.createProjectMember({
            projectId,
            userId,
            role: "PROJECT_OWNER",
         });
      } catch (e: any) {
         logger.error(
            `ERR_PROCESSING_CREATED_EVENT_FOR_PROJECT_ID_${projectId}_USER_ID_${userId}_IN_AUTH_SERVICE: ${JSON.stringify(e, null, 2)}`
         );
      }
   }

   DELETED = async (projectId:string,userId:string)=>{
      try {
         await dbService.deleteProjectMember({
            userId_projectId: {
               projectId,
               userId,
            },
         });
      } catch (e: any) {
         logger.error(
            `ERR_PROCESSING_DELETED_EVENT_FOR_PROJECT_ID_${projectId}_USER_ID_${userId}_IN_AUTH_SERVICE: ${JSON.stringify(e, null, 2)}`
         );
      }
   }

   async startProjectConsumer(){
    await this._consumer.initializeConsumerGroup();
    await this._consumer.readUnackedMessages(async({projectId,userId,event})=>{
         await this[event](projectId,userId);
    })

    this._consumer.readNewMessages(async({projectId,event,userId})=>{
          await this[event](projectId,userId);
    })
   }

}



