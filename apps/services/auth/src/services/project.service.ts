import { BodyLessRequestBodyType } from "@shipoff/types";
import { Database, dbService } from "@/db/db-service";
import { DeleteProjectMemberRequestBodyType, GetProjectIdsLinkedToTeamRequestBodyType, GetProjectMemberRequestBodyType, ProjectMemberInvitationRequestBodyType, TransferProjectOwnershipRequestBodyType } from "@/types/project";
import { AcceptMemberInviteRequestBodyType } from "@/types/utility";
import { Permission, PermissionBase } from "@/utils/rbac-utils";
import { createGrpcErrorHandler, GrpcAppError, GrpcResponse } from "@shipoff/services-commons";
import { status } from "@grpc/grpc-js";
import { logger } from "@/libs/winston";


class ProjectService {
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
    async createProjectMemberInvitation({authUserData:{userId},projectId,userId:targetUserId,role,reqMeta}:ProjectMemberInvitationRequestBodyType){
        try {
            await this._permissions.canInviteProjectMember(userId,projectId);
            const invitation = await this._dbService.createProjectInvitation({projectId,userId:targetUserId,role})
           return GrpcResponse.OK(invitation,"Invitation created")
        } catch (e:any) {
         return this._errorHandler(e,"CREATE-PROJECT-MEMBER-INVITATION",reqMeta.requestId);
       }
    }

    async acceptInvitation({inviteId,authUserData:{userId},reqMeta}:AcceptMemberInviteRequestBodyType){
       try {
            const {expiresAt,role,projectId} = await this._dbService.findProjectInviteById(inviteId);
            if(expiresAt?.getMilliseconds() as number >= Date.now()){
                throw new GrpcAppError(status.INVALID_ARGUMENT,"Invite expired",null);
            }
            const member = await this._dbService.createProjectMember({
                userId,
                role,
                projectId
            })
    
        return GrpcResponse.OK(member,"Project joined");
       }  
        catch (e:any) {
          return this._errorHandler(e,"ACCEPT-PROJECT-MEMBER-INVITATION",reqMeta.requestId);
       }
    }

    async getProjectMember({targetUserId,projectId,authUserData:{userId},reqMeta}:GetProjectMemberRequestBodyType){
      try {
          await this._permissions.canReadProjectMember(userId,projectId,targetUserId);
          const member = await this._dbService.findUniqueProjectMember({userId_projectId:{userId:targetUserId,projectId}});
          return GrpcResponse.OK(member,"Member found");
      } catch (e:any) {
          return this._errorHandler(e,"GET-PROJECT-MEMBER-INVITATION",reqMeta.requestId);
       }
    }

    async deleteProjectMember({targetUserId,projectId,authUserData:{userId},reqMeta}:DeleteProjectMemberRequestBodyType){
      try {
          await this._permissions.canRemoveProjectMember(userId,projectId,targetUserId);
          const member = await this._dbService.deleteProjectMember({userId_projectId:{
            userId:targetUserId,
            projectId
          }})
          return GrpcResponse.OK(member,"Member removed");
      } catch (e:any) {
          return this._errorHandler(e,"DELETE-PROJECT-MEMBER-INVITATION",reqMeta.requestId);
       }
    }


    async GetAllUserProjectIds({authUserData:{userId},reqMeta}:BodyLessRequestBodyType){
        try {
            const res = await this._dbService.startTransaction(async(tx)=>{
                const teamProjects = await tx.team.findMany({
                    where:{
                        teamMembers:{
                            some:{
                                userId
                            }
                        },
                        teamLink:{
                            some:{}
                        }
                    },
                    select:{
                        teamLink:{
                            select:{
                                projectId:true
                            }
                        }
                    }
                })
                const allProjectIdsViaTeam = teamProjects.flatMap(tm=>tm.teamLink.map(ln=>ln.projectId));
                const uniqueProjectIds = [...new Set(allProjectIdsViaTeam)];
                const directProjects = await tx.projectMember.findMany({
                    where:{
                        userId,
                        projectId:{
                            notIn:uniqueProjectIds
                        }
                    },
                    select:{
                        projectId:true
                    }
                })
                const finalIds =  [...uniqueProjectIds,...directProjects.map(p=>p.projectId)];
                return finalIds
            }) as string[]
             return GrpcResponse.OK(res,"ProjectIds found");throw new GrpcAppError(status.NOT_FOUND,"No projects found for user",null);
        } catch (e:any) {
            return this._errorHandler(e,"GET-ALL-USER-PROJECT-IDS",reqMeta.requestId);
        }
    }

    async tansferProjectOwnership({projectId,newOwnerId,authUserData:{userId},reqMeta}:TransferProjectOwnershipRequestBodyType){
        try {
            await this._permissions.canTransferOwnership(
                userId,
                "PROJECT",
                projectId,
                newOwnerId
            );
            await this._dbService.transferProjectOwnership(
                {
                    projectId,
                    newOwnerId,
                    currentOwnerId: userId
                }
            )
            return GrpcResponse.OK(null,"Ownership transferred");
        } catch (e:any) {
            return this._errorHandler(e,"TRANSFER-PROJECT-OWNERSHIP",reqMeta.requestId);
        }
    }

     async IGetAllProjectIdsLinkedToTeam({authUserData:{userId},teamId,reqMeta}:GetProjectIdsLinkedToTeamRequestBodyType){
        try {
            //adding self_delete helps us to verify if the user is part of the team or not because only team members can self delete and non team memebers but project memebers can also read teams and members which the project is linked to but cannot self delete therefore this check is sufficient
            const res =await this._permissionsBase.canAccess({
                userId,
                permission:["READ","SELF_DELETE"],
                scope:"TEAM_MEMBER",
                resourceId:teamId,
            })
            if(!res) throw new GrpcAppError(status.PERMISSION_DENIED,"You do not have permission to access projects linked to this team");
            const teamLinks = await this._dbService.findTeamLinks({
                where:{
                    teamId
                },
                select:{
                    projectId:true
                }
            });
            const projectIds = teamLinks.map(tl=>tl.projectId);
            return GrpcResponse.OK(projectIds,"Project Ids found");
        } catch (e:any) {
            return this._errorHandler(e,"GET-ALL-PROJECT-IDS-LINKED-TO-TEAM",reqMeta.requestId);
        }
    }

}

export default ProjectService
