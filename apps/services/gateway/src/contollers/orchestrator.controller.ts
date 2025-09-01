import { OrchestratorService } from "@/services/orchestrator.service";
import { grpcToHttpResponse } from "@/utils/res-utils";
import { Request, Response } from "express";

const orchestratorService = new OrchestratorService();
export async function getCloneURIController(req:Request,res:Response){
    const body = {
        jwt: req.headers.authorization?.split("Bearer ")[1].trim()
    }
    const {code,message,res:data} = await orchestratorService.getCloneURI(body);
    grpcToHttpResponse.call(res,code,message,data)
}

