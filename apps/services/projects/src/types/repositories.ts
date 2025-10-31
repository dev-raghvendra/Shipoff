import { z } from "zod";
import { optionalObject, optionalString, optNumWithDefaultValue, RequestMetaSchema, UserSchema } from "@shipoff/types";


export const GetRepositoryRequestSchema = z.object({
    authUserData: UserSchema,
    projectId: z.string().min(1),
    reqMeta:RequestMetaSchema
}).strict();

export const CreateRepositoryRequestSchema = z.object({
    authUserData: UserSchema,
    projectId: z.string().min(1),
    githubRepoId:z.string().min(1),
    githubRepoFullName:z.string().min(1),
    branch:z.string().min(1),
    rootDir:z.string().min(1),
    githubRepoURI:z.string().min(1),
    reqMeta:RequestMetaSchema
}).strict();

export const DeleteRepositoryRequestSchema = z.object({
    authUserData: UserSchema,
    projectId: z.string().min(1),
    reqMeta:RequestMetaSchema
}).strict();

export const RepositoryUpdatesSchema = z.object({
    branch: optionalString(),
    github: optionalObject({
        githubRepoId: z.string().min(2),
        githubRepoURI: z.url(),
        githubRepoFullName: z.string().min(2)
    })
}).strict();    

export const UpdateRepositoryRequestSchema = z.object({
    authUserData:UserSchema,
    projectId:z.string(),
    updates:RepositoryUpdatesSchema,
    reqMeta:RequestMetaSchema
}).strict()


export const GetGithubRepositoryAccessTokenRequestSchema = z.object({
    githubRepoId: z.string().min(1),
    reqMeta:RequestMetaSchema
}).strict();



export const GetUserGithubRepositoriesRequestSchema = z.object({
    authUserData: UserSchema,
    skip: optNumWithDefaultValue(0),
    limit: optNumWithDefaultValue(10),
    reqMeta:RequestMetaSchema
}).strict();
export const GetGithubRepositoryDetailsRequestSchema = z.object({
    authUserData: UserSchema,
    githubRepoId: z.string().min(1),
    reqMeta:RequestMetaSchema
}).strict();



export type UpdateRepositoryRequestBodyType = z.infer<typeof UpdateRepositoryRequestSchema>;
export type UpdateRepositoryRequestDBBodyType = z.infer<typeof RepositoryUpdatesSchema> 
export type GetGithubRepositoryAccessTokenRequestBodyType = z.infer<typeof GetGithubRepositoryAccessTokenRequestSchema>;
export type GetGithubRepositoryDetailsRequestBodyType = z.infer<typeof GetGithubRepositoryDetailsRequestSchema>;
export type GetGithubRepositoryDetailsRequestDBBodyType = Omit<GetGithubRepositoryDetailsRequestBodyType, "authUserData" | "reqMeta">;
export type GetUserGithubRepositoriesRequestBodyType = z.infer<typeof GetUserGithubRepositoriesRequestSchema>;
export type GetUserGithubRepositoriesRequestDBBodyType = Omit<GetUserGithubRepositoriesRequestBodyType, "authUserData" | "reqMeta">;
export type GetRepositoryRequestBodyType = z.infer<typeof GetRepositoryRequestSchema>;
export type GetRepositoryRequestDBBodyType = Omit<GetRepositoryRequestBodyType, "authUserData" | "reqMeta">;
export type CreateRepositoryRequestBodyType = Omit<z.infer<typeof CreateRepositoryRequestSchema>,"githubRepoFullName" | "githubRepoURI">;
export type CreateRepositoryRequestDBBodyType = Omit<z.infer<typeof CreateRepositoryRequestSchema> & {githubInstallationId:string}, "authUserData" | "reqMeta">;
export type DeleteRepositoryRequestBodyType = z.infer<typeof DeleteRepositoryRequestSchema>;
export type DeleteRepositoryRequestDBBodyType = Omit<DeleteRepositoryRequestBodyType, "authUserData" | "reqMeta">;
