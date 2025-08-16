import { createRPCEntry, RPC_SCHEMA_T } from "@shipoff/services-commons";
import { DeleteDeploymentRequestSchema, GetAllDeploymentsRequestSchema, GetDeploymentRequestSchema, RedeployRequestSchema } from "@/types/deployments";
import { CreateProjectRequestSchema, DeleteEnvVarsRequestSchema, DeleteProjectRequestSchema, GetAllUserProjectsRequestSchema, GetEnvVarsRequestSchema, GetProjectRequestSchema, UpdateProjectRequestSchema, UpsertEnvVarsRequestSchema } from "@/types/projects";
import { CreateRepositoryRequestSchema, DeleteRepositoryRequestSchema, GetGithubRepositoryAccessTokenRequestSchema, GetGithubRepositoryDetailsRequestSchema, GetRepositoryRequestSchema, GetUserGithubRepositoriesRequestSchema } from "@/types/repositories";

import { BodyLessRequestSchema, BulkResourceRequestSchema } from "@shipoff/types";
import { UnimplementedProjectsServiceService } from "@shipoff/proto";
import { CreateGithubInstallationRequestSchema, GithubWebhookSchema } from "@/types/webhooks";
 

export type RPCs = keyof typeof UnimplementedProjectsServiceService.definition;
  
export const RPC_SCHEMA: RPC_SCHEMA_T<RPCs> = {
    CreateProject: createRPCEntry(CreateProjectRequestSchema),
    GetProject: createRPCEntry(GetProjectRequestSchema),
    GetAllUserProjects: createRPCEntry(GetAllUserProjectsRequestSchema),
    UpdateProject: createRPCEntry(UpdateProjectRequestSchema),
    DeleteProject: createRPCEntry(DeleteProjectRequestSchema),
    GetDeployment: createRPCEntry(GetDeploymentRequestSchema),
    GetAllDeployments: createRPCEntry(GetAllDeploymentsRequestSchema),
    DeleteDeployment: createRPCEntry(DeleteDeploymentRequestSchema),
    Redeploy: createRPCEntry(RedeployRequestSchema),
    UpsertEnvVars: createRPCEntry(UpsertEnvVarsRequestSchema),
    DeleteEnvVars: createRPCEntry(DeleteEnvVarsRequestSchema),
    GetEnvVars: createRPCEntry(GetEnvVarsRequestSchema),
    GetRepository: createRPCEntry(GetRepositoryRequestSchema),
    CreateRepository: createRPCEntry(CreateRepositoryRequestSchema),
    DeleteRepository: createRPCEntry(DeleteRepositoryRequestSchema),
    GetFrameworks: createRPCEntry(BulkResourceRequestSchema),
    GetGithubRepo: createRPCEntry(GetGithubRepositoryDetailsRequestSchema),
    GetUserGithubRepos: createRPCEntry(GetUserGithubRepositoriesRequestSchema),
    GithubWebhook: createRPCEntry(GithubWebhookSchema),
    CreateGithubInstallation: createRPCEntry(CreateGithubInstallationRequestSchema),
    GetGithubRepoAccessToken:createRPCEntry(GetGithubRepositoryAccessTokenRequestSchema),
    GetGithubInstallation: createRPCEntry(BodyLessRequestSchema),
} as const;

