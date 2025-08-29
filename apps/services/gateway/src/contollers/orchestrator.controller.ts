import { OrchestratorService } from "@/services/orchestrator.service";
import { grpcToHttpResponse } from "@/utils/res-utils";
import { Request, Response } from "express";

const orchestratorService = new OrchestratorService();
export async function getContainerCredsController(req:Request,res:Response){
    const {type} = req.params;
    const body = {
        jwt: req.headers.authorization?.split("Bearer ")[1].trim()
    }
    const {code,message,res:data} = type === "build"
      ? await orchestratorService.getBuildContainerCreds(body)
      : await orchestratorService.getProdContainerCreds(body);
    grpcToHttpResponse.call(res,code,message,data)
}