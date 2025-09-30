import { dbService } from "@/db/db-service";
import { $ProjectEvent, ProjectConsumer as Consumer } from "@shipoff/redis";
import {logger} from "@/libs/winston";
import { createSyncErrHandler } from "@shipoff/services-commons";


type IProjectConsumer =  {
   [key in keyof typeof $ProjectEvent]: (projectId: string, userId: string, requestId: string) => Promise<void>;
}

export class ProjectConsumer implements IProjectConsumer {
   private _consumer: Consumer;
   private _errHandler:ReturnType<typeof createSyncErrHandler>;
   constructor(){
    this._consumer = new Consumer("AUTH_SERVICE");
      this._errHandler = createSyncErrHandler({subServiceName:"PROJECT_CONSUMER",logger});
   }

   
    CREATED = async (projectId:string,userId:string,requestId:string)=>{
      try {
         await dbService.createProjectMember({
            projectId,
            userId,
            role: "PROJECT_OWNER",
         });
      } catch (e: any) {
         this._errHandler(e,"CREATED_EVENT_PROCESSING",requestId);
      }
   }

   DELETED = async (projectId:string,userId:string,requestId:string)=>{
      try {
         await dbService.deleteProjectMember({
            userId_projectId: {
               projectId,
               userId,
            },
         });
      } catch (e: any) {
         this._errHandler(e,"DELETED_EVENT_PROCESSING",requestId);
      }
   }

   async startProjectConsumer(){
    await this._consumer.initializeConsumerGroup();
    await this._consumer.readUnackedMessages(async({projectId,userId,event,requestId})=>{
         await this[event](projectId,userId,requestId);
    })

    this._consumer.readNewMessages(async({projectId,event,userId,requestId})=>{
          await this[event](projectId,userId,requestId);
    })
   }

}



