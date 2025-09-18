import { Database, dbService } from "@/db/db-service";
import { K8Service } from "@/services/k8.service";
import { $DeploymentEvent, DeploymentConsumer as Consumer, DeploymentEvent } from "@shipoff/redis";
import { DEPLOYMENT_TOPIC_CONSUMER_GROUPS } from "@shipoff/redis/config/config";
import { logger } from "@shipoff/services-commons";


type IDeploymentConsumer =  {
   [key in keyof typeof $DeploymentEvent]: (event: DeploymentEvent<keyof typeof $DeploymentEvent>) => Promise<boolean>;
}

export class DeploymentConsumer implements IDeploymentConsumer {
    private _consumer: Consumer;
    private _k8Service: K8Service;
    private _dbService : Database
    private _readCount = 0;
    private _eventQueue: {
        event: DeploymentEvent<keyof typeof $DeploymentEvent>;
        ackMessage: () => Promise<void>;
    }[];
    constructor(serviceName: keyof typeof DEPLOYMENT_TOPIC_CONSUMER_GROUPS) {
        this._consumer = new Consumer(serviceName);
        this._eventQueue = [];
        this._k8Service = new K8Service();
        this._dbService = dbService;
    }

    async addEventsInLocalQueue(event:DeploymentEvent<keyof typeof $DeploymentEvent>,ackMessage:()=>Promise<void>){
        console.log("NEW EVENT RECEIVED",event);
        const staleFound = await this._filterStaleDuplicateEventsInQueue(event,ackMessage);
        if(!staleFound) {
            this._eventQueue.push({event,ackMessage});
        }
        this._readCount++;
        return true;
    }

    async startConsumer(){
        await this._consumer.initializeConsumerGroup();
        await this._consumer.readUnackedMessages(this.addEventsInLocalQueue.bind(this))
        this._consumer.readNewMessages(this.addEventsInLocalQueue.bind(this)).then(()=>{
           logger.info(`STOPPED_READING_NEW_MESSAGES_FROM_DEPLOYMENT_TOPIC_IN_DEPLOYMENT_CONSUMER_AT_${this._consumer._serviceName}`)
        })
        await this.processEvents();
    }
    
    async processEvents(){
        while(true){
          if(this._eventQueue.length && this._readCount){
             const evt = this._eventQueue.shift();
             let res;
             switch(evt?.event.event){
                case "CREATED":
                 res = await this.CREATED(evt.event);
                 break;
                case "DELETED":
                 res = await this.DELETED(evt.event);
                 break;
                default:
                 logger.error(`UNKNOWN_EVENT_TYPE_${evt?.event.event}_FOR_PROJECT_ID_${evt?.event.projectId}_IN_DEPLOYMENT_TOPIC_IN_DEPLOYMENT_CONSUMER_AT_${this._consumer._serviceName}`);
                 break;
             }
             if(res) return await evt?.ackMessage();
             logger.error(`UNEXPECTED_ERROR_OCCURED_WHILE_PROCESSING_EVENT_TYPE_${evt?.event.event}_FOR_PROJECT_ID_${evt?.event.projectId}_IN_DEPLOYMENT_CONSUMER_AT_${this._consumer._serviceName}`);
          }
        }
    }

    removeProjectEventsFromQueue(projectId:string){
        this._eventQueue = this._eventQueue.filter(e=>e.event.projectId !== projectId);
        return true;
    }

    CREATED = async(event:DeploymentEvent<keyof typeof $DeploymentEvent>)=>{
        let res ;
        if(event.projectType==="STATIC"){
           res = await this._k8Service.createFreeTierStaticDeployment({
               projectId:event.projectId,
               deploymentId:event.deploymentId,
               commitHash:event.commitHash
            })
        }
        else {
           res = await this._k8Service.createFreeTierDynamicDeployment({
                projectId:event.projectId,
                deploymentId:event.deploymentId,
                commitHash:event.commitHash
            })
        }
        return res === undefined
    }

    DELETED = async(event:DeploymentEvent<keyof typeof $DeploymentEvent>)=>{
        let res ;
        if(event.projectType==="STATIC"){
            if(res) await this._dbService.deleteManyContainer({deploymentId:event.deploymentId})
        }
        else {
            if(res) await this._dbService.deleteManyContainer({deploymentId:event.deploymentId})
        }
        return res === undefined;
    }

    private async _filterStaleDuplicateEventsInQueue(event:DeploymentEvent<keyof typeof $DeploymentEvent>,ackMessage:()=>Promise<void>){
        for(let i=0;i<this._eventQueue.length;i++){
            if(this._eventQueue[i].event.projectId === event.projectId && this._eventQueue[i].event.event === event.event){
                const fn = this._eventQueue[i].ackMessage;
                this._eventQueue[i]={event,ackMessage};
                await fn();
                return true;
            }
        }
    }

}


