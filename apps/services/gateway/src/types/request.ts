import { Request } from "express";
import { IncomingMessage } from "http";
import { URL } from "url";

export interface RequestWithMeta extends Request {
    meta?:{
        requestId: string
    }
}

export interface WebSocketRequest extends IncomingMessage {
    user?:any,
    URL?:URL,
    meta?:{
        requestId:string
    }
}

