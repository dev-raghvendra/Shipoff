import { acceptProjectInvitationController, acceptTeamInvitationController, getWSAuthTokenController, createProjectMemberInvitationController, createTeamController, createTeamMemberInviteController, deleteProjectMemberController, deleteTeamController, deleteTeamMemberController, getMeController, getTeamController, getTeamMembersController, getTeamsController, getTeamsLinkedToProjectController, getUserController, linkTeamToProjectController, loginController, OauthController, refreshTokenController, signinController, transferTeamOwnershipController, unlinkTeamFromProjectController, verifyEmailController } from "@/contollers/http/auth.controller";
import { authenticateApiKey } from "@/middlewares/http/apikeyauth.middleware";
import { authorizationMiddleware } from "@/middlewares/http/authorization.middleware";
import { Router } from "express";

const authRouter = Router();

authRouter.post("/login",authenticateApiKey,loginController);
authRouter.post("/signin",authenticateApiKey,signinController);
authRouter.post("/oauth", authenticateApiKey, OauthController);
authRouter.get("/me", authorizationMiddleware, getMeController);
authRouter.post("/verify-email", authorizationMiddleware, verifyEmailController);
authRouter.get("/users/:targetUserId",authorizationMiddleware,getUserController)
authRouter.get("/refresh", authorizationMiddleware, refreshTokenController);
authRouter.get("/ws/auth-token",authorizationMiddleware,getWSAuthTokenController)
authRouter.post("/teams", authorizationMiddleware, createTeamController);
authRouter.get("/teams", authorizationMiddleware, getTeamsController);
authRouter.get("/teams/projects/link/:projectId", authorizationMiddleware, getTeamsLinkedToProjectController);
authRouter.post("/teams/:teamId/link", authorizationMiddleware, linkTeamToProjectController);
authRouter.delete("/teams/:teamId/projects/:projectId/link", authorizationMiddleware, unlinkTeamFromProjectController);
authRouter.get("/teams/:teamId", authorizationMiddleware, getTeamController);
authRouter.delete("/teams/:teamId", authorizationMiddleware, deleteTeamController);
authRouter.post("/teams/:teamId/invitations", authorizationMiddleware, createTeamMemberInviteController);
authRouter.post("/teams/invitations/:inviteId/accept",authorizationMiddleware, acceptTeamInvitationController);
authRouter.patch("/teams/:teamId/owner/:newOwnerId",authorizationMiddleware,transferTeamOwnershipController)
authRouter.get("/teams/:teamId/members", authorizationMiddleware, getTeamMembersController);
authRouter.delete("/teams/:teamId/members/:targetUserId", authorizationMiddleware, deleteTeamMemberController);
authRouter.post("/projects/:projectId/invitations", authorizationMiddleware, createProjectMemberInvitationController);
authRouter.post("/projects/:projectId/invitations/:inviteId/accept", authorizationMiddleware, acceptProjectInvitationController);
authRouter.delete("/projects/:projectId/members/:targetUserId", authorizationMiddleware, deleteProjectMemberController);

export default authRouter;