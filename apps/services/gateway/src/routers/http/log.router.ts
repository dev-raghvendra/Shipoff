import { Router } from "express";
import { getLogsController, putLogController } from "@/contollers/http/log.controller";
import { authenticateApiKey } from "@/middlewares/http/apikeyauth.middleware";
import { authorizationMiddleware } from "@/middlewares/http/authorization.middleware";

const logRouter = Router();

logRouter.post("/",authenticateApiKey,putLogController);
logRouter.get("/:projectId/:envId",authorizationMiddleware,getLogsController);

export default logRouter;