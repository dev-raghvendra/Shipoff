import { GetLogsRequestBodyType, IPutLogRequestBodyType, logBody, StreamLogsRequestBodyType } from "@/types/Logs";
import { BucketService } from "@/services/bucket.service";
import { logger } from "@/libs/winston";
import { createGrpcErrorHandler, createSyncErrHandler, generateId, GrpcAppError, GrpcResponse } from "@shipoff/services-commons";
import { AuthExternalService } from "@/externals/auth.external.service";
import EventEmitter from "events";
import { LogBody, StreamLogsRequest } from "@shipoff/proto/generated/logs";
import { ServerWritableStream, status } from "@grpc/grpc-js";
import { ProjectsExternalService } from "@/externals/projects.external.service";

const LOG_EVENTS = {
    NEW_LOGS:"NEW_LOGS"
} as const
export class LogsService {
    private _logs:Record<string,logBody[]>
    private _bucketService:BucketService
    private _errHandler:ReturnType<typeof createGrpcErrorHandler>
    private _syncErrHandler:ReturnType<typeof createSyncErrHandler>
    private _permissionsService:AuthExternalService
    private _projectsService:ProjectsExternalService
    private _newLogsEvent : NodeJS.EventEmitter

    constructor(){
        this._logs = {}
        this._bucketService = new BucketService()
        this._errHandler = createGrpcErrorHandler({subServiceName:'LOGS_SERVICE',logger})
        this._syncErrHandler = createSyncErrHandler({subServiceName:'LOGS_SERVICE',logger})
        this._permissionsService = new AuthExternalService()
        this._projectsService = new ProjectsExternalService()
        this._newLogsEvent = new EventEmitter()
        setInterval(async() => await this._pushLogsToBucket(), 10000)
        setInterval(async() => await this._performPeriodicCleanup(), 3600000) 
    }

    async IPutLogs({logs}:IPutLogRequestBodyType){
      try {
           logs.forEach(log=>{
              const {envId,...newLog} = log
              const logBatch = this._logs[envId];
              if(logBatch) logBatch.push(newLog)
              else this._logs[envId] = [newLog];
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
                errMsg:"You do not have permission to access logs for this project",
                reqMeta:{requestId}
           })
            const key = await this._bucketService.getNextLogKey(environmentId,lastBatchId)
            const logs = await this._bucketService.getLogs(key)
            const res = await logs.Body?.transformToString()
            return GrpcResponse.OK({lastBatchId:key,logs:res},"LOGS_FETCHED_SUCCESSFULLY")
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
            try {call.end()}catch{}
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
                resourceId:body.projectId,
                errMsg:"You do not have permission to stream logs for this deployment",
                reqMeta:body.reqMeta
            })
            writeLogHandler()
            this._newLogsEvent.on(LOG_EVENTS.NEW_LOGS,writeLogHandler)
        } catch (e:any) {
           return this._errHandler(e,"STREAM-LOGS",body.reqMeta.requestId)
        }
    }

    private async _pushLogsToBucket(){
        try {
            const entries = Object.entries(this._logs)
            this._logs = {}
            if(!entries.length) return
            await Promise.all(entries.map(logBatch=>{
                return this._bucketService.pushLogs(logBatch[1],logBatch[0])
            }))
        } catch (e:any) {
            this._syncErrHandler(e,"PUSH-LOGS-TO-BUCKET","N/A")
        }
    }

    private _writeLogsToStream(call:ServerWritableStream<StreamLogsRequest & {body:StreamLogsRequestBodyType},LogBody>,callStatus:{cancelled:boolean}){
        try {
           const logs = this._logs[call.request.body.environmentId];
           logs?.forEach(log=>{
               const logBody = LogBody.fromObject(log);
               if(callStatus.cancelled) return
               call.write(logBody)
           })
        } catch (e:any) {
           this._syncErrHandler(e,"WRITE-LOGS-TO-STREAM",call.request.body.reqMeta.requestId)
        }
    }

    private _extractDeploymentIdFromEnvId(envId:string){
        const regex = /(?:run|build)-(dep-[a-f0-9-]+)(?=-\d+$)/;
        const deploymentId = envId.match(regex)?.[1];
        if(!deploymentId) throw new GrpcAppError(status.INVALID_ARGUMENT,"Invalid build or runtime environment id")
        return deploymentId;
    }

   private async _performPeriodicCleanup(){
       const rid = generateId("RID",{RID:"rid"})
        try {
            const staleEnvIds = await this._projectsService.getStaleEnvironmentIds({reqMeta:{requestId:rid}})
            const keys:string[] = []
            staleEnvIds.forEach(async envId=>{
                let continuationToken: string | undefined = undefined;
                 do {
                    const res = await this._bucketService.getAllLogKeys(envId, continuationToken) 
                    res.Contents?.forEach(obj => {
                        if (obj.Key) keys.push(obj.Key);
                    });
                    continuationToken = res.IsTruncated ? res.NextContinuationToken : undefined;
                 } while (continuationToken)
            })
            for (let i = 0; i < keys.length; i += 1000) {
                const batch = keys.slice(i, i + 1000);
                await this._bucketService.deleteLogs(batch);
            }
            logger.info(`Periodic cleanup completed. Deleted ${keys.length} log files for ${staleEnvIds.length} stale environments`)
        } catch (e:any) {
            this._syncErrHandler(e,"PERIODIC_CLEANUP_IN_LOGS_SERVICE",rid)
        }
   }
}