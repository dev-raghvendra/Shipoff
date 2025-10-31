import { LogService } from "@/services/log.service";
import { RequestWithMeta } from "@/types/request";
import { grpcToHttpResponse } from "@/utils/res-utils";
import { Request, Response } from "express";

const logService = new LogService();

export async function putLogController(req:Request,res:Response){
    const body = {
        logs: req.body
    };
    const {code,message,res:data} = await logService.putLog(body);
    if(code) grpcToHttpResponse.call(res,code,message,data);
    else res.sendStatus(204);
}

export async function exportController(req:RequestWithMeta,res:Response){
    const body ={
        reqMeta:req.meta,
        projectId:req.params.projectId,
        deploymentId:req.params.deploymentId,
        ...req.body
    };
    const {code,message,res:data} = await logService.exportLogs(body);
    grpcToHttpResponse.call(res,code,message,data);
}