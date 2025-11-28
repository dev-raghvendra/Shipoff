import { createRPCEntry, RPC_SCHEMA_T } from "@shipoff/services-commons";
import { DeleteDeploymentRequestSchema, GetAllDeploymentsRequestSchema, GetDeploymentRequestSchema, IGetDeploymentRequestSchema, IGetLastDeploymentRequestSchema, RedeployRequestSchema } from "@/types/deployments";
import { CheckDomainAvailabilityRequestSchema, CreateProjectRequestSchema, DeleteEnvVarsRequestSchema, DeleteProjectRequestSchema, GetAllUserProjectsRequestSchema, GetEnvVarsRequestSchema, GetProjectRequestSchema, GetProjectsLinkedToTeamRequestSchema, IGetProjectRequestSchema, UpdateProjectRequestSchema, UpsertEnvVarsRequestSchema } from "@/types/projects";
import { GetGithubRepositoryAccessTokenRequestSchema, GetGithubRepositoryDetailsRequestSchema,  GetUserGithubRepositoriesRequestSchema, LinkRepositoryRequestSchema, UnlinkRepositoryRequestSchema } from "@/types/repositories";

import { BodyLessRequestSchema, BulkResourceRequestSchema, InternalEmptyRequestSchema } from "@shipoff/types";
import { UnimplementedProjectsServiceService } from "@shipoff/proto";
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
    LinkRepository: createRPCEntry(LinkRepositoryRequestSchema),
    UnlinkRepository: createRPCEntry(UnlinkRepositoryRequestSchema),
    GetFrameworks: createRPCEntry(BodyLessRequestSchema),
    GetGithubRepo: createRPCEntry(GetGithubRepositoryDetailsRequestSchema),
    GetUserGithubRepos: createRPCEntry(GetUserGithubRepositoriesRequestSchema),
    GithubWebhook: createRPCEntry(GithubWebhookRequestSchema),
    CreateGithubInstallation: createRPCEntry(CreateGithubInstallationRequestSchema),
    GetGithubInstallation: createRPCEntry(BodyLessRequestSchema),
    IGetGithubRepoAccessToken:createRPCEntry(GetGithubRepositoryAccessTokenRequestSchema),
    IGetProject: createRPCEntry(IGetProjectRequestSchema),
    IGetStaleEnvironmentIds: createRPCEntry(InternalEmptyRequestSchema),
    IGetDeployment: createRPCEntry(IGetDeploymentRequestSchema),
    IGetLastDeployment: createRPCEntry(IGetLastDeploymentRequestSchema),
    GetLatestDeployments: createRPCEntry(BulkResourceRequestSchema),
    GetLatestProjects: createRPCEntry(BulkResourceRequestSchema),
    GetProjectsLinkedToTeam: createRPCEntry(GetProjectsLinkedToTeamRequestSchema),
    CheckDomainAvailability: createRPCEntry(CheckDomainAvailabilityRequestSchema),
} as const;

