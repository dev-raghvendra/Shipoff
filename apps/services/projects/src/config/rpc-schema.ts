import { createRPCEntry, RPC_SCHEMA_T } from "@shipoff/services-commons";
import { DeleteDeploymentRequestSchema, GetAllDeploymentsRequestSchema, GetDeploymentRequestSchema, RedeployRequestSchema } from "@/types/deployments";
import { CheckDomainAvailabilityRequestSchema, CreateProjectRequestSchema, DeleteEnvVarsRequestSchema, DeleteProjectRequestSchema, GetAllUserProjectsRequestSchema, GetEnvVarsRequestSchema, GetProjectRequestSchema, GetProjectsLinkedToTeamRequestSchema, IGetProjectRequestSchema, UpdateProjectRequestSchema, UpsertEnvVarsRequestSchema } from "@/types/projects";
import { CreateRepositoryRequestSchema, DeleteRepositoryRequestSchema, GetGithubRepositoryAccessTokenRequestSchema, GetGithubRepositoryDetailsRequestSchema, GetRepositoryRequestSchema, GetUserGithubRepositoriesRequestSchema, UpdateRepositoryRequestSchema } from "@/types/repositories";

import { BodyLessRequestSchema, BulkResourceRequestSchema, InternalEmptyRequestSchema } from "@shipoff/types";
import { GetProjectsLinkedToTeamRequest, UnimplementedProjectsServiceService } from "@shipoff/proto";
import { CreateGithubInstallationRequestSchema, GithubWebhookRequestSchema } from "@/types/webhooks";
 

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
    GetFrameworks: createRPCEntry(BodyLessRequestSchema),
    GetGithubRepo: createRPCEntry(GetGithubRepositoryDetailsRequestSchema),
    GetUserGithubRepos: createRPCEntry(GetUserGithubRepositoriesRequestSchema),
    GithubWebhook: createRPCEntry(GithubWebhookRequestSchema),
    CreateGithubInstallation: createRPCEntry(CreateGithubInstallationRequestSchema),
    IGetGithubRepoAccessToken:createRPCEntry(GetGithubRepositoryAccessTokenRequestSchema),
    GetGithubInstallation: createRPCEntry(BodyLessRequestSchema),
    IGetProject: createRPCEntry(IGetProjectRequestSchema),
    IGetStaleEnvironmentIds: createRPCEntry(InternalEmptyRequestSchema),
    GetLatestDeployments: createRPCEntry(BulkResourceRequestSchema),
    GetLatestProjects: createRPCEntry(BulkResourceRequestSchema),
    GetProjectsLinkedToTeam: createRPCEntry(GetProjectsLinkedToTeamRequestSchema),
    CheckDomainAvailability: createRPCEntry(CheckDomainAvailabilityRequestSchema),
} as const;

