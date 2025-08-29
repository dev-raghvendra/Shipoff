import { getContainerCredsController } from "@/contollers/orchestrator.controller";
import { Router } from "express";
const orchestratorRouter = Router();

orchestratorRouter.get("/containers/:type/creds", getContainerCredsController);

export default orchestratorRouter;