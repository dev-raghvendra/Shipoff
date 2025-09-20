import { RequestMetaSchema, UserSchema } from "@shipoff/types";
import z from "zod";


export const TeamSchema = z.object({
  teamName: z.string(),
  description: z.string().optional().nullable(),
}).strict();
export type TeamSchemaType = z.infer<typeof TeamSchema>;
export type TeamBody = z.infer<typeof TeamSchema>;


export const TeamRoles = z.enum(['TEAM_DEVELOPER','TEAM_ADMIN', 'TEAM_OWNER', 'TEAM_VIEWER', 'TEAM_DEVELOPER'])
export type TeamRoleType = z.infer<typeof TeamRoles>;

export const TeamMemberInvitationRequestSchema = z.object({
  teamId: z.string(),
  role: TeamRoles.exclude(["TEAM_OWNER"]),
  authUserData:UserSchema,
  reqMeta:RequestMetaSchema
}).strict();
export type TeamMemberInvitationRequestBodyType = z.infer<typeof TeamMemberInvitationRequestSchema>
export type TeamMemberInvitationRequestDBBodyType = Omit<TeamMemberInvitationRequestBodyType,"authUserData" | "reqMeta">

export const CreateTeamRequestSchema = z.object({
  teamName: z.string(),
  description: z.string(),
  authUserData:UserSchema,
  reqMeta:RequestMetaSchema
}).strict();
export type CreateTeamRequestBodyType = z.infer<typeof CreateTeamRequestSchema>;
export type CreateTeamRequestDBBodyType = Omit<CreateTeamRequestBodyType,"authUserData" | "reqMeta">

export const GetTeamRequestSchema = z.object({
  teamId: z.string(),
  authUserData:UserSchema,
  reqMeta:RequestMetaSchema
}).strict();
export type GetTeamRequestBodyType = z.infer<typeof GetTeamRequestSchema>
export type GetTeamRequestDBBodyType = Omit<GetTeamRequestBodyType,"authUserData" | "reqMeta">

export const DeleteTeamRequestSchema = z.object({
  teamId: z.string(),
  authUserData:UserSchema,
  reqMeta:RequestMetaSchema
}).strict();
export type DeleteTeamRequestBodyType = z.infer<typeof DeleteTeamRequestSchema>
export type DeleteTeamRequestDBBodyType = Omit<DeleteTeamRequestBodyType,"authUserData" | "reqMeta">

export const GetTeamMemberRequestSchema = z.object({
  targetUserId: z.string(),
  teamId:z.string(),
  authUserData:UserSchema,
  reqMeta:RequestMetaSchema
}).strict();
export type GetTeamMemberRequestBodyType = z.infer<typeof GetTeamMemberRequestSchema>
export type GetTeamMemberRequestDBBodyType =  Omit<GetTeamMemberRequestBodyType,"authUserData" | "reqMeta"> 

export const DeleteTeamMemberRequestSchema = z.object({
  targetUserId: z.string(),
  teamId:z.string(),
  authUserData:UserSchema,
  reqMeta:RequestMetaSchema
}).strict();
export type DeleteTeamMemberRequestBodyType = z.infer<typeof DeleteTeamMemberRequestSchema>
export type DeleteTeamMemberRequestDBBodyType = Omit<DeleteTeamMemberRequestBodyType,"authUserData" | "reqMeta"> 
export type TeamMemberDBBodyType = {
  role:TeamRoleType,
  userId:string,
  teamId:string
}



