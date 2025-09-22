import { GetLogClient } from "@shipoff/grpc-clients";
import { LogServiceClient } from "@shipoff/proto";
import { promisifyGrpcCall } from "@shipoff/services-commons";

export class LogService {
    private _logService: LogServiceClient;

    constructor() {
        this._logService = GetLogClient()
    }

    async putLog(data:any){
        try {
            const response = await promisifyGrpcCall(this._logService.IPutLog.bind(this._logService), data);
            return response
        } catch (e:any) {
            return e;
        }
    }
}