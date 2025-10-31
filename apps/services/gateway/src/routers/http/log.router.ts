import { Router } from "express";
import { exportController, putLogController } from "@/contollers/http/log.controller";
import { authenticateApiKey } from "@/middlewares/http/apikeyauth.middleware";
import { authorizationMiddleware } from "@/middlewares/http/authorization.middleware";

const logRouter = Router();

logRouter.post("/",authenticateApiKey,putLogController);
logRouter.get("/export/projects/:projectId/deployments/:deploymentId",authorizationMiddleware,exportController);

export default logRouter;