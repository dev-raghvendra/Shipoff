import { dbService } from "@/db/db-service";
import {optionalArray, optionalObject, optionalString, optNumWithDefaultValue, RequestMetaSchema, UserSchema} from "@shipoff/types"
import z from "zod";

export const EnvVarsSchema = z.object({
    name:z.string().min(1),
    value:z.string().min(1),
}).strict()


const domainRegex = /^(?:$|(?!-)[a-z0-9-]+on\.shipoff\.in)$/

const DomainSchema = z.string().regex(domainRegex, {
  message: "Domain must be in the format: somethingon.shipoff.in (only lowercase letters, digits, and dashes allowed)"
});

export const CreateProjectRequestSchema = z.object({
     authUserData  : UserSchema,
     name:z.string().min(1) ,
     description:optionalString(),
     frameworkId : z.string().min(1),
     buildCommand:z.string().min(1),
     prodCommand:optionalString(),
     branch:z.string().min(1),
     domain:DomainSchema.min(1),
     githubRepoId:z.string().min(1),
     githubRepoURI:z.url(),
     githubRepoFullName:z.string().min(1),
     outDir:z.string().min(2),
     rootDir:z.string().min(1),
     environmentVars:optionalArray(EnvVarsSchema.shape),
     reqMeta:RequestMetaSchema
}).strict()

export const GetProjectRequestSchema = z.object({
    authUserData: UserSchema,
    projectId: z.string(),
    reqMeta:RequestMetaSchema
}).strict();

export const GetAllUserProjectsRequestSchema = z.object({
    authUserData: UserSchema,
    skip: optNumWithDefaultValue(0),
    limit: optNumWithDefaultValue(5),
    reqMeta:RequestMetaSchema
}).strict();


export const updatesSchema = z.object({
    name: optionalString(),
    domain: DomainSchema.transform(val=>val ? val.toLowerCase() : undefined).optional(),
    prodCommand: optionalString(),
    buildCommand: optionalString(),
    framework:optionalObject({
        frameworkId: z.string().min(2),
        buildCommand: z.string().min(2),
        prodCommand: z.string().min(2),
    }),
    outDir: optionalString()
}).strict();


export const CheckDomainAvailabilityRequestSchema = z.object({
    domain: DomainSchema,
    authUserData: UserSchema,
    reqMeta:RequestMetaSchema
}).strict();

export const UpdateProjectRequestSchema = z.object({
    authUserData: UserSchema,
    projectId: z.string(),
    updates: updatesSchema,
    reqMeta:RequestMetaSchema
}).strict();

export const DeleteProjectRequestSchema = z.object({
    authUserData: UserSchema,
    projectId: z.string(),
    reqMeta:RequestMetaSchema
}).strict();

export const UpsertEnvVarsRequestSchema = z.object({
    authUserData: UserSchema,
    projectId: z.string(),
    envs:z.array(EnvVarsSchema).min(1),
    reqMeta:RequestMetaSchema
}).strict();

export const GetEnvVarsRequestSchema = z.object({
    authUserData: UserSchema,
    projectId: z.string(),
    reqMeta:RequestMetaSchema
}).strict();

export const IGetProjectRequestSchema = z.object({
    projectId:optionalString(),
    domain:optionalString(),
    reqMeta:RequestMetaSchema
}).refine(data=>Object.keys(data).length >= 2,{
    error:"Either projectId or domain is required"
}).strict();

export const IDeleteStaleEnvironmentsRequestSchema = z.object({
    environmentIds: z.array(z.string().min(1)).min(1),
    reqMeta:RequestMetaSchema
}).strict();

export const GetProjectsLinkedToTeamRequestSchema = z.object({
    authUserData: UserSchema,
    teamId: z.string().min(1),
    reqMeta:RequestMetaSchema
}).strict();

export const DeleteEnvVarsRequestSchema = z.object({
    authUserData: UserSchema,
    projectId: z.string(),
    envVarKeys: z.array(z.string().min(1)).min(1),
    reqMeta:RequestMetaSchema
}).strict();

export type GetProjectsLinkedToTeamRequestBodyType = z.infer<typeof GetProjectsLinkedToTeamRequestSchema>;
export type GetProjectsLinkedToTeamRequestDBBodyType = Omit<GetProjectsLinkedToTeamRequestBodyType, "authUserData" | "reqMeta">;
export type CheckDomainAvailabilityRequestBodyType = z.infer<typeof CheckDomainAvailabilityRequestSchema>;
export type CheckDomainAvailabilityRequestDBBodyType = Omit<CheckDomainAvailabilityRequestBodyType, "authUserData" | "reqMeta">;



export type IGetProjectRequestBodyType = Required<z.infer<typeof IGetProjectRequestSchema>>;
export type GetAllUserProjectRequestBodyType = z.infer<typeof GetAllUserProjectsRequestSchema>;
export type GetAllUserProjectRequestDBBodyType = Omit<GetAllUserProjectRequestBodyType, "authUserData" | "reqMeta">;
export type DeleteProjectRequestBodyType = z.infer<typeof DeleteProjectRequestSchema>;
export type DeleteProjectRequestDBBodyType = Omit<DeleteProjectRequestBodyType, "authUserData" | "reqMeta">;
export type UpdateProjectRequestBodyType = z.infer<typeof UpdateProjectRequestSchema>;
export type UpdateProjectRequestDBBodyType = z.infer<typeof updatesSchema> & {
    projectId: string;
}
export type GetProjectRequestBodyType = z.infer<typeof GetProjectRequestSchema>;
export type GetProjectRequestDBBodyType = Omit<GetProjectRequestBodyType, "authUserData" | "reqMeta">;
export type CreateProjectRequestBodyType = z.infer<typeof CreateProjectRequestSchema>;
export type CreateProjectRequestDBBodyType = Omit<CreateProjectRequestBodyType & {
    githubInstallationId:string,
}, "authUserData" | "reqMeta">

export type UpsertEnvVarsRequestBodyType = z.infer<typeof UpsertEnvVarsRequestSchema>;
export type UpsertEnvVarsRequestDBBodyType = Omit<UpsertEnvVarsRequestBodyType, "authUserData" | "reqMeta">;
export type DeleteEnvVarsRequestBodyType = z.infer<typeof DeleteEnvVarsRequestSchema>;
export type DeleteEnvVarsRequestDBBodyType = Omit<DeleteEnvVarsRequestBodyType, "authUserData" | "reqMeta">;
export type GetEnvVarsRequestBodyType = z.infer<typeof GetEnvVarsRequestSchema>;
export type GetEnvVarsRequestDBBodyType = Omit<GetEnvVarsRequestBodyType, "authUserData" | "reqMeta">;
export type IDeleteStaleEnvironmentsRequestBodyType = z.infer<typeof IDeleteStaleEnvironmentsRequestSchema>;
