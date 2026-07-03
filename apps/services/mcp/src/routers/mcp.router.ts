import { Router } from "express";
import { MetadataController } from "@/controllers/metadata.controller"
import {McpController} from "@/controllers/mcp.controller"
import { authMiddleware } from "@/middlewares/auth.middleware"

const mcpRouter = Router();
const mcpController = new McpController();

mcpRouter.all("/",authMiddleware,mcpController.handle.bind(mcpController));

export  {mcpRouter};

