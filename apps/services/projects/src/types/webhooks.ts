import { RequestMetaSchema, UserSchema } from "@shipoff/types";
import z from "zod";
export const GithubWebhookEvent = z.enum([
    "push",
    "repository",
    "installation",
    "installation_repositories"
]);

export interface DeploymentWebhookPayload {
  ref:string;
  head_commit: {
    message: string; 
    id:string;
    author: {
      name: string; 
      email: string;
    };
  } | null;
  repository: {
    id: number;
  };
}


export const GithubWebhookRequestSchema = z.object({
    payload: z.string().min(10),
    signature: z.string().min(10),
    eventType: GithubWebhookEvent,
    reqMeta: RequestMetaSchema
}).strict();

export const CreateGithubInstallationRequestSchema = z.object({
    authUserData: UserSchema,
    installation_id: z.string().min(5),
    reqMeta: RequestMetaSchema
}).strict();

export type CreateGithubInstallationRequestBodyType = z.infer<typeof CreateGithubInstallationRequestSchema>;
export type GithubWebhookRequestBodyType = z.infer<typeof GithubWebhookRequestSchema>;
