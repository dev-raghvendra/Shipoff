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
           //When a deployment enters PRODUCTION, we must explicitly mark the previous PRODUCTION deployment as INACTIVE. 
           //Reason: static project containers exit immediately after sending PRODUCTION event, so they never emit a TERMINATED event. 
           //Without this step, multiple deployments could incorrectly remain in PRODUCTION state.

           await dbService.startTransaction(async (tx)=>{
              if(eventStatus === "PROVISIONING"){
                await tx.buildEnvironment.updateMany({
                    where:{deploymentId:event.deploymentId},
                    data:{active:false}
                })
                await tx.buildEnvironment.create({
                    data:{
                       buildId:event.builId,
                       deploymentId:event.deploymentId
                    }
                })
              }
              else if(eventStatus === "PRODUCTION" && event.projectType === "DYNAMIC"){
                await tx.runtimeEnvironment.updateMany({
                    where:{deploymentId:event.deploymentId},
                    data:{active:false}
                })
                await tx.runtimeEnvironment.create({
                    data:{
                       runtimeId:event.runtimeId,
                       deploymentId:event.deploymentId
                    }
                })
              }
              await tx.deployment.update({
                where:{
                    deploymentId:event.deploymentId
                },
                data:{
                    status:eventStatus,
                    ...(eventStatus === "PRODUCTION" ? { completedAt:new Date() } : {}),
                    ...(eventStatus === "FAILED" ? { completedAt:new Date() } : {})
                }
              })
              if(["INACTIVE","FAILED"].includes(eventStatus)) return;
              await tx.deployment.updateMany({
                 where:{
                    deploymentId:{not:event.deploymentId},
                    projectId:event.projectId,
                    status:eventStatus
                 },
                 data:{
                    status:DeploymentStatus.INACTIVE,
                    completedAt:new Date()
                 }
              })
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