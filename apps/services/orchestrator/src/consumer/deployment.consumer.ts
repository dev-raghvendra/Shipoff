import { Database, dbService } from "@/db/db-service";
import { K8Service, K8ServiceClient } from "@/services/k8.service";
import { $DeploymentEvent, DeploymentConsumer as Consumer, DeploymentEvent } from "@shipoff/redis";
import { DEPLOYMENT_TOPIC_CONSUMER_GROUPS } from "@shipoff/redis/config/config";
import { logger } from "@/libs/winston";
import { ContainerProducer } from "@/producer/container.producer";


type IDeploymentConsumer =  {
   [key in keyof typeof $DeploymentEvent]: (event: DeploymentEvent<keyof typeof $DeploymentEvent>) => Promise<boolean>;
}

export class DeploymentConsumer implements IDeploymentConsumer {
    private _consumer: Consumer;
    private _k8ServiceClient: K8Service;
    private _dbService : Database
    private _producer : ContainerProducer
    private _readCount = 0;
    private readonly allowedEvents = ["CREATED","DELETED"];
    private _eventQueue: {
        event: DeploymentEvent<keyof typeof $DeploymentEvent>;
        ackMessage: () => Promise<void>;
    }[];
    constructor(serviceName: keyof typeof DEPLOYMENT_TOPIC_CONSUMER_GROUPS) {
        this._consumer = new Consumer(serviceName);
        this._eventQueue = [];
        this._k8ServiceClient = K8ServiceClient;
        this._dbService = dbService;
        this._producer = new ContainerProducer();
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
        const res = await this._k8ServiceClient.initializeK8()
        if(!res) throw new Error("Failed to initialize K8 Service, cannot start deployment consumer");
        await this._consumer.readUnackedMessages(this.addEventsInLocalQueue.bind(this))
        this._consumer.readNewMessages(this.addEventsInLocalQueue.bind(this))
        this.processEvents();
        return true;
    }
    
    async processEvents(){
        let backoffTime = 1000;
        const maxBackoffTime = 60000;
        while(true){
          if(this._eventQueue.length && this._readCount){
             backoffTime = 1000;
             const evt = this._eventQueue.shift();
             if(!evt) continue;
             if(!this.allowedEvents.includes(evt.event.event)){
               logger.error(`[rid:${evt?.event.requestId}]:UNKNOWN_EVENT_TYPE_"${evt.event.event}"_FOR_PROJECT_ID_${evt?.event.projectId}_IN_DEPLOYMENT_TOPIC_IN_DEPLOYMENT_CONSUMER_AT_${this._consumer._serviceName}`);
               continue;
             }
             const res = await this[evt.event.event](evt.event)
             if(res) return await evt.ackMessage();
             else logger.error(`[rid:${evt.event.requestId}]:UNEXPECTED_ERROR_OCCURED_WHILE_PROCESSING_EVENT_TYPE_"${evt.event.event}"_FOR_PROJECT_ID_"${evt.event.projectId}"_IN_DEPLOYMENT_CONSUMER_AT_"${this._consumer._serviceName}"`);
             this._producer.publishContainerEvent({
                event:"FAILED",
                projectId:evt.event.projectId,
                deploymentId:evt.event.deploymentId,
                containerId:"N/A",
                requestId:evt.event.requestId
             })
          }
          else backoffTime = Math.min(backoffTime * 2, maxBackoffTime);
          await new Promise(res=>setTimeout(res,backoffTime));
        }
    }

    removeProjectEventsFromQueue(projectId:string){
        this._eventQueue = this._eventQueue.filter(e=>e.event.projectId !== projectId);
        return true;
    }

    CREATED = async(event:DeploymentEvent<keyof typeof $DeploymentEvent>)=>{
        let res ;
        if(event.projectType==="STATIC"){
           res = await this._k8ServiceClient.createFreeTierStaticDeployment({
               projectId:event.projectId,
               deploymentId:event.deploymentId,
               commitHash:event.commitHash,
               requestId:event.requestId
            })
        }
        else {
           res = await this._k8ServiceClient.createFreeTierDynamicDeployment({
                projectId:event.projectId,
                deploymentId:event.deploymentId,
                commitHash:event.commitHash,
                requestId:event.requestId
            })
        }
        return res ? true : false;
    }

    DELETED = async(event:DeploymentEvent<keyof typeof $DeploymentEvent>)=>{
        let res ;
        if(event.projectType==="STATIC"){
            if(res) await this._dbService.deleteManyK8Deployment({deploymentId:event.deploymentId})
        }
        else {
            if(res) await this._dbService.deleteManyK8Deployment({deploymentId:event.deploymentId})
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


