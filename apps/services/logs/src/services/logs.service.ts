import { ExportLogsRequestBodyType, IPutLogRequestBodyType, StreamLogsRequestBodyType } from "@/types/Logs";
import { BucketService } from "@/services/bucket.service";
import { logger } from "@/libs/winston";
import { createGrpcErrorHandler, createSyncErrHandler, generateId, GrpcAppError, GrpcResponse } from "@shipoff/services-commons";
import { AuthExternalService } from "@/externals/auth.external.service";
import EventEmitter from "events";
import { LogStreamBody, StreamLogsRequest } from "@shipoff/proto/generated/logs";
import { ServerWritableStream, status } from "@grpc/grpc-js";
import { ProjectsExternalService } from "@/externals/projects.external.service";
import { ExtendLogBodyType, LOGS_WS_EVENTS } from "@shipoff/types";

const LOG_EVENTS = {
    NEW_LOGS: "NEW_LOGS"
} as const
export class LogsService {
    private _logs: Record<string, ExtendLogBodyType[]>
    private _bucketService: BucketService
    private _errHandler: ReturnType<typeof createGrpcErrorHandler>
    private _syncErrHandler: ReturnType<typeof createSyncErrHandler>
    private _permissionsService: AuthExternalService
    private _projectsService: ProjectsExternalService
    private _newLogsEvent: NodeJS.EventEmitter

    constructor() {
        this._logs = {}
        this._bucketService = new BucketService()
        this._errHandler = createGrpcErrorHandler({ subServiceName: 'LOGS_SERVICE', logger })
        this._syncErrHandler = createSyncErrHandler({ subServiceName: 'LOGS_SERVICE', logger })
        this._permissionsService = new AuthExternalService()
        this._projectsService = new ProjectsExternalService()
        this._newLogsEvent = new EventEmitter()
        setInterval(async () => await this._pushLogsToBucket(), 10000)
        setInterval(async () => await this._performPeriodicCleanup(), 3600000)
    }

    async IPutLogs({ logs }: IPutLogRequestBodyType) {
        try {
            logs.forEach(log => {
                const { envId, ...rawLog } = log
                const newLog: ExtendLogBodyType = { ...rawLog, envId, logId: generateId("LOG", { LOG: "log" }, 10) }
                const logBatch = this._logs[envId];
                if (logBatch) logBatch.push(newLog)
                else this._logs[envId] = [newLog];
            })
            this._newLogsEvent.emit(LOG_EVENTS.NEW_LOGS)
            return GrpcResponse.OK({}, "LOGS_QUEUED_SUCCESSFULLY")
        } catch (e: any) {
            return this._errHandler(e, "I-PUT-LOGS", "N/A")
        }
    }

    async ExportLogs({ authUserData, reqMeta, projectId, deploymentId }: ExportLogsRequestBodyType) {
        try {
            const deployment = await this._projectsService.getDeploymentDetails({ projectId, deploymentId, authUserData, reqMeta });
            const buildEnvId = deployment.buildEnvironment[0]?.buildId;
            const runtimeEnvId = deployment.runtimeEnvironment[0]?.runtimeId ;
            let buildKeys = buildEnvId ? (await this._bucketService.getAllLogKeys(buildEnvId)).Contents ?? [] : [];
            let runtimeKeys = runtimeEnvId ? (await this._bucketService.getAllLogKeys(runtimeEnvId)).Contents ?? [] : [];



            const allKeys = [...buildKeys, ...runtimeKeys];
            const downloadURLs: string[] = [];
            await Promise.all([...buildKeys.map(async (k,i) => {
                const url = await this._bucketService.getLogPresignedUrl(k.Key as string, 30, { ResponseContentDisposition: `attachment; filename="${this._getLogName(k.Key || "build-log", i+1)}"` });
                downloadURLs.push(url);
            }), ...runtimeKeys.map(async (k,i) => {
                const url = await this._bucketService.getLogPresignedUrl(k.Key as string, 30, { ResponseContentDisposition: `attachment; filename="${this._getLogName(k.Key || "runtime-log", i+1)}"` });
                downloadURLs.push(url);
            })]);
            return GrpcResponse.OK({ downloadURLs }, "EXPORT_LOGS_URLS_GENERATED_SUCCESSFULLY")
        } catch (e:any) {
            return this._errHandler(e, "EXPORT-LOGS", reqMeta.requestId)
        }
    }

    async streamLogs(call: ServerWritableStream<StreamLogsRequest & { body: StreamLogsRequestBodyType }, LogStreamBody>) {
        const callStatus = { cancelled: false };
        const writeLogHandler = this._writeBufferLogsToStream.bind(this, call, callStatus);
        call.on('cancelled', () => {
            callStatus.cancelled = true
            this._newLogsEvent.off(LOG_EVENTS.NEW_LOGS, writeLogHandler)
        });
        call.on('error', () => {
            callStatus.cancelled = true;
            try { call.end() } catch { }
            this._newLogsEvent.off(LOG_EVENTS.NEW_LOGS, writeLogHandler)
        })
        const body = call.request.body
        try {
            if (callStatus.cancelled) return
            await this._permissionsService.getPermissions({
                authUserData: body.authUserData,
                permissions: ["READ"],
                scope: "DEPLOYMENT",
                resourceId: body.projectId,
                errMsg: "You do not have permission to stream logs for this deployment",
                reqMeta: body.reqMeta
            })
            writeLogHandler()
            this._newLogsEvent.on(LOG_EVENTS.NEW_LOGS, writeLogHandler)
            await this._writeStaticLogsToStream({ environmentId: body.environmentId, call, callStatus })
        } catch (e: any) {
            return this._errHandler(e, "STREAM-LOGS", body.reqMeta.requestId)
        }
    }

    private async _pushLogsToBucket() {
        try {
            const entries = Object.entries(this._logs)
            this._logs = {}
            if (!entries.length) return
            await Promise.all(entries.map(logBatch => {
                return this._bucketService.pushLogs(logBatch[1], logBatch[0])
            }))
        } catch (e: any) {
            this._syncErrHandler(e, "PUSH-LOGS-TO-BUCKET", "N/A")
        }
    }

    private _writeBufferLogsToStream(call: ServerWritableStream<StreamLogsRequest & { body: StreamLogsRequestBodyType }, LogStreamBody>, callStatus: { cancelled: boolean }) {
        try {
            const logs = this._logs[call.request.body.environmentId];
            logs?.forEach(log => {
                const logBody = LogStreamBody.fromObject(log);
                if (callStatus.cancelled) return
                call.write(logBody)
            })
        } catch (e: any) {
            this._syncErrHandler(e, "WRITE-LOGS-TO-STREAM", call.request.body.reqMeta.requestId)
        }
    }

    private async _writeStaticLogsToStream({ environmentId, call, callStatus }: { environmentId: string, call: ServerWritableStream<StreamLogsRequest & { body: StreamLogsRequestBodyType }, LogStreamBody>, callStatus: { cancelled: boolean } }) {
        const accumaltedLogs: ExtendLogBodyType[] = []
        try {
            const keys = await this._bucketService.getAllLogKeys(environmentId)
            for (const obj of keys.Contents || []) {
                if (!obj.Key) continue
                const raw = await this._bucketService.getLogs(obj.Key)
                const logsStr = await raw.Body?.transformToString()
                if (!logsStr) continue
                accumaltedLogs.push(...JSON.parse(logsStr))
            }
        } catch (e: any) {
            if (e.code === status.NOT_FOUND) { }
            else return this._errHandler(e, "FETCH-STATIC-LOGS", call.request.body.reqMeta.requestId)
        }
        accumaltedLogs.forEach(log => {
            const logBody = LogStreamBody.fromObject(log);
            if (callStatus.cancelled) return
            call.write(logBody, (err: any) => {
                if (callStatus.cancelled || err) return
                call.write(LogStreamBody.fromObject({
                    message: LOGS_WS_EVENTS.STATIC_LOGS_COMPLETE,
                    logId: generateId("LOG", { LOG: "log" }, 10),
                    level: "INFO",
                    type: "EVENT"
                }))
            })
        });

    }

    private async _performPeriodicCleanup() {
        const rid = generateId("RID", { RID: "rid" })
        try {
            const staleEnvIds = await this._projectsService.getStaleEnvironmentIds({ reqMeta: { requestId: rid } })
            logger.info(`[rid:N/A]: Periodic cleanup completed. for ${staleEnvIds.length} stale environments`)
        } catch (e: any) {
            this._syncErrHandler(e, "PERIODIC_CLEANUP_IN_LOGS_SERVICE", rid)
        }
    }

    private _getLogName(fileKey:string,batchNumber:number){
        const path = /\//g;
        const timestampRegex = /-b\d+\.json$/;

        return fileKey.replace(path,"_").replace(timestampRegex,`_batch-${batchNumber}.json`)
    }
}