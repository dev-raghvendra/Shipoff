import { Prisma, PrismaClient } from "@prisma/client";
import passHashMiddleware from "./middleware";
import {  OAuthRequestDBBodyType, SigninRequestDBBodyType } from "@/types/user";
import { CreateTeamRequestDBBodyType, DeleteTeamRequestDBBodyType, LinkTeamToProjectRequestDBBodyType, TeamMemberDBBodyType, TeamMemberInvitationRequestDBBodyType, TransferTeamOwnershipRequestDBBodyType, UnlinkTeamFromProjectRequestDBBodyType } from "@/types/team";
import { ProjectMemberDBBodyType, ProjectMemberInvitationRequestDBBodyType, TransferProjectOwnershipRequestDBBodyType } from "@/types/project";
import { generateId, GrpcAppError } from "@shipoff/services-commons";
import { DefaultArgs } from "@prisma/runtime/library";
import { status } from "@grpc/grpc-js";
import SECRETS from "@/config/secrets";

const MODEL_MAP = {
    User: "user",
    Team: "team",
    TeamMemberInvitation: "team-invite",
    ProjectMemberInvitation: "prj-invite",
    Subscription:"sub"
} as const;

export class Database {
    private _client;

    constructor() {
        this._client = new PrismaClient();
        this._client.$use(passHashMiddleware);
    }

    // FIND METHODS
    async findUniqueUser<T extends Prisma.UserFindUniqueArgs>(args: T) {
        const res = await this._client.user.findUnique(args);
        if(res){
            return res as Prisma.UserGetPayload<T>;
        }
        throw new GrpcAppError(status.NOT_FOUND,"User not found",null)
    }

    async findUsers(where: Prisma.UserWhereInput, select: Prisma.UserSelect) {
        const res = await this._client.user.findMany({ where, select });
        if(res.length) return res;
        throw new GrpcAppError(status.NOT_FOUND,"No users found",null);
    }

    async findUniqueUserById<T extends Prisma.UserSelect>(userId: string, select?: Prisma.UserSelect) {
        const res = await this._client.user.findUnique({ where: { userId },select});
        
        if(res) return res as Prisma.UserGetPayload<{select:T}>;
        throw new GrpcAppError(status.NOT_FOUND,"User not found",null);
    }

    async updateUser<T extends Prisma.UserUpdateArgs>(args:T){
        const res = await this._client.user.update(args);
        if(res) return res as Prisma.UserGetPayload<T>;
        throw new GrpcAppError(status.NOT_FOUND,"User not found",null);
    }

    async findUniqueTeamById(teamId: string, select?: Prisma.TeamSelect) {
        const res = await this._client.team.findUnique({ where: { teamId }, select });
        if(res) return res;
        throw new GrpcAppError(status.NOT_FOUND,"Team not found",null);
    }

    async findUniqueTeam(args:Prisma.TeamFindUniqueArgs){
        const res = await this._client.team.findUnique(args);
        if(res) return res;
        throw new GrpcAppError(status.NOT_FOUND,"Team not found",null);
    }

    async findManyTeams(args:Prisma.TeamFindManyArgs){
        const res = await this._client.team.findMany(args);
        return res as Prisma.TeamGetPayload<{include:typeof args.include}>[];
    }

    async findUniqueTeamMember(where: Prisma.TeamMemberWhereUniqueInput, select?: Prisma.TeamMemberSelect) {
        const res = await this._client.teamMember.findUnique({ where, select });
        if(res) return res;
        throw new GrpcAppError(status.NOT_FOUND,"Team member not found",null);
    }

    async findTeamMembers<T extends Prisma.TeamMemberFindManyArgs>(args:T){
        const res = await this._client.teamMember.findMany(args);
        if(res) return res as Prisma.TeamMemberGetPayload<T>;
        throw new GrpcAppError(status.NOT_FOUND,"No team members found",null);
    }

    async findUniqueProjectMember(where: Prisma.ProjectMemberWhereUniqueInput, select?: Prisma.ProjectMemberSelect) {
        const res = await this._client.projectMember.findUnique({ where, select });
        if (res) return res;
        throw new GrpcAppError(status.NOT_FOUND,"Project member not found",null);
    }

    async findProjectMembers(where: Prisma.ProjectMemberWhereInput, select?: Prisma.ProjectMemberSelect){
        const res = await this._client.projectMember.findMany({where,select});
        if (res) return res;
        throw new GrpcAppError(status.NOT_FOUND,"No project members found",null);
    }

    async findTeamInviteById(inviteId: string) {
        const res = await this._client.teamMemberInvitation.findUnique({ where: { inviteId } });
        if (res) return res;
        throw new GrpcAppError(status.NOT_FOUND,"Team member invitation not found",null);
    }

    async findProjectInviteById(inviteId: string) {
        const res = await this._client.projectMemberInvitation.findUnique({ where: { inviteId } });
        if (res) return res;
        throw new GrpcAppError(status.NOT_FOUND,"Project member invitation not found",null);
    }

    async findTeamLinks(args:Prisma.TeamLinkFindManyArgs){
        const res = await this._client.teamLink.findMany(args)
        if(res) return res;
        throw new GrpcAppError(status.INTERNAL,"Unexpected error occurred",res);
    }

    // CREATE METHODS
    async createOAuthUser<T extends Prisma.UserSelect>(body:OAuthRequestDBBodyType,select:T){ {
        try {
            const res = await this._client.user.create({
                data: {
                    userId:generateId("User",MODEL_MAP),
                    emailVerified:true,
                    ...body,
                    subscription:{
                        create:{
                            subscriptionId: generateId("Subscription",MODEL_MAP),
                            freePerksId:SECRETS.FREE_SUBSCRIPTION_PERKS_ID,
                            proPerksId:null,
                            type:"FREE"
                        }
                    }
                },
                select
            },
            );
            return res as Prisma.UserGetPayload<{select:T}>;
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
                throw new GrpcAppError(status.ALREADY_EXISTS,"User already exists",null);
            }
            throw new GrpcAppError(status.INTERNAL,"Unexpected error occurred",null);
        }
    }}

    async createEmailUser<T extends Prisma.UserSelect>(body:SigninRequestDBBodyType,select:T){
        try {
            const subscriptionId = generateId("Subscription",MODEL_MAP)
            const res = await this._client.user.create({
                data: {
                    userId: generateId("User",MODEL_MAP),
                    ...body,
                    provider:"EMAIL",
                    subscription:{
                        create:{
                            subscriptionId,
                            freePerksId:SECRETS.FREE_SUBSCRIPTION_PERKS_ID,
                            proPerksId:null,
                            type:"FREE"
                        }
                    }
                },
                select
            });
            return res as Prisma.UserGetPayload<{select:T}>;
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
                throw new GrpcAppError(status.ALREADY_EXISTS,"User already exists",null);
            }
            throw new GrpcAppError(status.INTERNAL,"Unexpected error occurred",error);
        }
    }

    async createTeam(body: CreateTeamRequestDBBodyType & { userId: string }) {
        try {
            const res = await this._client.team.create({
                data: {
                    teamId: generateId("Team",MODEL_MAP),
                    teamName:body.teamName,
                    description:body.description,
                    teamMembers: {
                        create: [
                            {
                                role: "TEAM_OWNER",
                                userId: body.userId,
                            },
                        ],
                    },
                },
            });
            return res;
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
                throw new GrpcAppError(status.ALREADY_EXISTS,"Team already exists",null);
            }
            throw new GrpcAppError(status.INTERNAL,"Unexpected error occurred",error);
        }
    }

    async createTeamMember(body: TeamMemberDBBodyType) {
        try {
            const res = await this._client.teamMember.create({
                data: {
                    ...body,
                },
            });
            return res;
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
                throw new GrpcAppError(status.ALREADY_EXISTS,"Team member already exists",null);
            }
            throw new GrpcAppError(status.INTERNAL,"Unexpected error occurred",null);
        }
    }

    async createProjectMember(body: ProjectMemberDBBodyType) {
        try {
            const res = await  this._client.projectMember.create({
                data: {
                    ...body,
                },
            });
            return res;
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
                throw new GrpcAppError(status.ALREADY_EXISTS,"Project member already exists",null);
            }
            throw new GrpcAppError(status.INTERNAL,"Unexpected error occurred",null);
        }
    }

    async createTeamInvitation(body: TeamMemberInvitationRequestDBBodyType) {
        try {
            const res = await this._client.teamMemberInvitation.create({
                data: {
                    inviteId: generateId("TeamMemberInvitation",MODEL_MAP),
                    ...body
                },
            });
            return res;
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
                throw new GrpcAppError(status.ALREADY_EXISTS,"Team member invitation already exists",null);
            }
            throw new GrpcAppError(status.INTERNAL,"Unexpected error occurred",null);
        }
    }

    async createProjectInvitation(body: ProjectMemberInvitationRequestDBBodyType) {
        try {
            const res = await this._client.projectMemberInvitation.create({
                data: {
                    inviteId: generateId("ProjectMemberInvitation",MODEL_MAP),
                    ...body
                },
            });
            return res;
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
                throw new GrpcAppError(status.ALREADY_EXISTS,"Project member invitation already exists",null);
            }
            throw new GrpcAppError(status.INTERNAL,"Unexpected error occurred",null);
        }
    }

    async createTeamLink(select:Prisma.TeamLinkSelect,{projectId,teamId}:LinkTeamToProjectRequestDBBodyType){
        try {
            const res = await this._client.teamLink.create({
                data: {
                    projectId,
                    teamId,
                },
                select
            })
            return res as Prisma.TeamLinkGetPayload<{select:typeof select}>;
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
                throw new GrpcAppError(status.ALREADY_EXISTS,"Team is already linked with the project",null);
            }
            throw new GrpcAppError(status.INTERNAL,"Unexpected error occurred",null);
        }
    }

    async deleteTeamLink(select:Prisma.TeamLinkSelect,{projectId,teamId}:UnlinkTeamFromProjectRequestDBBodyType){
        try {
            const res = await this._client.teamLink.delete({
                where: {
                    teamId_projectId: {
                        projectId,
                        teamId
                    }
                }
            });
            return res as Prisma.TeamLinkGetPayload<{select:typeof select}>;
        } catch (e:any) {
            if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025') {
                throw new GrpcAppError(status.NOT_FOUND,"Team link not found",null);
            }
            throw new GrpcAppError(status.INTERNAL,"Unexpected error occurred",null);
        }
    }

    // DELETE METHODS
    async deleteTeamById({teamId}: DeleteTeamRequestDBBodyType) {
        try {
            const res = await this._client.team.delete({
                where: {
                    teamId,
                },
            });
            return res;
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                throw new GrpcAppError(status.NOT_FOUND, "Team not found", null);
            }
            throw new GrpcAppError(status.INTERNAL,"Unexpected error occurred",null);
        }
    }

    async deleteTeamMember(where: Prisma.TeamMemberWhereUniqueInput, select?: Prisma.TeamMemberSelect){
        try {
            const res = await this._client.teamMember.delete({where,select})
            return res;
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                throw new GrpcAppError(status.NOT_FOUND,"Team member not found",null);
            }
            throw new GrpcAppError(status.INTERNAL,"Unexpected error occurred",null);
        }
    }

    async deleteProjectMember(where: Prisma.ProjectMemberWhereUniqueInput, select?: Prisma.ProjectMemberSelect){
        try {
            const res = await this._client.projectMember.delete({where,select});
            return res;
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                throw new GrpcAppError(status.NOT_FOUND,"Project member not found",null);
            }
            throw new GrpcAppError(status.INTERNAL,"Unexpected error occurred",null);
        }
    }

    async transferTeamOwnership({teamId,newOwnerId,currentOwnerId}: TransferTeamOwnershipRequestDBBodyType){
        try {
            const res = await this._client.$transaction([
                this._client.teamMember.update({
                    where:{
                        userId_teamId:{
                            teamId,
                            userId:currentOwnerId
                        }
                    },
                    data:{
                        role:"TEAM_OWNER"
                    }
                }),
                this._client.teamMember.update({
                    where:{
                        userId_teamId:{
                            teamId,
                            userId:newOwnerId
                        }
                    },
                    data:{
                        role:"TEAM_ADMIN"
                    }
                })
            ])
            return res;
        } catch (e:any) {
            throw new GrpcAppError(status.INTERNAL,"Unexpected error occurred",null);
        }
    }

    async transferProjectOwnership({projectId,newOwnerId,currentOwnerId}: TransferProjectOwnershipRequestDBBodyType){
        try {
            const res = await this._client.$transaction([
                this._client.projectMember.update({
                    where:{
                        userId_projectId:{
                            projectId,
                            userId:currentOwnerId
                        }
                    },
                    data:{
                        role:"PROJECT_OWNER"
                    }
                }),
                this._client.projectMember.update({
                    where:{
                        userId_projectId:{
                            projectId,
                            userId:newOwnerId
                        }
                    },
                    data:{
                        role:"PROJECT_ADMIN"
                    }
                })
            ])
            return res;
        } catch (e:any) {
            throw new GrpcAppError(status.INTERNAL,"Unexpected error occurred",null);
        }
    }

    // OTHER METHODS
    startTransaction(fn:(tx: Omit<PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">)=>Promise<any>){
        return this._client.$transaction(fn)
    }

    get getClient(){
        return this._client
    }
}

export const dbService = new Database();