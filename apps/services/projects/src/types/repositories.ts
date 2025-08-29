import { z } from "zod";
import { optionalObject, optionalString, optNumWithDefaultValue, UserSchema } from "@shipoff/types";


export const GetRepositoryRequestSchema = z.object({
    authUserData: UserSchema,
    projectId: z.string().min(1),
}).strict();

export const CreateRepositoryRequestSchema = z.object({
    authUserData: UserSchema,
    projectId: z.string().min(1),
    githubRepoId:z.string().min(1),
    githubRepoFullName:z.string().min(1),
    branch:z.string().min(1),
    githubRepoURI:z.string().min(1)
}).strict();

export const DeleteRepositoryRequestSchema = z.object({
    authUserData: UserSchema,
    projectId: z.string().min(1),
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
    updates:RepositoryUpdatesSchema
}).strict()


export const GetGithubRepositoryAccessTokenRequestSchema = z.object({
    githubRepoId: z.string().min(1),
}).strict();



export const GetUserGithubRepositoriesRequestSchema = z.object({
    authUserData: UserSchema,
    skip: optNumWithDefaultValue(0),
    limit: optNumWithDefaultValue(10),
}).strict();
export const GetGithubRepositoryDetailsRequestSchema = z.object({
    authUserData: UserSchema,
    githubRepoId: z.string().min(1),
}).strict();



export type UpdateRepositoryRequestBodyType = z.infer<typeof UpdateRepositoryRequestSchema>;
export type UpdateRepositoryRequestDBBodyType = z.infer<typeof RepositoryUpdatesSchema> 
export type GetGithubRepositoryAccessTokenRequestBodyType = z.infer<typeof GetGithubRepositoryAccessTokenRequestSchema>;
export type GetGithubRepositoryDetailsRequestBodyType = z.infer<typeof GetGithubRepositoryDetailsRequestSchema>;
export type GetGithubRepositoryDetailsRequestDBBodyType = Omit<GetGithubRepositoryDetailsRequestBodyType, "authUserData">;
export type GetUserGithubRepositoriesRequestBodyType = z.infer<typeof GetUserGithubRepositoriesRequestSchema>;
export type GetUserGithubRepositoriesRequestDBBodyType = Omit<GetUserGithubRepositoriesRequestBodyType, "authUserData">;
export type GetRepositoryRequestBodyType = z.infer<typeof GetRepositoryRequestSchema>;
export type GetRepositoryRequestDBBodyType = Omit<GetRepositoryRequestBodyType, "authUserData">;
export type CreateRepositoryRequestBodyType = Omit<z.infer<typeof CreateRepositoryRequestSchema>,"githubRepoFullName" | "githubRepoURI">;
export type CreateRepositoryRequestDBBodyType = Omit<z.infer<typeof CreateRepositoryRequestSchema> & {githubInstallationId:string}, "authUserData">;
export type DeleteRepositoryRequestBodyType = z.infer<typeof DeleteRepositoryRequestSchema>;
export type DeleteRepositoryRequestDBBodyType = Omit<DeleteRepositoryRequestBodyType, "authUserData">;
