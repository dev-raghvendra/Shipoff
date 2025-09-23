import { sendUnaryData, ServerUnaryCall, status } from "@grpc/grpc-js";
import { LogsService } from "@/services/logs.service";
import {google, IPutLogRequest} from "@shipoff/proto";
import { IPutLogRequestBodyType } from "@/types/Logs";

export class LogsHandler {
    private _logsService : LogsService;
    constructor (){
         this._logsService = new LogsService();
    }

    async handleIPutLog(call:ServerUnaryCall<IPutLogRequest & {body:IPutLogRequestBodyType},sendUnaryData<google.protobuf.Empty>>,callback:sendUnaryData<google.protobuf.Empty>){
        try {
            const {code} = await this._logsService.IPutLog(call.request.body);
            if(code!==status.OK) return callback({code,message:"Failed to store log"})
            const response = google.protobuf.Empty.fromObject({})
            return callback(null,response)
        } catch (e:any) {
            return callback({code:status.INTERNAL,message:"Internal Server Error"})
        }
    }
}