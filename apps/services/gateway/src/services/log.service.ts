import { GetLogClient } from "@shipoff/grpc-clients";
import { IPutLogRequest, LogServiceClient } from "@shipoff/proto";
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
            console.log("Log Service Response:", response);
            return response
        } catch (e:any) {
            return e;
        }
    }
}