import { createOrUpdateEnvironmentVariableController, createProjectController, createRepositoryController, deleteDeploymentController, deleteEnvironmentVariableController, deleteProjectController, deleteRepositoryController, getAllDeploymentsController, getAllUserProjectsController, getDeploymentController, getEnvironmentVariablesController, getFrameworksController, getProjectController, getRepositoryController, redeployController, updateProjectController } from "@/contollers/project.controller";
import { authorizationMiddleware } from "@/middlewares/authorization.middleware";
import { Router } from "express";
const projectRouter = Router();

projectRouter.post("/",authorizationMiddleware,createProjectController);
projectRouter.get("/", authorizationMiddleware, getAllUserProjectsController);
projectRouter.get("/frameworks",authorizationMiddleware,getFrameworksController);
projectRouter.get("/:projectId", authorizationMiddleware, getProjectController);
projectRouter.patch("/:projectId",authorizationMiddleware,updateProjectController)
projectRouter.delete("/:projectId",authorizationMiddleware,deleteProjectController);
projectRouter.get("/:projectId/deployments",authorizationMiddleware, getAllDeploymentsController);
projectRouter.get("/:projectId/deployments/:deploymentId",authorizationMiddleware, getDeploymentController);
projectRouter.delete("/:projectId/deployments/:deploymentId",authorizationMiddleware, deleteDeploymentController);
projectRouter.post("/:projectId/deployments/:deploymentId",authorizationMiddleware, redeployController);
projectRouter.get("/:projectId/env-vars",authorizationMiddleware,getEnvironmentVariablesController);
projectRouter.put("/:projectId/env-vars",authorizationMiddleware,createOrUpdateEnvironmentVariableController);
projectRouter.delete("/:projectId/env-vars/:env_name",authorizationMiddleware,deleteEnvironmentVariableController);
projectRouter.get("/:projectId/repository",authorizationMiddleware, getRepositoryController);
projectRouter.post("/:projectId/repository",authorizationMiddleware, createRepositoryController);
projectRouter.delete("/:projectId/repository",authorizationMiddleware, deleteRepositoryController);

export default projectRouter;