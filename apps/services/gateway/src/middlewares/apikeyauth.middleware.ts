import { SECRETS } from "@/config";
import { logger } from "@/libs/winston";
import { JsonWebTokenError, verifyJwt } from "@shipoff/services-commons";
import { NextFunction, Request, Response } from "express";

export async function authenticateApiKey(req:Request,res:Response,next:NextFunction){
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
        logger.error(`UNEXPECTED_ERROR_OCCURED_AT_API_KEY_VALIDATION_MIDDLEWARE ${e}`);
        res.status(500).json({code:500,message:"Internal Server Error",res:null});
        return
    }
}