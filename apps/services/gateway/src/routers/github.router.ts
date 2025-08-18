import { Router } from "express";
import { authorizationMiddleware } from "@/middlewares/authorization.middleware";
import { getGithubInstallationController, getGithubRepositoryDetailsController, getUserGithubRepositoriesController, githubInstallationCallbackController } from "@/contollers/github.controller";

const githubRouter = Router();

githubRouter.get("/repos",authorizationMiddleware, getUserGithubRepositoriesController);
githubRouter.get("/repos/:repoId", authorizationMiddleware, getGithubRepositoryDetailsController);
githubRouter.get("/installation", authorizationMiddleware, getGithubInstallationController);
githubRouter.get("/installation/callback", githubInstallationCallbackController);

export default githubRouter;