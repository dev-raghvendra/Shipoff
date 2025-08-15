import {z} from "zod";
import {UserSchema} from "@shipoff/types";


export const GetRepositoryRequestSchema = z.object({
    authUserData: UserSchema,
    projectId: z.string(),
}).strict();

export const CreateRepositoryRequestSchema = z.object({
    authUserData: UserSchema,
    projectId: z.string().min(5),
    githubRepoId:z.string().min(4)
}).strict();

export const UpdateRepositoryRequestSchema = z.object({
    authUserData: UserSchema,
    projectId: z.string(),
    branch: z.string().optional(),
    frameworkId: z.string().optional(),
    buildCommand: z.string().optional(),
    productionCommand: z.string().optional(),
}).strict();

export const DeleteRepositoryRequestSchema = z.object({
    authUserData: UserSchema,
    projectId: z.string(),
}).strict();


export const GetGithubRepositoryAccessTokenRequestSchema = z.object({
    githubRepoId: z.string(),
}).strict();



export const GetUserGithubRepositoriesRequestSchema = z.object({
    authUserData: UserSchema,
    skip: z.number().int().nonnegative().optional().default(0),
    limit: z.number().int().nonnegative().min(1).optional().default(10),
}).strict();
export const GetGithubRepositoryDetailsRequestSchema = z.object({
    authUserData: UserSchema,
    githubRepoId: z.string(),
}).strict();

export type GetGithubRepositoryAccessTokenRequestBodyType = z.infer<typeof GetGithubRepositoryAccessTokenRequestSchema>;
export type GetGithubRepositoryDetailsRequestBodyType = z.infer<typeof GetGithubRepositoryDetailsRequestSchema>;
export type GetGithubRepositoryDetailsRequestDBBodyType = Omit<GetGithubRepositoryDetailsRequestBodyType, "authUserData">;
export type GetUserGithubRepositoriesRequestBodyType = z.infer<typeof GetUserGithubRepositoriesRequestSchema>;
export type GetUserGithubRepositoriesRequestDBBodyType = Omit<GetUserGithubRepositoriesRequestBodyType, "authUserData">;
export type GetRepositoryRequestBodyType = z.infer<typeof GetRepositoryRequestSchema>;
export type GetRepositoryRequestDBBodyType = Omit<GetRepositoryRequestBodyType, "authUserData">;
export type CreateRepositoryRequestBodyType = z.infer<typeof CreateRepositoryRequestSchema>;
export type CreateRepositoryRequestDBBodyType = Omit<CreateRepositoryRequestBodyType & {
    githubRepoURI:string,
    githubRepoName:string,
    githubInstallationId:string,
}, "authUserData">;
export type UpdateRepositoryRequestBodyType = z.infer<typeof UpdateRepositoryRequestSchema>;
export type UpdateRepositoryRequestDBBodyType = Omit<UpdateRepositoryRequestBodyType, "authUserData">;
export type DeleteRepositoryRequestBodyType = z.infer<typeof DeleteRepositoryRequestSchema>;
export type DeleteRepositoryRequestDBBodyType = Omit<DeleteRepositoryRequestBodyType, "authUserData">;
