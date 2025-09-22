import { Router } from "express";
import { putLogController } from "@/contollers/log.controller";

const logRouter = Router();

logRouter.put("/", putLogController);

export default logRouter;