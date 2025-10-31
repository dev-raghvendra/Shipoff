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

export async function verifyEmailController(req:RequestWithMeta, res:Response){
    const {code, message} = await authService.verifyEmail({...req.body,reqMeta:req.meta});
    if(code) return grpcToHttpResponse.call(res,code,message);
    res.sendStatus(204).end();
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

export async function getWSAuthTokenController(req:RequestWithMeta,res:Response){
    const {code, message, res:data} = await authService.getWSAuthToken({...req.body,reqMeta:req.meta});
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

export async function getTeamsLinkedToProjectController(req:RequestWithMeta,res:Response){
    const {projectId} = req.params;
    const body = {...req.body, projectId, reqMeta:req.meta};
    const {code, message, res:data} = await authService.getTeamsLinkedToProject(body);
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
    const {inviteId} = req.params;
    const body = {...req.body, inviteId, reqMeta:req.meta};
    const {code, message, res:data} = await authService.acceptTeamInvitation(body);
    grpcToHttpResponse.call(res, code, message, data);
}

export async function transferTeamOwnershipController(req:RequestWithMeta,res:Response){
    const {teamId,newOwnerId} = req.params;
    const body = {...req.body,teamId,newOwnerId,reqMeta:req.meta}
    const {code,message} = await authService.transferTeamOwnership(body)
    if(code) return grpcToHttpResponse.call(res,code,message);
    res.status(204).end();
}



export async function getTeamMembersController(req:RequestWithMeta,res:Response){
    const {teamId} = req.params;
    const body = {
        ...req.body,
        teamId,
        ...(req.query.skip && { skip: req.query.skip }),
        ...(req.query.limit && { limit: req.query.limit }),
        reqMeta:req.meta
    };
    const {code, message, res:data} = await authService.getTeamMembers(body);
    grpcToHttpResponse.call(res, code, message, data);
}

export async function unlinkTeamFromProjectController(req:RequestWithMeta,res:Response){
    const {teamId, projectId} = req.params;
    const body = {...req.body, teamId, projectId, reqMeta:req.meta};
    const {code, message, res:data} = await authService.unlinkTeamFromProject(body);
    grpcToHttpResponse.call(res, code, message, data);
}
export async function linkTeamToProjectController(req:RequestWithMeta,res:Response){
    const {teamId} = req.params;
    const body = {...req.body, teamId, reqMeta:req.meta};
    const {code, message, res:data} = await authService.linkTeamToProject(body);
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



export async function deleteProjectMemberController(req:RequestWithMeta,res:Response){
    const {projectId, targetUserId} = req.params;
    const body = {...req.body, projectId, targetUserId, reqMeta:req.meta};
    const {code, message, res:data} = await authService.deleteProjectMember(body);
    grpcToHttpResponse.call(res, code, message, data);
}