import { Request, Response } from "express";
import { AuthService } from "@/services/auth.service";
import { grpcToHttpResponse } from "@/utils/res-utils";
const authService = new AuthService();

export async function loginController(req:Request, res:Response){
    const {code, message, res:data} = await authService.login(req.body);
    grpcToHttpResponse.call(res, code, message, data);
}

export async function signinController(req:Request, res:Response){
    const {code, message, res:data} = await authService.signin(req.body);
    grpcToHttpResponse.call(res, code, message, data);
}

export async function OauthController(req:Request, res:Response){
    const {code, message, res:data} = await authService.OAuth(req.body);
    grpcToHttpResponse.call(res, code, message, data);
}

export async function getMeController(req:Request, res:Response){
    const {code, message, res:data} = await authService.getMe(req.body);
    grpcToHttpResponse.call(res, code, message, data);
}

export async function refreshTokenController(req:Request, res:Response){
    const {code, message, res:data} = await authService.refreshToken(req.body);
    grpcToHttpResponse.call(res, code, message, data);
}

export async function createTeamController(req:Request,res:Response){
    const {code, message, res:data} = await authService.createTeam(req.body)
    grpcToHttpResponse.call(res,code,message,data);
}

export async function getTeamsController(req:Request,res:Response){
    const body = {
        ...req.body,
        ...(req.query.skip && { skip: req.query.skip }),
        ...(req.query.limit && { limit: req.query.limit })
    }
    const {code, message, res:data} = await authService.getAllUserTeams(body);
    grpcToHttpResponse.call(res, code, message, data);
}

export async function getTeamController(req:Request,res:Response){
    const {teamId} = req.params;
    const body = {...req.body, teamId};
    const {code, message, res:data} = await authService.getTeam(body);
    grpcToHttpResponse.call(res, code, message, data);
}

export async function deleteTeamController(req:Request,res:Response){
    const {teamId} = req.params;
    const body = {...req.body, teamId};
    const {code, message, res:data} = await authService.deleteTeam(body);
    grpcToHttpResponse.call(res, code, message, data);
}

export async function createTeamMemberInviteController(req:Request,res:Response){
    const {teamId} = req.params;
    const body = {...req.body, teamId};
    const {code, message, res:data} = await authService.createTeamMemberInvitation(body);
    grpcToHttpResponse.call(res, code, message, data);
}

export async function acceptTeamInvitationController(req:Request,res:Response){
    const {teamId, inviteId} = req.params;
    const body = {...req.body, teamId, inviteId};
    const {code, message, res:data} = await authService.acceptTeamInvitation(body);
    grpcToHttpResponse.call(res, code, message, data);
}

export async function getTeamMemberController(req:Request,res:Response){
    const {teamId, targetUserId} = req.params;
    const body = {...req.body, teamId, targetUserId};
    const {code, message, res:data} = await authService.getTeamMember(body);
    grpcToHttpResponse.call(res, code, message, data);
}

export async function deleteTeamMemberController(req:Request,res:Response){
    const {teamId, targetUserId} = req.params;
    const body = {...req.body, teamId, targetUserId};
    const {code, message, res:data} = await authService.deleteTeamMember(body);
    grpcToHttpResponse.call(res, code, message, data);
}

export async function createProjectMemberInvitationController(req:Request,res:Response){
    const {projectId} = req.params;
    const body = {...req.body, projectId};
    const {code, message, res:data} = await authService.createProjectMemberInvitation(body);
    grpcToHttpResponse.call(res, code, message, data);
}

export async function acceptProjectInvitationController(req:Request,res:Response){
    const {projectId, inviteId} = req.params;
    const body = {...req.body, projectId, inviteId};
    const {code, message, res:data} = await authService.acceptProjectInvitation(body);
    grpcToHttpResponse.call(res, code, message, data);
}

export async function getProjectMemberController(req:Request,res:Response){
    const {projectId, targetUserId} = req.params;
    const body = {...req.body, projectId, targetUserId};
    const {code, message, res:data} = await authService.getProjectMember(body);
    grpcToHttpResponse.call(res, code, message, data);
}

export async function deleteProjectMemberController(req:Request,res:Response){
    const {projectId, targetUserId} = req.params;
    const body = {...req.body, projectId, targetUserId};
    const {code, message, res:data} = await authService.deleteProjectMember(body);
    grpcToHttpResponse.call(res, code, message, data);
}