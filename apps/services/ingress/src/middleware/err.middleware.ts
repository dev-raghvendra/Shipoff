import { logger } from "@/libs/winston";
import { PopulatedRequest } from "@/types/request";
import { internalErr } from "@/util/res.util";
import { NextFunction, Response } from "express";
import { createSyncErrHandler } from "@shipoff/services-commons";

const errHandler = createSyncErrHandler({ subServiceName: "INGRESS_ERR_MIDDLEWARE", logger });

export async function errMiddleware(err:any,req:PopulatedRequest,res:Response,next:NextFunction){
    internalErr.call(res,req)
    errHandler(err,"INGRESS",req.rid || "N/A");
}