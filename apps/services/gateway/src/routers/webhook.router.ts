import { githubWebHookController, orchestratorWebhookController } from "@/contollers/webhook.controller";
import { Router } from "express";
const webhookRouter = Router();

webhookRouter.post("/github",githubWebHookController)
webhookRouter.post("/orchestrator",orchestratorWebhookController)
export default webhookRouter;