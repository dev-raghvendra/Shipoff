import { getContainerCredsController } from "@/contollers/internals.controller";
import { Router } from "express";
const internalsRouter = Router();

internalsRouter.get("/containers/:type/creds",getContainerCredsController)

export default internalsRouter;