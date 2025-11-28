import { DeploymentStatus } from "@prisma/index";
import { InternalEmptyRequestSchema, optNumWithDefaultValue, RequestMetaSchema, UserSchema } from "@shipoff/types";
import z from "zod";

export const GetDeploymentRequestSchema = z.object({
    authUserData: UserSchema,
    projectId: z.string().min(1),
    deploymentId: z.string().min(1),
    reqMeta:RequestMetaSchema
}).strict();

export const GetAllDeploymentsRequestSchema = z.object({
    authUserData: UserSchema,
    projectId: z.string().min(1),
    skip: optNumWithDefaultValue(0),
    limit: optNumWithDefaultValue(10),
    reqMeta:RequestMetaSchema
}).strict();

export const DeleteDeploymentRequestSchema = z.object({
    authUserData: UserSchema,
    projectId: z.string().min(1),
    deploymentId: z.string().min(1),
    reqMeta:RequestMetaSchema
}).strict();

export const RedeployRequestSchema = z.object({
    authUserData: UserSchema,
    projectId: z.string().min(1),
    deploymentId: z.string().min(1),
    reqMeta:RequestMetaSchema
}).strict();

export const CreateDeploymentRequestSchema = z.object({
    payload: z.string().min(10),
    signature: z.string().min(10),
    reqMeta:RequestMetaSchema
}).strict();

export const DeploymentDBSchema = z.object({
    projectId:z.string().min(1),
    commitHash:z.string().min(1),
    status:z.enum(DeploymentStatus).default(DeploymentStatus.QUEUED),
    commitMessage:z.string().min(1),
    author:z.string().min(1),
    repositoryId:z.string().min(1),
    production:z.boolean().optional()
}).strict();


export const IGetLastDeploymentRequestSchema = InternalEmptyRequestSchema.extend({
    projectId: z.string().min(1),
}).strict();

export const IGetDeploymentRequestSchema = InternalEmptyRequestSchema.extend({
    deploymentId: z.string().min(1),
}).strict();

export type IGetLastDeploymentRequestBodyType = z.infer<typeof IGetLastDeploymentRequestSchema>;
export type IGetDeploymentRequestBodyType = z.infer<typeof IGetDeploymentRequestSchema>;
export type CreateDeploymentRequestBodyType = z.infer<typeof CreateDeploymentRequestSchema>;
export type CreateDeploymentRequestDBBodyType = z.infer<typeof DeploymentDBSchema> & {lastDeployedAt?:Date}
export type RedeployRequestBodyType = z.infer<typeof RedeployRequestSchema>;
export type RedeployRequestDBBodyType = Omit<RedeployRequestBodyType, "authUserData"|"reqMeta">;
export type DeleteDeploymentRequestBodyType = z.infer<typeof DeleteDeploymentRequestSchema>;
export type DeleteDeploymentRequestDBBodyType = Omit<DeleteDeploymentRequestBodyType, "authUserData" | "reqMeta">;
export type GetAllDeploymentsRequestBodyType = z.infer<typeof GetAllDeploymentsRequestSchema>;
export type GetAllDeploymentsRequestDBBodyType = Omit<GetAllDeploymentsRequestBodyType, "authUserData" | "reqMeta">;
export type GetDeploymentRequestBodyType = z.infer<typeof GetDeploymentRequestSchema>;
export type GetDeploymentRequestDBBodyType = Omit<GetDeploymentRequestBodyType, "authUserData" | "reqMeta">;