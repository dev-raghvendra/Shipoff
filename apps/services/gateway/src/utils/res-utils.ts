import { Response } from "express";
import { WebSocket } from "ws";

const GRPC_TO_HTTP_MAP: Record<number, number> = {
    0: 200, // OK
    1: 499, // Canceled
    2: 500, // Unknown -> Internal Server Error
    3: 400, // Invalid Argument
    4: 504, // Deadline Exceeded
    5: 404, // Not Found
    6: 409, // Already Exists
    7: 403, // Permission Denied
    8: 429, // Resource Exhausted
    9: 400, // Failed Precondition
    10: 409, // Aborted
    11: 400, // Out of Range
    12: 501, // Unimplemented
    13: 500, // Internal
    14: 503, // Unavailable
    15: 500, // Data Loss
    16: 401  // Unauthenticated
};

const GRPC_TO_WS_MAP: Record<string, number> = {
    0: 1000, // OK
    1: 1001, // Canceled
    2: 1011, // Unknown -> Internal Server Error
    3: 1007, // Invalid Argument
    4: 1008, // Deadline Exceeded
    5: 1003, // Not Found
    6: 1009, // Already Exists
    7: 1008, // Permission Denied
    8: 1013, // Resource Exhausted
    9: 1008, // Failed Precondition
    10: 1011, // Aborted
    11: 1007, // Out of Range
    12: 1002, // Unimplemented
    13: 1011, // Internal
    14: 1013, // Unavailable
    15: 1011, // Data Loss
    16: 1008  // Unauthenticated
}
export function grpcToHttpResponse(this:Response, code:number, message:string, res:any = null) {
    this.status(GRPC_TO_HTTP_MAP[code] || 500).json({code: GRPC_TO_HTTP_MAP[code], message, res});
}

export function grpcToWsResponse(this:WebSocket,code:number,message:string|object){
   if(typeof message === "object") message = JSON.stringify(message)
   if(code!==0) this.close(GRPC_TO_WS_MAP[code] || 1011, message)
   else this.send(message)
}