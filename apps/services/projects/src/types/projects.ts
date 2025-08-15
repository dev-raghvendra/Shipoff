import z from "zod";
import {UserSchema} from "@shipoff/types"

export const EnvVarsSchema = z.object({
    envName:z.string(),
    envValue:z.string(),
})
export const CreateProjectRequestSchema = z.object({
     authUserData  : UserSchema,
     name:z.string() ,
     frameworkId : z.string(),
     buildCommand:z.string(),
     productionCommand:z.string().optional(),
     branch:z.string(),
     domain:z.string(),
     githubRepoId:z.string(),
     environmentVars:z.array(EnvVarsSchema).optional()
}).strict();


export const GetProjectRequestSchema = z.object({
    authUserData: UserSchema,
    projectId: z.string(),
}).strict();

export const GetAllUserProjectsRequestSchema = z.object({
    authUserData: UserSchema,
    skip: z.number().int().nonnegative().optional().default(0),
    limit: z.number().int().nonnegative().min(1).optional().default(10),
}).strict();

export const updatesSchema = z.object({
    name: z.string().min(2).optional(),
    domain: z.string().min(2).optional(),
    frameworkId: z.string().min(2).optional(),
    buildCommand: z.string().min(2).optional(),
    productionCommand: z.string().min(2).optional(),
    branch: z.string().min(2).optional(),
}).strict();
export const UpdateProjectRequestSchema = z.object({
    authUserData: UserSchema,
    projectId: z.string(),
    updates: updatesSchema
}).strict();

export const DeleteProjectRequestSchema = z.object({
    authUserData: UserSchema,
    projectId: z.string(),
}).strict();

export const UpsertEnvVarsRequestSchema = z.object({
    authUserData: UserSchema,
    projectId: z.string(),
    envVars: z.array(z.object({
        envName: z.string(),
        envValue: z.string(),
    })),
}).strict();

export const DeleteEnvVarsRequestSchema = z.object({
    authUserData: UserSchema,
    projectId: z.string(),
    envName: z.string(),
}).strict();

export const GetEnvVarsRequestSchema = z.object({
    authUserData: UserSchema,
    projectId: z.string(),
}).strict();


export type GetAllUserProjectRequestBodyType = z.infer<typeof GetAllUserProjectsRequestSchema>;
export type GetAllUserProjectRequestDBBodyType = Omit<GetAllUserProjectRequestBodyType, "authUserData">;
export type DeleteProjectRequestBodyType = z.infer<typeof DeleteProjectRequestSchema>;
export type DeleteProjectRequestDBBodyType = Omit<DeleteProjectRequestBodyType, "authUserData">;
export type UpdateProjectRequestBodyType = z.infer<typeof UpdateProjectRequestSchema>;
export type UpdateProjectRequestDBBodyType = z.infer<typeof updatesSchema> & {
    projectId: string;
}
export type GetProjectRequestBodyType = z.infer<typeof GetProjectRequestSchema>;
export type GetProjectRequestDBBodyType = Omit<GetProjectRequestBodyType, "authUserData">;
export type CreateProjectRequestBodyType = z.infer<typeof CreateProjectRequestSchema>;
export type CreateProjectRequestDBBodyType = Omit<CreateProjectRequestBodyType & {
    githubRepoURI:string,
    githubRepoName:string,
    githubInstallationId:string,
}, "authUserData">

export type UpsertEnvVarsRequestBodyType = z.infer<typeof UpsertEnvVarsRequestSchema>;
export type UpsertEnvVarsRequestDBBodyType = Omit<UpsertEnvVarsRequestBodyType, "authUserData">;
export type DeleteEnvVarsRequestBodyType = z.infer<typeof DeleteEnvVarsRequestSchema>;
export type DeleteEnvVarsRequestDBBodyType = Omit<DeleteEnvVarsRequestBodyType, "authUserData">;
export type GetEnvVarsRequestBodyType = z.infer<typeof GetEnvVarsRequestSchema>;
export type GetEnvVarsRequestDBBodyType = Omit<GetEnvVarsRequestBodyType, "authUserData">;