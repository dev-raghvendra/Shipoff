import { logger } from "@/libs/winston";
import { unauthorizedResponse } from "@/utils/response.utils";
import { createSyncErrHandler, JsonWebTokenError } from "@shipoff/services-commons";
import {  Request, Response } from "express";

const syncErrLogger = createSyncErrHandler({subServiceName:"VALIDATION",logger})

export function handleErrorMiddleware(err:any,_:Request,res:Response){
     if(err instanceof JsonWebTokenError){
        return unauthorizedResponse(res)
     }
     else res.status(500).json({code:500,message:err.message})
     syncErrLogger(err,"UNKNWON","N/A")
}