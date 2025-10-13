import { RequestMetaSchema, UserSchema } from "@shipoff/types";
import z from "zod";
import { TransferOwnershipBase } from "./utility";


export const ProjectRoles = z.enum(['PROJECT_OWNER', 'PROJECT_ADMIN', 'PROJECT_VIEWER','PROJECT_DEVELOPER']);

export const ProjectMemberInvitationRequestSchema = z.object({
  userId: z.string(),
  role: ProjectRoles,
  projectId: z.string(),
  authUserData: UserSchema,
  reqMeta: RequestMetaSchema
}).strict();

export const GetProjectMemberRequestSchema = z.object({
  targetUserId: z.string(),
  projectId: z.string(),
  authUserData: UserSchema,
  reqMeta: RequestMetaSchema
}).strict();

export const DeleteProjectMemberRequestSchema = z.object({
  targetUserId: z.string(),
  projectId: z.string(),
  authUserData: UserSchema,
  reqMeta: RequestMetaSchema
}).strict();

export const CreateTeamLinkRequestSchema = z.object({
  projectId: z.string(),
  teamId: z.string(),
  authUserData: UserSchema,
  reqMeta: RequestMetaSchema
}).strict();

export const TransferProjectOwnershipRequestSchema = TransferOwnershipBase.extend({
   projectId:z.string().min(4)
}).strict()
export type ProjectRoleType = z.infer<typeof ProjectRoles>;

export type ProjectMemberInvitationRequestBodyType = z.infer<typeof ProjectMemberInvitationRequestSchema>;
export type ProjectMemberInvitationRequestDBBodyType = Omit<ProjectMemberInvitationRequestBodyType, "authUserData" | "reqMeta">;

export type GetProjectMemberRequestBodyType = z.infer<typeof GetProjectMemberRequestSchema>;
export type GetProjectMemberRequestDBBodyType = Omit<GetProjectMemberRequestBodyType, "authUserData" | "reqMeta">;

export type DeleteProjectMemberRequestBodyType = z.infer<typeof DeleteProjectMemberRequestSchema>;
export type DeleteProjectMemberRequestDBBodyType = Omit<DeleteProjectMemberRequestBodyType, "authUserData" | "reqMeta">;

export type CreateTeamLinkRequestBodyType = z.infer<typeof CreateTeamLinkRequestSchema>;
export type CreateTeamLinkRequestDBBodyType = Omit<CreateTeamLinkRequestBodyType, "authUserData" | "reqMeta">;

export type TransferProjectOwnershipRequestBodyType = z.infer<typeof TransferProjectOwnershipRequestSchema>;
export type TransferProjectOwnershipRequestDBBodyType = Omit<TransferProjectOwnershipRequestBodyType, "authUserData" | "reqMeta"> & {
  currentOwnerId: string
}

export type ProjectMemberDBBodyType = {
  role: ProjectRoleType,
  userId: string,
  projectId: string
};
