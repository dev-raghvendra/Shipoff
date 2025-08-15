import { githubWebHookController } from "@/contollers/webhook.controller";
import { Router } from "express";
const webhookRouter = Router();

webhookRouter.post("/github",githubWebHookController)
export default webhookRouter;