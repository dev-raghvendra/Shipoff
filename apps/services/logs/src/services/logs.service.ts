import { GetLogsRequestBodyType, IPutLogRequestBodyType, logBody, StreamLogsRequestBodyType } from "@/types/Logs";
import { BucketService } from "@/services/bucket.service";
import { logger } from "@/libs/winston";
import { createGrpcErrorHandler, GrpcAppError, GrpcResponse } from "@shipoff/services-commons";
import { AuthExternalService } from "@/externals/auth.external.service";
import EventEmitter from "events";
import { LogBody, StreamLogsRequest } from "@shipoff/proto/generated/logs";
import { ServerWritableStream, status } from "@grpc/grpc-js";

const LOG_EVENTS = {
    NEW_LOGS:"NEW_LOGS"
} as const
export class LogsService {
    private _logs:Map<string,{logBatch:logBody[]}>
    private _bucketService:BucketService
    private _errHandler:ReturnType<typeof createGrpcErrorHandler>
    private _permissionsService:AuthExternalService
    private _newLogsEvent : NodeJS.EventEmitter

    constructor(){
        this._logs = new Map()
        this._bucketService = new BucketService()
        this._errHandler = createGrpcErrorHandler({subServiceName:'LOGS_SERVICE',logger})
        this._permissionsService = new AuthExternalService()
        this._newLogsEvent = new EventEmitter()
        setInterval(() => this._pushLogsToBucket(), 10000)
    }

    async IPutLogs({logs}:IPutLogRequestBodyType){
      try {
           logs.forEach(log=>{
              const {envId,...newLog} = log
              const logBatch = this._logs.get(envId);
              if(logBatch){
                 logBatch.logBatch.push(newLog)
              }
           })
           this._newLogsEvent.emit(LOG_EVENTS.NEW_LOGS)
           return GrpcResponse.OK({},"LOGS_QUEUED_SUCCESSFULLY")
      } catch (e:any) {
         return this._errHandler(e,"I-PUT-LOGS","N/A")
      }
    }

    async getLogs({lastBatchId,authUserData,projectId,reqMeta:{requestId},environmentId}:GetLogsRequestBodyType){
       try {
           await this._permissionsService.getPermissions({
                authUserData,
                permissions:["READ"],
                scope:"DEPLOYMENT",
                resourceId:projectId,
                errMsg:"You do not have permission to access logs for this project"
           })
           const key = await this._bucketService.getNextLogKey(environmentId,lastBatchId)
            if(!key) return GrpcResponse.OK([],"NO_LOGS_FOUND")
            const logs = await this._bucketService.getLogs(key)
            const res = await logs.Body?.transformToString()
            return GrpcResponse.OK(res,"LOGS_FETCHED_SUCCESSFULLY")
       } catch (e:any) {
          return this._errHandler(e,"GET-LOGS", requestId)
       }
    }


    async streamLogs(call:ServerWritableStream<StreamLogsRequest & {body:StreamLogsRequestBodyType},LogBody>){
        const callStatus = {cancelled:false};
        const writeLogHandler = this._writeLogsToStream.bind(this,call,callStatus)
        call.on('cancelled', () => {
            callStatus.cancelled = true;
            this._newLogsEvent.off(LOG_EVENTS.NEW_LOGS,writeLogHandler)
        });
        call.on('error', () => {
            callStatus.cancelled = true;
            this._newLogsEvent.off(LOG_EVENTS.NEW_LOGS,writeLogHandler)
    })
        const body = call.request.body
        try {
            if(callStatus.cancelled) return
            const deploymentId = this._extractDeploymentIdFromEnvId(body.environmentId);
            await this._permissionsService.getPermissions({
                authUserData: body.authUserData,
                permissions:["READ"],
                scope:"DEPLOYMENT",
                resourceId:deploymentId,
                errMsg:"You do not have permission to stream logs for this deployment"
            })
            writeLogHandler()
            this._newLogsEvent.on(LOG_EVENTS.NEW_LOGS,writeLogHandler)
        } catch (e:any) {
           return this._errHandler(e,"STREAM-LOGS",body.reqMeta.requestId)
        }
    }

    private async _pushLogsToBucket(){
        try {
            if(!this._logs.size) return
            const entries = this._logs.entries()
            this._logs.clear()
            Promise.all(entries.map(logBatch=>{
                this._bucketService.pushLogs(logBatch[1].logBatch,logBatch[0])
            }))
        } catch (e:any) {
            logger.error(`AN_UNEXPECTED_ERROR_OCCURED_IN_LOGS_SERVICE_AT_PUSH-LOGS-TO-BUCKET ${JSON.stringify(e,null,2)}`)
        }
    }

    private _writeLogsToStream(call:ServerWritableStream<StreamLogsRequest & {body:StreamLogsRequestBodyType},LogBody>,callStatus:{cancelled:boolean}){
        try {
           const logs = this._logs.get(call.request.body.environmentId)
           logs?.logBatch.forEach(log=>{
               const logBody = LogBody.fromObject(log);
               if(callStatus.cancelled) return
               call.write(logBody)
           })
        } catch (e:any) {
           logger.error(`[rid:${call.request.body.reqMeta.requestId}]:UNEXPECTED_ERROR_OCCURED_IN_LOGS_SERVICE_AT_WRITE-LOGS-TO-STREAM ${JSON.stringify(e,null,2)}`)
        }
    }

    private _extractDeploymentIdFromEnvId(envId:string){
        const regex = /(?:build-|run-)(dep-[\w-]+)/;
        const deploymentId = envId.match(regex)?.[1];
        if(!deploymentId) throw new GrpcAppError(status.INVALID_ARGUMENT,"Invalid build or runtime environment id")
        return deploymentId;
    }
}