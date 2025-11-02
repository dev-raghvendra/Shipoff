import { Database, dbService } from "@/db/db-service";
import { K8Service, K8ServiceClient } from "@/services/k8.service";
import { $DeploymentEvent, DeploymentConsumer as Consumer, DeploymentEvent } from "@shipoff/redis";
import { DEPLOYMENT_TOPIC_CONSUMER_GROUPS } from "@shipoff/redis/config/config";
import { logger } from "@/libs/winston";
import { ContainerProducer } from "@/producer/container.producer";
import { ProjectExternalService } from "@/externals/project.external.service";
import { createSyncErrHandler } from "@shipoff/services-commons";
import { NodeMetricesServiceClient } from "@/services/node-metrices.service";


type IDeploymentConsumer =  {
   [key in keyof typeof $DeploymentEvent]: (event: DeploymentEvent<keyof typeof $DeploymentEvent>) => Promise<boolean>;
}

export class DeploymentConsumer implements IDeploymentConsumer {
    private _consumer: Consumer;
    private _k8ServiceClient: K8Service;
    private _dbService : Database
    private _producer : ContainerProducer
    private _readCount = 0;
    private _projectService:ProjectExternalService
    private _errHandler: ReturnType<typeof createSyncErrHandler>
    private readonly allowedEvents = ["CREATED","DELETED","REQUESTED"];
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
        this._projectService = new ProjectExternalService();
        this._errHandler = createSyncErrHandler({subServiceName:"DEPLOYMENT_CONSUMER",logger});
    }

    async addEventsInLocalQueue(event:DeploymentEvent<keyof typeof $DeploymentEvent>,ackMessage:()=>Promise<void>){
        const staleFound = await this._filterStaleDuplicateEventsInQueue(event,ackMessage);
        const sameProjectDifferentEventFound = await this._filterSameProjectDifferentEventsInQueue(event,ackMessage);
        if(!staleFound && !sameProjectDifferentEventFound) {
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
        const maxBackoffTime = 10000;
        while(true){
          if(this._eventQueue.length && this._readCount){
             backoffTime = 1000;
             const evt = this._eventQueue.shift();
             if(!evt) continue;
             if(!this.allowedEvents.includes(evt.event.event)){
               this._errHandler({},"PROCCESSING_EVENT",evt.event.requestId,`WHILE_PROCESSING_UNSUPPORTED_EVENT_TYPE_${evt.event.event}_FOR_PROJECT_ID_${evt.event.projectId}_IN_DEPLOYMENT_CONSUMER_AT_${this._consumer._serviceName}`);
               continue;
             }
             if(evt.event.event === "CREATED" || evt.event.event === "REQUESTED"){
                const usage = await NodeMetricesServiceClient.checkMemoryUsage()
                if(usage && usage >= 90){
                    this._errHandler({},"PROCCESSING_EVENT",evt.event.requestId,`HIGH_NODE_MEMORY_USAGE_${usage}_PERCENT_WHILE_PROCESSING_EVENT_TYPE_${evt.event.event}_FOR_PROJECT_ID_${evt.event.projectId}_IN_DEPLOYMENT_CONSUMER_AT_${this._consumer._serviceName}`);
                    this._producer.publishContainerEvent({
                        event:"FAILED",
                        projectId:evt.event.projectId,
                        deploymentId:evt.event.deploymentId,
                        containerId:"N/A",
                        requestId:evt.event.requestId,
                        runtimeId:"N/A",
                        builId:"N/A",
                        projectType:evt.event.projectType
                    });
                }
             }
             const res = await this[evt.event.event](evt.event)
             if(res) {await evt.ackMessage();continue}
             this._errHandler({},"PROCCESSING_EVENT",evt.event.requestId,`WHILE_PROCESSING_EVENT_TYPE_${evt.event.event}_FOR_PROJECT_ID_${evt.event.projectId}_IN_DEPLOYMENT_CONSUMER_AT_${this._consumer._serviceName}`);
             this._producer.publishContainerEvent({
                event:"FAILED",
                projectId:evt.event.projectId,
                deploymentId:evt.event.deploymentId,
                containerId:"N/A",
                requestId:evt.event.requestId,
                runtimeId:"N/A",
                builId:"N/A",
                projectType:evt.event.projectType
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

    private async _filterSameProjectDifferentEventsInQueue(event:DeploymentEvent<keyof typeof $DeploymentEvent>,ackMessage:()=>Promise<void>){
        for(let i=0;i<this._eventQueue.length;i++){
            if(this._eventQueue[i].event.projectId === event.projectId){
                if(event.event === "CREATED"){
                    const fn = this._eventQueue[i].ackMessage;
                    this._eventQueue[i]={event,ackMessage};
                    await fn();
                }
                else await ackMessage()
                return true
            }
        }
    }


    REQUESTED = async(event:DeploymentEvent<keyof typeof $DeploymentEvent>)=>{
        let res;
        const project = await this._projectService.getProjectById(event.projectId,event.requestId)
        if(!project.deployments.length){
             this._errHandler({},"PROCCESSING_'REQUESTED'_EVENT",event.requestId,`NO_DEPLOYMENTS_FOUND_FOR_PROJECT_ID_${event.projectId}_IN_DEPLOYMENT_CONSUMER_AT_${this._consumer._serviceName}`);
             return false
        }
        res = await this._k8ServiceClient.tryCreatingFreeTierDeployment({
            projectId:event.projectId,
            deploymentId:project.deployments[0].deploymentId,
            commitHash:project.deployments[0].commitHash,
            projectType:project.framework.applicationType as "STATIC" | "DYNAMIC",
            requestId:event.requestId
        })
        return res ? true : false;
    }
}


