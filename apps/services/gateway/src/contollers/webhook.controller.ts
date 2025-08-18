import { GithubWebhookService } from "@/services/webhook.service";
import { grpcToHttpResponse } from "@/utils/res-utils";
import { Request, Response } from "express";
const githubWebhookService = new GithubWebhookService();

export async function githubWebHookController(req: Request, res: Response) {
    const eventType = req.headers["x-github-event"];
    const signature = req.headers["x-hub-signature-256"];

    const body = {
        eventType,
        signature,
        payload:req.body.toString()
    }
    const {code} = await githubWebhookService.githubWebHook(body);
    if(code){
        grpcToHttpResponse.call(res, code, "Webhook successful");
        return
    }
    res.sendStatus(204);
}