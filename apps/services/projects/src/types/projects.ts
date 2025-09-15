import {optionalArray, optionalObject, optionalString, optNumWithDefaultValue, UserSchema} from "@shipoff/types"
import z from "zod";

export const EnvVarsSchema = z.object({
    name:z.string(),
    value:z.string(),
})

export const CreateProjectRequestSchema = z.object({
     authUserData  : UserSchema,
     name:z.string().min(1) ,
     frameworkId : z.string().min(1),
     buildCommand:z.string().min(1),
     prodCommand:optionalString(),
     branch:z.string().min(1),
     domain:z.string().min(1),
     githubRepoId:z.string().min(1),
     githubRepoURI:z.url(),
     githubRepoFullName:z.string().min(1),
     outDir:z.string().min(2),
     environmentVars:optionalArray(EnvVarsSchema)
}).strict();

export const GetProjectRequestSchema = z.object({
    authUserData: UserSchema,
    projectId: z.string(),
}).strict();

export const GetAllUserProjectsRequestSchema = z.object({
    authUserData: UserSchema,
    skip: optNumWithDefaultValue(0),
    limit: optNumWithDefaultValue(5)
}).strict();


export const updatesSchema = z.object({
    name: optionalString(),
    domain: optionalString(),
    prodCommand: optionalString(),
    buildCommand: optionalString(),
    framework:optionalObject({
        frameworkId: z.string().min(2),
        buildCommand: z.string().min(2),
        prodCommand: z.string().min(2),
    }),
    outDir: optionalString()
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
    envs:optionalArray(z.object({
        name: z.string(),
        value: z.string(),
    })),
}).strict();

export const DeleteEnvVarsRequestSchema = z.object({
    authUserData: UserSchema,
    projectId: z.string(),
    name: z.string(),
}).strict();

export const GetEnvVarsRequestSchema = z.object({
    authUserData: UserSchema,
    projectId: z.string(),
}).strict();

export const IGetProjectRequestSchema = z.object({
    projectId: z.string()
}).strict();


export type IGetProjectRequestBodyType = z.infer<typeof IGetProjectRequestSchema>;
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
    githubInstallationId:string,
}, "authUserData">

export type UpsertEnvVarsRequestBodyType = z.infer<typeof UpsertEnvVarsRequestSchema>;
export type UpsertEnvVarsRequestDBBodyType = Omit<UpsertEnvVarsRequestBodyType, "authUserData">;
export type DeleteEnvVarsRequestBodyType = z.infer<typeof DeleteEnvVarsRequestSchema>;
export type DeleteEnvVarsRequestDBBodyType = Omit<DeleteEnvVarsRequestBodyType, "authUserData">;
export type GetEnvVarsRequestBodyType = z.infer<typeof GetEnvVarsRequestSchema>;
export type GetEnvVarsRequestDBBodyType = Omit<GetEnvVarsRequestBodyType, "authUserData">;
