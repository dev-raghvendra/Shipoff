import { status } from "@grpc/grpc-js";
import { createGrpcErrorHandler, GrpcAppError, GrpcResponse } from "@shipoff/services-commons";
import { Database, dbService } from "@/db/db-service";
import { CreateTeamRequestBodyType, DeleteTeamMemberRequestBodyType, DeleteTeamRequestBodyType,  GetTeamMembersRequestBodyType, GetTeamRequestBodyType, GetTeamsLinkedToProjectRequestBodyType, LinkTeamToProjectRequestBodyType, TeamMemberInvitationRequestBodyType, TransferTeamOwnershipRequestBodyType, UnlinkTeamFromProjectRequestBodyType } from "@/types/team";
import { AcceptMemberInviteRequestBodyType } from "@/types/utility";
import { Permission, PermissionBase } from "@/utils/rbac-utils";
import { BulkResourceRequestBodyType } from "@shipoff/types";
import { logger } from "@/libs/winston";

class TeamService {
   
    private _permissions : Permission
    private _permissionsBase : PermissionBase
    private _dbService : Database;
    private _errorHandler : ReturnType<typeof createGrpcErrorHandler>
    constructor(){
      this._permissions = new Permission()
      this._permissionsBase = new PermissionBase()
      this._dbService = dbService;
      this._errorHandler = createGrpcErrorHandler({subServiceName:"AUTH_SERVICE",logger});
    }

    async createTeam({teamName,description,authUserData:{userId},reqMeta}:CreateTeamRequestBodyType){
        try {
            const team = await this._dbService.createTeam({teamName,description,userId});
            return GrpcResponse.OK(team,"Team created")
        } catch (e:any) {
            return this._errorHandler(e,"CREATE-TEAM",reqMeta.requestId);
        }
    }

    async getTeam({teamId,authUserData:{userId},reqMeta}:GetTeamRequestBodyType){
        try {
            await this._permissions.canReadTeam(userId,teamId);
            const t = await this._dbService.findUniqueTeam({
                where:{
                    teamId
                },
                include:{
                    teamMembers:{
                        include:{
                            member:true
                        }
                    }
                }
            });
            return GrpcResponse.OK(t,"Team found");
        } catch (e:any) {
            return this._errorHandler(e,"GET-TEAM",reqMeta.requestId);
        }
    }



    async deleteTeam({teamId,authUserData:{userId},reqMeta}:DeleteTeamRequestBodyType){

       try {
          await this._permissions.canDeleteTeam(userId,teamId);
          const del = await this._dbService.deleteTeamById({teamId});
          return GrpcResponse.OK(del,"Team deleted");
       } catch (e:any) {
         return this._errorHandler(e,"DELETE-TEAM",reqMeta.requestId);
       }
    }

    async createTeamMemberInvitation({teamId,role,authUserData:{userId},reqMeta}:TeamMemberInvitationRequestBodyType){
        try {
           await this._permissions.canInviteTeamMember(userId,teamId)
           const invitation = await this._dbService.createTeamInvitation({teamId,role})
           return GrpcResponse.OK(invitation,"Invitation created")
       } catch (e:any) {
         return this._errorHandler(e,"CREATE-TEAM-MEMBER-INVITATION",reqMeta.requestId)
       }
    }

    async getTeamsLinkedToProject({projectId,authUserData:{userId},reqMeta}:GetTeamsLinkedToProjectRequestBodyType){
        try {
            const can = await this._permissionsBase.canAccess({
                userId,
                permission:["READ"],
                scope:"TEAM_LINK",
                resourceId:projectId,
            })
            if(!can) throw new GrpcAppError(status.PERMISSION_DENIED,"You do not have permission to access teams linked to this project");
            const teams = await this._dbService.findManyTeams({
                where:{
                    teamLink:{
                        some:{
                            projectId
                        }
                    }
                }
            })
            return GrpcResponse.OK(teams,"Teams linked to project found");
        } catch (e:any) {
            return this._errorHandler(e,"GET-TEAMS-LINKED-TO-PROJECT",reqMeta.requestId);
        }
    }

    async acceptInvitation({inviteId,authUserData:{userId},reqMeta}:AcceptMemberInviteRequestBodyType){
       try {
            const {expiresAt,teamId,role} = await this._dbService.findTeamInviteById(inviteId);
            if(expiresAt?.getMilliseconds() as number >= Date.now()){
              throw new GrpcAppError(status.INVALID_ARGUMENT,"Invite expired",null);
            }
            const member = await this._dbService.createTeamMember({
                userId,
                teamId,
                role,
            })

        return GrpcResponse.OK(member,"Team joined");
       }  
        catch (e:any) {
          return this._errorHandler(e,"ACCEPT-TEAM-MEMBER-INVITATION",reqMeta.requestId);
       }
    }


    async linkTeamToProject({projectId,teamId,authUserData:{userId},reqMeta}:LinkTeamToProjectRequestBodyType){
        try {
            await this._permissions.canCreateTeamLink(userId,projectId);
            const res = await this._dbService.createTeamLink({
                teamId:true
            },{projectId,teamId});
            return GrpcResponse.OK(true,"Team linked to project");
        } catch (e:any) {
            return this._errorHandler(e,"LINK-TEAM-TO-PROJECT",reqMeta.requestId);
        }
    }

    async unlinkTeamFromProject({projectId,teamId,authUserData:{userId},reqMeta}:UnlinkTeamFromProjectRequestBodyType){
        try {
            await this._permissions.canDeleteTeamLink(userId,projectId);
            await this._dbService.deleteTeamLink({projectId:true},{projectId,teamId});
            return GrpcResponse.OK(true,"Team unlinked from project");
        } catch (e:any) {
            return this._errorHandler(e,"UNLINK-TEAM-FROM-PROJECT",reqMeta.requestId);
        }
    }

    async getTeamMembers({teamId,authUserData:{userId},skip,limit,reqMeta}:GetTeamMembersRequestBodyType){
        try {
            await this._permissions.canReadTeamMember(userId,teamId);
            const members = await this._dbService.findTeamMembers({
                where:{
                    teamId
                },
                select:{
                    userId:true,
                    teamId:true,
                    role:true,
                    createdAt:true,
                    updatedAt:true,
                    member:{
                        select:{
                            fullName:true,
                            email:true,
                            avatarUri:true
                        }
                    }
                },
                skip,
                take:limit
            })
            return GrpcResponse.OK(members,"Team members found");
        } catch (e:any) {
            return this._errorHandler(e,"GET-TEAM-MEMBERS",reqMeta.requestId);
        }
    }

    async deleteTeamMember({authUserData:{userId},targetUserId,teamId,reqMeta}:DeleteTeamMemberRequestBodyType){
        try {
            await this._permissions.canRemoveTeamMember(userId,teamId,targetUserId);
            const res = await this._dbService.deleteTeamMember({userId_teamId:{teamId,userId:targetUserId}})
            return GrpcResponse.OK(res,"Team member deleted");
        } catch (e:any) {
            return this._errorHandler(e,"DELETE-TEAM-MEMBER",reqMeta.requestId);
        }
    }

    async GetAllUserTeams({authUserData:{userId},skip,limit:take,reqMeta}:BulkResourceRequestBodyType){
        try {
            const res = await this._dbService.findManyTeams({
                where:{
                    teamMembers:{
                        some:{
                            userId
                        }
                    }
                },
                include:{
                    _count:{
                        select:{teamMembers:true}
                    }
                },
                skip,
                take
            })
            return GrpcResponse.OK(res,"User's teams found");
        } catch (e:any) {
            return this._errorHandler(e,"GET-ALL-USER-TEAMS",reqMeta.requestId);
        }
    }

    async transferTeamOwnership({teamId,newOwnerId,authUserData:{userId},reqMeta}:TransferTeamOwnershipRequestBodyType){
        try {
            await this._permissions.canTransferOwnership(userId,"TEAM",teamId,newOwnerId);
            await this._dbService.transferTeamOwnership({
                teamId,
                currentOwnerId: userId,
                newOwnerId
            });
            return GrpcResponse.OK(null,"Team ownership transferred");
        } catch (e:any) {
            return this._errorHandler(e,"TRANSFER-TEAM-OWNERSHIP",reqMeta.requestId);
        }
    }
        

   
}

export default TeamService