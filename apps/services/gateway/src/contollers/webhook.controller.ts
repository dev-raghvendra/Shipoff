import { CONFIG } from "@/config/config";
import { GithubWebhookService } from "@/services/webhook.service";
import { grpcToHttpResponse } from "@/utils/res-utils";
import { Request, Response } from "express";
const githubWebhookService = new GithubWebhookService();

export async function githubWebHookController(req: Request, res: Response) {
    const { code, message, res: data } = await githubWebhookService.githubWebHook(req.body);
    if(code && code!==200) grpcToHttpResponse.call(res, code, message, data);
    res.redirect(CONFIG.POST_GITHUB_INSTALLATION_FRONTEND_DESTINATION);
}