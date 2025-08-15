import { Response } from "express";

const map: Record<number, number> = {
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
export function grpcToHttpResponse(this:Response, code:number, message:string, res:any = null) {
    this.status(map[code] || 500).json({code: map[code], message, res});
}

