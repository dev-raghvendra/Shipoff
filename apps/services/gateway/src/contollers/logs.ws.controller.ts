import { LogService } from "@/services/log.service";
import { LogsWebSocketIncomingMessage } from "@/types/request";
import { grpcToWsResponse } from "@/utils/res-utils";
import { LogBody } from "@shipoff/proto";
import { v4 as uuidv4 } from "uuid";
import { WebSocket } from "ws";

const logService = new LogService();
export async function logsWsController(ws:WebSocket, req:LogsWebSocketIncomingMessage){
    const reqId = "rid-"+uuidv4()
    const body = {reqMeta:{requestId:reqId},authUserData: req.user,environmentId:req.params?.envId,projectId:req.params?.projectId}
    const stream = logService.streamLogs(body)
    let streamClosed = false;
    stream.on("data",(data:LogBody)=>{
        const message = data.toObject()
        grpcToWsResponse.call(ws,0,message)
    })
    stream.on("error",(e:any)=>{
        streamClosed = true;
        grpcToWsResponse.call(ws,e.code,e.message)
    })
    stream.on("close",()=>{
        if(!streamClosed) {
            streamClosed = true;
            grpcToWsResponse.call(ws, 0, "Stream closed by server")
        }
    })
    ws.on("close",()=>{
        if(!streamClosed) {
            streamClosed = true;
            stream.cancel()
        }
    })

    ws.on("error",(e)=>{
        if(!streamClosed) {
            streamClosed = true;
            stream.cancel()
        }
    })
}