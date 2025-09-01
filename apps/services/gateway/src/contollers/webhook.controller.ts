import {  WebhookService } from "@/services/webhook.service";
import { grpcToHttpResponse } from "@/utils/res-utils";
import { Request, Response } from "express";
const webhookService = new WebhookService();

export async function githubWebHookController(req: Request, res: Response) {
    const eventType = req.headers["x-github-event"];
    const signature = req.headers["x-hub-signature-256"];

    const body = {
        eventType,
        signature,
        payload:req.body.toString()
    }
    const {code,message} = await webhookService.githubWebHook(body);
    if(code){
        grpcToHttpResponse.call(res, code, message);
        return
    }
    res.sendStatus(204);
}

export async function orchestratorWebhookController(req:Request,res:Response){
    const {payload} = JSON.parse(req.body);
    const event = req.headers["x-orchestrator-event"];
    const body = {
        payload,
        event
    }
    const {code,message} = await webhookService.orchestratorWebhook(body);
    if(code){
        grpcToHttpResponse.call(res, code, message);
        return
    }
    res.sendStatus(204);
}