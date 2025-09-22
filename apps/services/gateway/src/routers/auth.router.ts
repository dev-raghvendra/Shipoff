import { acceptProjectInvitationController, acceptTeamInvitationController, createProjectMemberInvitationController, createTeamController, createTeamMemberInviteController, deleteProjectMemberController, deleteTeamController, deleteTeamMemberController, getMeController, getProjectMemberController, getTeamController, getTeamMemberController, getTeamsController, getUserController, loginController, OauthController, refreshTokenController, signinController } from "@/contollers/auth.controller";
import { authenticateApiKey } from "@/middlewares/apikeyauth.middleware";
import { authorizationMiddleware } from "@/middlewares/authorization.middleware";
import { Router } from "express";

const authRouter = Router();

authRouter.post("/login",authenticateApiKey,loginController);
authRouter.post("/signin",authenticateApiKey,signinController);
authRouter.post("/oauth", authenticateApiKey, OauthController);
authRouter.get("/me", authorizationMiddleware, getMeController);
authRouter.get("/users/:targetUserId",authorizationMiddleware,getUserController)
authRouter.get("/refresh", authorizationMiddleware, refreshTokenController);
authRouter.post("/teams", authorizationMiddleware, createTeamController);
authRouter.get("/teams", authorizationMiddleware, getTeamsController);
authRouter.get("/teams/:teamId", authorizationMiddleware, getTeamController);
authRouter.delete("/teams/:teamId", authorizationMiddleware, deleteTeamController);
authRouter.post("/teams/:teamId/invitations", authorizationMiddleware, createTeamMemberInviteController);
authRouter.get("/teams/:teamId/invitations/:inviteId/accept",authorizationMiddleware, acceptTeamInvitationController);
authRouter.get("/teams/:teamId/members/:targetUserId", authorizationMiddleware, getTeamMemberController);
authRouter.delete("/teams/:teamId/members/:targetUserId", authorizationMiddleware, deleteTeamMemberController);
authRouter.post("/projects/:projectId/invitations", authorizationMiddleware, createProjectMemberInvitationController);
authRouter.get("/projects/:projectId/invitations/:inviteId/accept", authorizationMiddleware, acceptProjectInvitationController);
authRouter.get("/projects/:projectId/members/:targetUserId", authorizationMiddleware, getProjectMemberController);
authRouter.delete("/projects/:projectId/members/:targetUserId", authorizationMiddleware, deleteProjectMemberController);

export default authRouter;