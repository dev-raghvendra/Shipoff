import { getCloneURIController } from "@/contollers/http/orchestrator.controller";
import { Router } from "express";
const orchestratorRouter = Router();

orchestratorRouter.get("/containers/repo/clone-uri", getCloneURIController);

export default orchestratorRouter;