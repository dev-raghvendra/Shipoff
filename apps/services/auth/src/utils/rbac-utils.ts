import { status } from "@grpc/grpc-js";
import { PermissionType, User } from "@prisma/index";
import { GrpcAppError } from "@shipoff/services-commons";
import { ScopeType } from "@shipoff/types";
import RBAC_CONFIG from "@/config/rbac";
import {dbService} from "@/db/db-service";
import { ProjectRoleType } from "@/types/project";
import { TeamRoleType } from "@/types/team";

interface PermissionRequest {
    userId : string;
    scope : ScopeType;
    permission : PermissionType[],
    resourceId : string,
    targetUserId ? :string
}

interface UserMembershipData {
    teamMemberships : Array<{
        role:TeamRoleType;
        teamId:string;
    }>;
    projectMemberships:Array<{
        role:ProjectRoleType,
        projectId:string
    }>
}

export class PermissionBase {
     async canAccess(request:PermissionRequest){
        try {
            const membershipData = await this.fetchUserMembershipData(request.userId)
            if(!membershipData.projectMemberships.length && !membershipData.teamMemberships.length){
                return false;
            }
            return await this.evaluatePermissionByScope(request,membershipData)
        } catch (e) {
            return false;
        }
     }
    
      checkMultiplePermissions(requests:PermissionRequest[]){
        return Promise.all(requests.map(rq=>this.canAccess(rq)))
     }

     private async fetchUserMembershipData(userId:string){
        try {
            const user = await dbService.findUniqueUser({
            where:{
                userId
            },
            include:{
                teamMembers:{
                    select:{
                        teamId:true,
                        role:true,
                    }
                },
                projectMembers:{
                    select:{
                        projectId:true,
                        role:true
                    }
                }
            }
        }) as User & {teamMembers:[],projectMembers:[]}
        return {teamMemberships:user.teamMembers,projectMemberships:user.projectMembers}
        } catch (e) {
            return {teamMemberships:[],projectMemberships:[]}
        }
     }

     private  evaluatePermissionByScope(request:PermissionRequest,membershipData:UserMembershipData){
        const {scope} = request
        switch(scope){
            case 'PROJECT':
                return this.checkProjectPermission(request,membershipData);

            case 'TEAM':
                return this.checkTeamPermission(request,membershipData);

            case 'PROJECT_MEMBER':
                return this.checkProjectMemberPermission(request,membershipData);

            case 'TEAM_MEMBER' :
                return this.checkTeamMemberPermission(request,membershipData);

            case 'TEAM_LINK':
                return this.checkTeamLinkPermission(request,membershipData);

            case 'DEPLOYMENT':
                return this.checkDeploymentPermission(request,membershipData);

            case 'REPOSITORY':
                return this.checkRepositoryPermission(request,membershipData);

            default:
                return false;
        }
     }

     private checkProjectPermission(request:PermissionRequest,membershipData:UserMembershipData){
        const {resourceId:projectId,permission} = request;
        const hasDirectMembership = membershipData.projectMemberships.find(pm=>pm.projectId==projectId);
        if(hasDirectMembership && this.hasRolePermission(hasDirectMembership.role,"PROJECT",permission)){
            return true;
        }
        return this.checkViaTeamMembership(projectId,"PROJECT",permission,membershipData);
     }

     private checkTeamPermission(request:PermissionRequest, membershipData:UserMembershipData){
         const {resourceId:teamId,permission} = request;
         const hasDirectMembership = membershipData.teamMemberships.find(mb=>mb.teamId==teamId);
         if(hasDirectMembership){
            return this.hasRolePermission(hasDirectMembership.role,"TEAM",permission);
         }
         return this.checkViaProjectMembership(teamId,"TEAM",permission,membershipData);
     }

     private async checkProjectMemberPermission(request:PermissionRequest, membershipData:UserMembershipData){
        const {resourceId:projectId,permission} = request;
        const hasDirectMembership = membershipData.projectMemberships.find(memb=>memb.projectId==projectId);
        if(hasDirectMembership && this.hasRolePermission(hasDirectMembership.role,"PROJECT_MEMBER",permission)){
            return true;
        }
        return await this.checkViaTeamMembership(projectId,"PROJECT_MEMBER",permission,membershipData)
     }

     private async checkTeamMemberPermission(request:PermissionRequest, membershipData:UserMembershipData){
        const {resourceId:teamId,permission} = request;
        const hasDirectMembership = membershipData.teamMemberships.find(tm => tm.teamId === teamId);
        if (hasDirectMembership && this.hasRolePermission(hasDirectMembership.role, 'TEAM_MEMBER', permission)) {
             return true;
        }
        return this.checkViaProjectMembership(teamId,"TEAM_MEMBER",permission,membershipData);
     }

     private async checkTeamLinkPermission(request:PermissionRequest, membershipData:UserMembershipData){
        const {resourceId:projectId,permission} = request;
        const hasDirectPermission = membershipData.projectMemberships.find(memb=>memb.projectId==projectId);
        if(hasDirectPermission && this.hasRolePermission(hasDirectPermission.role,"TEAM_LINK",permission)){
            return true;
        }
        return  this.checkViaTeamMembership(projectId,"TEAM_LINK",permission,membershipData);
    }

     private async checkDeploymentPermission(request: PermissionRequest, membershipData: UserMembershipData){
        const { resourceId: projectId, permission } = request;
        const directMembership = membershipData.projectMemberships.find(pm => pm.projectId === projectId);
        if (directMembership && this.hasRolePermission(directMembership.role, 'DEPLOYMENT', permission)) {
            return true;
        }
        return this.checkViaTeamMembership(projectId, 'DEPLOYMENT', permission, membershipData);
    }

    private async checkRepositoryPermission(request:PermissionRequest, membershipData:UserMembershipData){
        const {resourceId:projectId,permission} = request;
        const hasDirectMembership = membershipData.projectMemberships.find(mb=>mb.projectId==projectId);
        if(hasDirectMembership && this.hasRolePermission(hasDirectMembership.role,"REPOSITORY",permission)){
            return true;
        }
        return this.checkViaTeamMembership(projectId,"REPOSITORY",permission,membershipData);
    }

     private hasRolePermission(role:TeamRoleType | ProjectRoleType,scope:ScopeType,permission:PermissionType[]){
        const config = RBAC_CONFIG[role][scope]
        return permission.every(perm=>config.permissions.includes(perm))
     }
  
     private async checkViaTeamMembership(projectId:string,scope:ScopeType,permission:PermissionType[],membershipData:UserMembershipData){
        const teamIds = membershipData.teamMemberships.map(tm=>tm.teamId)
        const teamLinks = await dbService.findTeamLinks({
            where:{
                teamId:{
                    in:teamIds
                },
                projectId
            }
        })
        if(!teamLinks.length){
            return false;
        }

        const validTeamIds = new Set(teamLinks.map(ln=>ln.teamId));
        const relevantMembers = membershipData.teamMemberships.filter(memb=>validTeamIds.has(memb.teamId));
        return relevantMembers.some(memb=>this.hasRolePermission(memb.role,scope,permission));
     }

     private async checkViaProjectMembership(teamId:string,scope:ScopeType,permission:PermissionType[],membershipData:UserMembershipData){
        const projectIds = membershipData.projectMemberships.map(pm=>pm.projectId);
        const teamLinks = await dbService.findTeamLinks({
            where:{
                projectId:{
                    in:projectIds
                },
                teamId
            }
        })
        if(!teamLinks.length){
            return false;
        }
        const validProjectIds = new Set(teamLinks.map(ln=>ln.projectId));
        const relevantMembers = membershipData.projectMemberships.filter(memb=>validProjectIds.has(memb.projectId));
        return relevantMembers.some(memb=>this.hasRolePermission(memb.role,scope,permission));
     }



}

export class Permission{
    private _permissions : PermissionBase
    constructor(){
        this._permissions = new PermissionBase()
    }

    async canUpdateProject(userId: string, projectId: string) {
        const result = await this._permissions.canAccess({
            userId,
            resourceId: projectId,
            scope: "PROJECT",
            permission: ["UPDATE"]
        });
        if (!result) throw new GrpcAppError(status.PERMISSION_DENIED, "You do not have permission to update this project");
        return result;
    }

    async canReadProject(userId: string, projectId: string) {
        const result = await this._permissions.canAccess({
            userId,
            resourceId: projectId,
            scope: "PROJECT",
            permission: ["READ"]
        });
        if (!result) throw new GrpcAppError(status.PERMISSION_DENIED, "You do not have permission to read this project");
        return result;
    }

    async canReadTeam(userId: string, teamId: string) {
        const result = await this._permissions.canAccess({
            userId,
            resourceId: teamId,
            scope: "TEAM",
            permission: ["READ"]
        });
        if (!result) throw new GrpcAppError(status.PERMISSION_DENIED, "You do not have permission to read this team");
        return result;
    }

    async canDeleteProject(userId: string, projectId: string): Promise<boolean> {
        const result = await this._permissions.canAccess({
            userId,
            scope: 'PROJECT',
            permission: ['DELETE'],
            resourceId: projectId
        });
        if (!result) throw new GrpcAppError(status.PERMISSION_DENIED, "You do not have permission to delete this project");
        return result;
    }

    async canUpdateTeam(userId: string, teamId: string): Promise<boolean> {
        const result = await this._permissions.canAccess({
            userId,
            scope: 'TEAM',
            permission: ['UPDATE'],
            resourceId: teamId
        });
        if (!result) throw new GrpcAppError(status.PERMISSION_DENIED, "You do not have permission to update this team");
        return result;
    }

    async canDeleteTeam(userId: string, teamId: string): Promise<boolean> {
        const result = await this._permissions.canAccess({
            userId,
            scope: 'TEAM',
            permission: ['DELETE'],
            resourceId: teamId
        });
        if (!result) throw new GrpcAppError(status.PERMISSION_DENIED, "You do not have permission to delete this team");
        return result;
    }


    async canInviteTeamMember(userId: string, teamId: string): Promise<boolean> {
        const result = await this._permissions.canAccess({
            userId,
            scope: 'TEAM_MEMBER',
            permission: ['CREATE'],
            resourceId: teamId
        });
        if (!result) throw new GrpcAppError(status.PERMISSION_DENIED, "You do not have permission to invite members to this team");
        return result;
    }

    async canReadTeamMember(userId:string,teamId:string,targetUserId?:string){
        let result;
        if(targetUserId === userId){
            result = true;
        }
        else {
            result = await this._permissions.canAccess({
                userId,
                scope:"TEAM_MEMBER",
                permission:["READ"],
                resourceId:teamId
            })
        }
        if (!result) throw new GrpcAppError(status.PERMISSION_DENIED, "You do not have permission to read this team member");
        return result;
    }

    async canRemoveTeamMember(userId: string, teamId: string, targetUserId: string): Promise<boolean> {
        let result;
        if (targetUserId === userId) {
            result = await this._permissions.canAccess({
                userId,
                scope: 'TEAM_MEMBER',
                permission: ['SELF_DELETE'],
                resourceId: teamId
            });
        } else {
            result = await this._permissions.canAccess({
                userId,
                scope: 'TEAM_MEMBER',
                permission: ['DELETE'],
                resourceId: teamId
            });
        }
        if (!result) throw new GrpcAppError(status.PERMISSION_DENIED, "You do not have permission to remove this team member");
        const  member = await dbService.findUniqueTeamMember({userId_teamId:{userId:targetUserId,teamId}});
        if (member.role === "TEAM_OWNER") {
            if (targetUserId === userId) throw new GrpcAppError(status.FAILED_PRECONDITION,"Team owner must transfer ownership before leaving");
            throw new GrpcAppError(status.PERMISSION_DENIED,"You do not have permissions to remove the team owner");
        }
        return result;
    }

    async canInviteProjectMember(userId: string, projectId: string): Promise<boolean> {
        const result = await this._permissions.canAccess({
            userId,
            scope: 'PROJECT_MEMBER',
            permission: ['CREATE'],
            resourceId: projectId
        });
        if (!result) throw new GrpcAppError(status.PERMISSION_DENIED, "You do not have permission to invite members to this project");
        return result;
    }

    async canRemoveProjectMember(userId: string, projectId: string, targetUserId: string): Promise<boolean> {
        let result;
        if (targetUserId === userId) {
            result = await this._permissions.canAccess({
                userId,
                scope: 'PROJECT_MEMBER',
                permission: ['SELF_DELETE'],
                resourceId: projectId,
            });
        } else {
            result = await this._permissions.canAccess({
                userId,
                scope: 'PROJECT_MEMBER',
                permission: ['DELETE'],
                resourceId: projectId
            });
        }
        if (!result) throw new GrpcAppError(status.PERMISSION_DENIED, "You do not have permission to remove this project member");
        const member = await dbService.findUniqueProjectMember({userId_projectId:{userId:targetUserId,projectId}});
        if (member.role === "PROJECT_OWNER") {
            if (targetUserId === userId) throw new GrpcAppError(status.FAILED_PRECONDITION,"Project owner must transfer ownership before leaving");
            throw new GrpcAppError(status.PERMISSION_DENIED,"You do not have permissions to remove the project owner");
        }
        return result;
    }

    async canReadProjectMember(userId:string,projectId:string,targetUserId?:string){
        let result;
        if(targetUserId === userId){
            result = true;
        }
        else {
            result = await this._permissions.canAccess({
                userId,
                scope:"PROJECT_MEMBER",
                permission:["READ"],
                resourceId:projectId
            })
        }
        return result;
    }

    async canCreateTeamLink(userId: string, projectId: string): Promise<boolean> {
        const result = await this._permissions.canAccess({
            userId,
            scope: 'TEAM_LINK',
            permission: ['CREATE'],
            resourceId: projectId
        });
        if (!result) throw new GrpcAppError(status.PERMISSION_DENIED, "You do not have permission to link teams to this project");
        return result;
    }

    async canDeleteTeamLink(userId: string, projectId: string): Promise<boolean> {
        const result = await this._permissions.canAccess({
            userId,
            scope: 'TEAM_LINK',
            permission: ['DELETE'],
            resourceId: projectId
        });
        if (!result) throw new GrpcAppError(status.PERMISSION_DENIED, "You do not have permission to unlink teams from this project");
        return result;
    }

    // DEPLOYMENT OPERATIONS
    async canCreateDeployment(userId: string, projectId: string): Promise<boolean> {
        const result = await this._permissions.canAccess({
            userId,
            scope: 'DEPLOYMENT',
            permission: ['CREATE'],
            resourceId: projectId
        });
        if (!result) throw new GrpcAppError(status.PERMISSION_DENIED, "You do not have permission to create deployments for this project");
        return result;
    }

    async canUpdateDeployment(userId: string, projectId: string): Promise<boolean> {
        const result = await this._permissions.canAccess({
            userId,
            scope: 'DEPLOYMENT',
            permission: ['UPDATE'],
            resourceId: projectId
        });
        if (!result) throw new GrpcAppError(status.PERMISSION_DENIED, "You do not have permission to update this deployment for this project");
        return result;
    }

    async canDeleteDeployment(userId: string, projectId: string): Promise<boolean> {
        const result = await this._permissions.canAccess({
            userId,
            scope: 'DEPLOYMENT',
            permission: ['DELETE'],
            resourceId: projectId
        });
        if (!result) throw new GrpcAppError(status.PERMISSION_DENIED, "You do not have permission to delete this deployment for this project");
        return result;
    }

    async canTransferOwnership(userId:string,scope:"PROJECT"|"TEAM",resourceId:string,targetUserId:string){
        if(targetUserId === userId) throw new GrpcAppError(status.FAILED_PRECONDITION,"You can't transfer ownership to self");
        const result = await this._permissions.canAccess({
            userId,
            scope,
            permission:["TRANSFER_OWNERSHIP"],
            resourceId
        })
        if (!result) throw new GrpcAppError(status.PERMISSION_DENIED, "You do not have permission to transfer ownership");
        return result
    }

}