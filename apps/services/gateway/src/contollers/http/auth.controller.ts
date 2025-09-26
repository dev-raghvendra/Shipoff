import { Response } from "express";
import { AuthService } from "@/services/auth.service";
import { grpcToHttpResponse } from "@/utils/res-utils";
import { RequestWithMeta } from "@/types/request";
const authService = new AuthService();

export async function loginController(req:RequestWithMeta, res:Response){
    const {code, message, res:data} = await authService.login({...req.body,reqMeta:req.meta});
    grpcToHttpResponse.call(res, code, message, data);
}

export async function signinController(req:RequestWithMeta, res:Response){
    const {code, message, res:data} = await authService.signin({...req.body,reqMeta:req.meta});
    grpcToHttpResponse.call(res, code, message, data);
}

export async function OauthController(req:RequestWithMeta, res:Response){
    const {code, message, res:data} = await authService.OAuth({...req.body,reqMeta:req.meta});
    grpcToHttpResponse.call(res, code, message, data);
}

export async function getMeController(req:RequestWithMeta, res:Response){
    const {code, message, res:data} = await authService.getMe({...req.body,reqMeta:req.meta});
    grpcToHttpResponse.call(res, code, message, data);
}

export async function getUserController(req:RequestWithMeta, res:Response){
    const body = {
        ...req.body,
        targetUserId: req.params.targetUserId,
        reqMeta:req.meta
    }
    const {code, message, res:data} = await authService.getUser(body);
    grpcToHttpResponse.call(res, code, message, data);
}

export async function refreshTokenController(req:RequestWithMeta, res:Response){
    const {code, message, res:data} = await authService.refreshToken({...req.body,reqMeta:req.meta});
    grpcToHttpResponse.call(res, code, message, data);
}

export async function createTeamController(req:RequestWithMeta,res:Response){
    const {code, message, res:data} = await authService.createTeam({...req.body,reqMeta:req.meta});
    grpcToHttpResponse.call(res,code,message,data);
}

export async function getTeamsController(req:RequestWithMeta,res:Response){
    const body = {
        ...req.body,
        ...(req.query.skip && { skip: req.query.skip }),
        ...(req.query.limit && { limit: req.query.limit }),
        reqMeta:req.meta
    }
    const {code, message, res:data} = await authService.getAllUserTeams(body);
    grpcToHttpResponse.call(res, code, message, data);
}

export async function getTeamController(req:RequestWithMeta,res:Response){
    const {teamId} = req.params;
    const body = {...req.body, teamId, reqMeta:req.meta};
    const {code, message, res:data} = await authService.getTeam(body);
    grpcToHttpResponse.call(res, code, message, data);
}

export async function deleteTeamController(req:RequestWithMeta,res:Response){
    const {teamId} = req.params;
    const body = {...req.body, teamId, reqMeta:req.meta};
    const {code, message, res:data} = await authService.deleteTeam(body);
    grpcToHttpResponse.call(res, code, message, data);
}

export async function createTeamMemberInviteController(req:RequestWithMeta,res:Response){
    const {teamId} = req.params;
    const body = {...req.body, teamId, reqMeta:req.meta};
    const {code, message, res:data} = await authService.createTeamMemberInvitation(body);
    grpcToHttpResponse.call(res, code, message, data);
}

export async function acceptTeamInvitationController(req:RequestWithMeta,res:Response){
    const {teamId, inviteId} = req.params;
    const body = {...req.body, teamId, inviteId, reqMeta:req.meta};
    const {code, message, res:data} = await authService.acceptTeamInvitation(body);
    grpcToHttpResponse.call(res, code, message, data);
}

export async function getTeamMemberController(req:RequestWithMeta,res:Response){
    const {teamId, targetUserId} = req.params;
    const body = {...req.body, teamId, targetUserId, reqMeta:req.meta};
    const {code, message, res:data} = await authService.getTeamMember(body);
    grpcToHttpResponse.call(res, code, message, data);
}

export async function deleteTeamMemberController(req:RequestWithMeta,res:Response){
    const {teamId, targetUserId} = req.params;
    const body = {...req.body, teamId, targetUserId, reqMeta:req.meta};
    const {code, message, res:data} = await authService.deleteTeamMember(body);
    grpcToHttpResponse.call(res, code, message, data);
}

export async function createProjectMemberInvitationController(req:RequestWithMeta,res:Response){
    const {projectId} = req.params;
    const body = {...req.body, projectId, reqMeta:req.meta};
    const {code, message, res:data} = await authService.createProjectMemberInvitation(body);
    grpcToHttpResponse.call(res, code, message, data);
}

export async function acceptProjectInvitationController(req:RequestWithMeta,res:Response){
    const {projectId, inviteId} = req.params;
    const body = {...req.body, projectId, inviteId, reqMeta:req.meta};
    const {code, message, res:data} = await authService.acceptProjectInvitation(body);
    grpcToHttpResponse.call(res, code, message, data);
}

export async function getProjectMemberController(req:RequestWithMeta,res:Response){
    const {projectId, targetUserId} = req.params;
    const body = {...req.body, projectId, targetUserId, reqMeta:req.meta};
    const {code, message, res:data} = await authService.getProjectMember(body);
    grpcToHttpResponse.call(res, code, message, data);
}

export async function deleteProjectMemberController(req:RequestWithMeta,res:Response){
    const {projectId, targetUserId} = req.params;
    const body = {...req.body, projectId, targetUserId, reqMeta:req.meta};
    const {code, message, res:data} = await authService.deleteProjectMember(body);
    grpcToHttpResponse.call(res, code, message, data);
}