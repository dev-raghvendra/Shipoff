import { sendUnaryData, ServerUnaryCall, ServerWritableStream, status } from "@grpc/grpc-js";
import { LogsService } from "@/services/logs.service";
import { ExportLogsRequest, ExportLogsResponse, google, IPutLogRequest, LogStreamBody, StreamLogsRequest } from "@shipoff/proto";
import { ExportLogsRequestBodyType, IPutLogRequestBodyType, StreamLogsRequestBodyType } from "@/types/Logs";
import { endStreamWithError } from "@/libs/grpc";

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

    async handleStreamLogs(call:ServerWritableStream<StreamLogsRequest & {body:StreamLogsRequestBodyType},LogStreamBody>){
        try {
            const response = await this._logsService.streamLogs(call) 
            response && endStreamWithError.call(call,response.code,response.message)
        } catch (e:any) {
            endStreamWithError.call(call,status.INTERNAL,"Internal Server Error")
        }
    }

    async handleExportLogs(call:ServerUnaryCall<ExportLogsRequest & {body:ExportLogsRequestBodyType},sendUnaryData<ExportLogsResponse>>,callback:sendUnaryData<ExportLogsResponse>){
        try {
            const {res,code,message} = await this._logsService.ExportLogs(call.request.body);
            if(code!==status.OK) return callback({code,message})
            const response = ExportLogsResponse.fromObject({code,message,res})
            return callback(null,response)
        } catch (e:any) {
            return callback({code:status.INTERNAL,message:"Internal Server Error"})
        }
    }
}