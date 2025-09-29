import { SECRETS } from "@/config";
import { logger } from "@/libs/winston";
import { JsonWebTokenError, verifyJwt } from "@shipoff/services-commons";
import { NextFunction, Response } from "express";
import { createSyncErrHandler } from "@shipoff/services-commons";
import { RequestWithMeta } from "@/types/request";

const errHandler = createSyncErrHandler({ subServiceName: "API_KEY_AUTH_MIDDLEWARE", logger });

export async function authenticateApiKey(req:RequestWithMeta,res:Response,next:NextFunction){
    try {
        const apiKey = req.headers["x-api-key"];
        if(!apiKey) throw new JsonWebTokenError("API Key missing");
        await verifyJwt(apiKey as string,SECRETS.API_KEY_SECRET)
        next();
    } catch (e:any) {
        if(e instanceof JsonWebTokenError){
           res.status(401).json({code:401, message: "Unauthorized" ,res:null});
           return
        }
        errHandler(e,"API_KEY_VALIDATION",req.meta?.requestId || "N/A");
        res.status(500).json({code:500,message:"Internal Server Error",res:null});
        return
    }
}