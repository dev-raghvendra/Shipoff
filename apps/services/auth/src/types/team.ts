import { RequestMetaSchema, UserSchema } from "@shipoff/types";
import z from "zod";
import { TransferOwnershipBase } from "./utility";


export const TeamSchema = z.object({
  teamName: z.string(),
  description: z.string().optional().nullable(),
}).strict();

export const TeamRoles = z.enum(['TEAM_DEVELOPER','TEAM_ADMIN', 'TEAM_OWNER', 'TEAM_VIEWER']);

export const TeamMemberInvitationRequestSchema = z.object({
  teamId: z.string().min(4),
  role: TeamRoles.exclude(["TEAM_OWNER"]),
  authUserData: UserSchema,
  reqMeta: RequestMetaSchema
}).strict();

export const CreateTeamRequestSchema = z.object({
  teamName: z.string(),
  description: z.string(),
  authUserData: UserSchema,
  reqMeta: RequestMetaSchema
}).strict();

export const GetTeamRequestSchema = z.object({
  teamId: z.string(),
  authUserData: UserSchema,
  reqMeta: RequestMetaSchema
}).strict();

export const DeleteTeamRequestSchema = z.object({
  teamId: z.string(),
  authUserData: UserSchema,
  reqMeta: RequestMetaSchema
}).strict();

export const GetTeamMemberRequestSchema = z.object({
  targetUserId: z.string(),
  teamId: z.string(),
  authUserData: UserSchema,
  reqMeta: RequestMetaSchema
}).strict();

export const DeleteTeamMemberRequestSchema = z.object({
  targetUserId: z.string(),
  teamId: z.string(),
  authUserData: UserSchema,
  reqMeta: RequestMetaSchema
}).strict();

export const TransferTeamOwnershipRequestSchema = TransferOwnershipBase.extend({
   teamId:z.string().min(4)
}).strict()


export type TeamSchemaType = z.infer<typeof TeamSchema>;
export type TeamBody = z.infer<typeof TeamSchema>;

export type TeamRoleType = z.infer<typeof TeamRoles>;

export type TeamMemberInvitationRequestBodyType = z.infer<typeof TeamMemberInvitationRequestSchema>;
export type TeamMemberInvitationRequestDBBodyType = Omit<TeamMemberInvitationRequestBodyType, "authUserData" | "reqMeta">;

export type CreateTeamRequestBodyType = z.infer<typeof CreateTeamRequestSchema>;
export type CreateTeamRequestDBBodyType = Omit<CreateTeamRequestBodyType, "authUserData" | "reqMeta">;

export type GetTeamRequestBodyType = z.infer<typeof GetTeamRequestSchema>;
export type GetTeamRequestDBBodyType = Omit<GetTeamRequestBodyType, "authUserData" | "reqMeta">;

export type DeleteTeamRequestBodyType = z.infer<typeof DeleteTeamRequestSchema>;
export type DeleteTeamRequestDBBodyType = Omit<DeleteTeamRequestBodyType, "authUserData" | "reqMeta">;

export type GetTeamMemberRequestBodyType = z.infer<typeof GetTeamMemberRequestSchema>;
export type GetTeamMemberRequestDBBodyType = Omit<GetTeamMemberRequestBodyType, "authUserData" | "reqMeta">;

export type DeleteTeamMemberRequestBodyType = z.infer<typeof DeleteTeamMemberRequestSchema>;
export type DeleteTeamMemberRequestDBBodyType = Omit<DeleteTeamMemberRequestBodyType, "authUserData" | "reqMeta">;

export type TransferTeamOwnershipRequestBodyType = z.infer<typeof TransferTeamOwnershipRequestSchema>;
export type TransferTeamOwnershipRequestDBBodyType = Omit<TransferTeamOwnershipRequestBodyType, "authUserData" | "reqMeta"> & {
  currentOwnerId: string
}

export type TeamMemberDBBodyType = {
  role: TeamRoleType,
  userId: string,
  teamId: string
};
