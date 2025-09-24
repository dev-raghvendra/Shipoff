import { Request } from "express";
import { IncomingMessage } from "http";

export interface RequestWithMeta extends Request {
    meta?:{
        requestId: string
    }
}

export interface LogsWebSocketIncomingMessage extends IncomingMessage {
    user?:any,
    params?:{
        envId:string,
        projectId:string
    }
}