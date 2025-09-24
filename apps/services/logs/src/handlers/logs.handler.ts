import { sendUnaryData, ServerUnaryCall, ServerWritableStream, status } from "@grpc/grpc-js";
import { LogsService } from "@/services/logs.service";
import {GetLogsRequest, GetLogsResponse, google, IPutLogRequest, LogBody, StreamLogsRequest} from "@shipoff/proto";
import { GetLogsRequestBodyType, IPutLogRequestBodyType, StreamLogsRequestBodyType } from "@/types/Logs";

export class LogsHandler {
    private _logsService : LogsService;
    constructor (){
         this._logsService = new LogsService();
    }

    async handleIPutLog(call:ServerUnaryCall<IPutLogRequest & {body:IPutLogRequestBodyType},sendUnaryData<google.protobuf.Empty>>,callback:sendUnaryData<google.protobuf.Empty>){
        try {
            const {code} = await this._logsService.IPutLogs(call.request.body);
            if(code!==status.OK) return callback({code,message:"Failed to store log"})
            const response = google.protobuf.Empty.fromObject({})
            return callback(null,response)
        } catch (e:any) {
            return callback({code:status.INTERNAL,message:"Internal Server Error"})
        }
    }

    async handleGetLogs(call:ServerUnaryCall<GetLogsRequest & {body:GetLogsRequestBodyType},sendUnaryData<GetLogsResponse>>,callback:sendUnaryData<GetLogsResponse>){
        try {
            const {code,message,res} = await this._logsService.getLogs(call.request.body);
            if(code!==status.OK) return callback({code,message})
            const response = GetLogsResponse.fromObject({code,res,message})
            return callback(null,response)
        } catch (e:any) {
            return callback({code:status.INTERNAL,message:"Internal Server Error"})
        }
    }

    async handleStreamLogs(call:ServerWritableStream<StreamLogsRequest & {body:StreamLogsRequestBodyType},LogBody>){
        const response = await this._logsService.streamLogs(call) 
        response && call.destroy({code:response.code,message:response.message} as any)
    }
}