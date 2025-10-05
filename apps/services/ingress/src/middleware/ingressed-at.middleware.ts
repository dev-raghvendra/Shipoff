import { PopulatedRequest } from "@/types/request";
import { NextFunction } from "express";
import { OrchestratorService } from "@/services/orchestrator.service";
import { createAsyncErrHandler } from "@shipoff/services-commons";
import { logger } from "@/libs/winston";

const orchestratorService = new OrchestratorService()
const errHandler = createAsyncErrHandler({subServiceName:"INGRESSED_AT_MIDDLEWARE",logger})

export function ingressedAtMiddleware(req:PopulatedRequest,_:any,next:NextFunction){
    if(req.project?.projectType === "STATIC") return next()
    errHandler.call(orchestratorService.deploymentIngressed(req.project?.projectId as string,{requestId:req.rid as string}),"INGRESSED-AT",req.rid as string)
    next()
} 