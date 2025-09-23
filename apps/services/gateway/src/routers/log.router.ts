import { Router } from "express";
import { putLogController } from "@/contollers/log.controller";
import { authenticateApiKey } from "@/middlewares/apikeyauth.middleware";

const logRouter = Router();

logRouter.post("/",authenticateApiKey,putLogController);

export default logRouter;