import { Request } from "express";

export interface RequestWithMeta extends Request {
    meta?:{
        requestId: string
    }
}
