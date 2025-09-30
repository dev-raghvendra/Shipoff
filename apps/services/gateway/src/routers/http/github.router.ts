import { Router } from "express";
import { authorizationMiddleware } from "@/middlewares/http/authorization.middleware";
import { getGithubInstallationController, getGithubRepositoryDetailsController, getUserGithubRepositoriesController, githubInstallationCallbackController } from "@/contollers/http/github.controller";

const githubRouter = Router();

githubRouter.get("/repos",authorizationMiddleware, getUserGithubRepositoriesController);
githubRouter.get("/repos/:repoId", authorizationMiddleware, getGithubRepositoryDetailsController);
githubRouter.get("/installation", authorizationMiddleware, getGithubInstallationController);
githubRouter.get("/installation/callback", githubInstallationCallbackController);

export default githubRouter;