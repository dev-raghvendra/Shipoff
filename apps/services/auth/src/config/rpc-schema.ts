import { GetProjectIdsLinkedToTeamRequestSchema, ProjectMemberInvitationRequestSchema } from "@/types/project"
import { CreateTeamRequestSchema, DeleteTeamMemberRequestSchema, DeleteTeamRequestSchema, GetTeamMembersRequestSchema, GetTeamRequestSchema, GetTeamsLinkedToProjectRequestSchema, LinkTeamToProjectRequestSchema, TeamMemberInvitationRequestSchema, UnlinkTeamFromProjectRequestSchema } from "@/types/team"
import { EmailPassLoginRequestSchema, SigninRequestSchema, GetUserRequestSchema, OAuthRequestSchema, VerifyEmailRequestSchema } from "@/types/user"
import { AcceptMemberInviteRequestSchema, HasPermissionsRequestSchema } from "@/types/utility"
import { createRPCEntry, RPC_SCHEMA_T } from "@shipoff/services-commons";
import { BodyLessRequestSchema, BulkResourceRequestSchema } from "@shipoff/types";
import { UnimplementedAuthServiceService } from "@shipoff/proto";

export type RPCs = keyof typeof UnimplementedAuthServiceService.definition;



export const RPC_SCHEMA: RPC_SCHEMA_T<RPCs> = {
    Login: createRPCEntry(EmailPassLoginRequestSchema),
    Signin: createRPCEntry(SigninRequestSchema),
    OAuth: createRPCEntry(OAuthRequestSchema),
    GetUser: createRPCEntry(GetUserRequestSchema),
    GetMe:createRPCEntry(BodyLessRequestSchema),
    RefreshToken: createRPCEntry(BodyLessRequestSchema),
    CreateTeam: createRPCEntry(CreateTeamRequestSchema),
    GetTeam: createRPCEntry(GetTeamRequestSchema),
    GetTeamsLinkedToProject: createRPCEntry(GetTeamsLinkedToProjectRequestSchema),
    DeleteTeam: createRPCEntry(DeleteTeamRequestSchema),
    CreateTeamMemberInvitation: createRPCEntry(TeamMemberInvitationRequestSchema),
    GetTeamMembers: createRPCEntry(GetTeamMembersRequestSchema),
    DeleteTeamMember: createRPCEntry(DeleteTeamMemberRequestSchema),
    CreateProjectMemberInvitation: createRPCEntry(ProjectMemberInvitationRequestSchema),
    DeleteProjectMember: createRPCEntry(DeleteTeamMemberRequestSchema),
    AcceptTeamInvitation:createRPCEntry(AcceptMemberInviteRequestSchema),
    AcceptProjectInvitation:createRPCEntry(AcceptMemberInviteRequestSchema),
    HasPermissions:createRPCEntry(HasPermissionsRequestSchema),
    GetAllUserProjectIds:createRPCEntry(BodyLessRequestSchema),
    GetAllUserTeams:createRPCEntry(BulkResourceRequestSchema),
    TransferProjectOwnership:createRPCEntry(ProjectMemberInvitationRequestSchema),
    TransferTeamOwnership:createRPCEntry(TeamMemberInvitationRequestSchema),
    IGetAllProjectIdsLinkedToTeam:createRPCEntry(GetProjectIdsLinkedToTeamRequestSchema),
    LinkTeamToProject:createRPCEntry(LinkTeamToProjectRequestSchema),
    UnlinkTeamFromProject:createRPCEntry(UnlinkTeamFromProjectRequestSchema),
    GetWSAuthToken:createRPCEntry(BodyLessRequestSchema),
    VerifyEmail:createRPCEntry(VerifyEmailRequestSchema),
} as const
