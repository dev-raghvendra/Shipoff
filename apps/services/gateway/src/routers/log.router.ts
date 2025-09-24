import { Router } from "express";
import { getLogsController, putLogController } from "@/contollers/log.controller";
import { authenticateApiKey } from "@/middlewares/apikeyauth.middleware";
import { authorizationMiddleware } from "@/middlewares/authorization.middleware";

const logRouter = Router();

logRouter.post("/",authenticateApiKey,putLogController);
logRouter.get("/:projectId/:envId",authorizationMiddleware,getLogsController);

export default logRouter;