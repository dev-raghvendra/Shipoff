import { GetLogClient } from "@shipoff/grpc-clients";
import { ExportLogsRequest, IPutLogRequest, LogServiceClient, StreamLogsRequest } from "@shipoff/proto";
import { promisifyGrpcCall } from "@shipoff/services-commons";

export class LogService {
    private _logService: LogServiceClient;

    constructor() {
        this._logService = GetLogClient()
    }

    async putLog(data:any){
        try {
            const request = IPutLogRequest.fromObject(data)
            const response = await promisifyGrpcCall(this._logService.IPutLog.bind(this._logService), request);
            
            return response
        } catch (e:any) {
            return e;
        }
    }

    streamLogs(data:any){
        const request = StreamLogsRequest.fromObject(data)
        const stream = this._logService.StreamLogs(request)
        return stream
    }

    async exportLogs(data:any){
        try {
            const request = ExportLogsRequest.fromObject(data)
            const response = await promisifyGrpcCall(this._logService.ExportLogs.bind(this._logService), request);
            return response
        } catch (e:any) {
            return e;
        }
    }

}