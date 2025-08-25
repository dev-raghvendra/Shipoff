import { InternalService } from "@/services/internals.service";
import { grpcToHttpResponse } from "@/utils/res-utils";
import { Request, Response } from "express";

const internalsService = new InternalService();
export async function getContainerCredsController(req:Request,res:Response){
    const {type} = req.params;
    const body = {
        jwt: req.headers.authorization?.split("Bearer ")[1]
    }
    const {code,message,res:data} = type === "build"
      ? await internalsService.getBuildContainerCreds(body)
      : await internalsService.getProdContainerCreds(body);
    grpcToHttpResponse.call(res,code,message,data)
}