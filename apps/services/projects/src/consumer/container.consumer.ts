import { dbService } from "@/db/db-service";
import { status } from "@grpc/grpc-js";
import { DeploymentStatus } from "@prisma/index";
import { $ContainerEvent, ContainerEvent , ContainerConsumer as Consumer} from "@shipoff/redis";
import { CONTAINER_TOPIC_CONSUMER_GROUPS } from "@shipoff/redis/config/config";
import { createSyncErrHandler, GrpcAppError } from "@shipoff/services-commons";
import {logger} from "@/libs/winston"



export class ContainerConsumer {
    private _consumer:Consumer;
    private _eventToStatusMap : Record<keyof typeof $ContainerEvent,  DeploymentStatus> = {
        "PRODUCTION":DeploymentStatus.PRODUCTION,
        "RUNNING":DeploymentStatus.BUILDING,
        "PROVISIONING":DeploymentStatus.PROVISIONING,
        "FAILED":DeploymentStatus.FAILED,
        "TERMINATED":DeploymentStatus.INACTIVE
    }
    private _errHandler:ReturnType<typeof createSyncErrHandler>
    constructor(serviceName:keyof typeof CONTAINER_TOPIC_CONSUMER_GROUPS){
        this._consumer = new Consumer(serviceName);
        this._errHandler = createSyncErrHandler({subServiceName:"CONTAINER_CONSUMER",logger});
    }


    async processEvents(event:ContainerEvent<keyof typeof $ContainerEvent>,ackMessage:()=>Promise<void>){
        const eventStatus = this._eventToStatusMap[event.event];
        try {
           if(!eventStatus) throw new GrpcAppError(status.INTERNAL,`UNKNOWN_EVENT_TYPE_${event.event}_FOR_DEPLOYMENT_ID_${event.deploymentId}_IN_CONTAINER_TOPIC_IN_CONTAINER_CONSUMER_AT_${this._consumer._serviceName}`);
           await dbService.updateDeploymentById(event.deploymentId,{
            status:eventStatus
           })
           await ackMessage();
        } catch (e:any) {
            return this._errHandler(e,`UNEXPECTED_ERROR_OCCURED_WHILE_PROCESSING_EVENT_FOR_DEPLOYMENT_ID_${event.deploymentId}_IN_CONTAINER_TOPIC_IN_CONTAINER_CONSUMER_AT_${this._consumer._serviceName}`,event.requestId);
        }
    }

    async startConsumer(){
        await this._consumer.initializeConsumerGroup();
        await this._consumer.readUnackedMessages(this.processEvents.bind(this))
        this._consumer.readNewMessages(this.processEvents.bind(this))
    }
}