import { LogService } from "@/services/log.service";
import { grpcToHttpResponse } from "@/utils/res-utils";
import { Request, Response } from "express";

const logService = new LogService();

export async function putLogController(req:Request,res:Response){
    const body = req.body;
    const {code,message,res:data} = await logService.putLog(body);
    if(code)grpcToHttpResponse.call(res,code,message,data);
    else res.sendStatus(204);
}