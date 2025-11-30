import { Server, ServerCredentials } from "@grpc/grpc-js";
import { ProjectsHandlers } from "@/handlers/projects.handlers";
import { GithubHandlers } from "@/handlers/github.handlers";
import { DeploymentsHandlers } from "@/handlers/deployments.handlers";
import { GithubWebhookHandlers } from "@/handlers/github-webhook.handlers";
import { RepositoriesHandlers } from "@/handlers/repositories.handlers";
import { createSyncErrHandler, createUnaryValidator } from "@shipoff/services-commons";
import { UnimplementedProjectsServiceService } from "@shipoff/proto";
import { RPC_SCHEMA } from "@/config/rpc-schema";
import { SECRETS } from "@/config/secrets";
import {logger} from "@/libs/winston";
import { ContainerConsumer } from "@/consumer/container.consumer";

const validateRPCBody = createUnaryValidator(RPC_SCHEMA,logger);    
const server = new Server({
    'grpc.max_connection_idle_ms':10*60*1000,
    'grpc.keepalive_time_ms':60*1000,
    'grpc.keepalive_timeout_ms':20*1000,
});
const projectsHandlers = new ProjectsHandlers();
const deploymentsHandlers = new DeploymentsHandlers();
const githubWebhookHandlers = new GithubWebhookHandlers();
const repositoriesHandlers = new RepositoriesHandlers();
const githubHandlers = new GithubHandlers();
const containerConsumer = new ContainerConsumer("PROJECT_SERVICE");
const errHandler = createSyncErrHandler({ subServiceName: "PROJECTS_SERVER", logger });


server.addService(UnimplementedProjectsServiceService.definition, {
    CreateProject: validateRPCBody("CreateProject", projectsHandlers.handleCreateProject.bind(projectsHandlers)),
    GetProject: validateRPCBody("GetProject", projectsHandlers.handleGetProject.bind(projectsHandlers)),
    DeleteProject: validateRPCBody("DeleteProject", projectsHandlers.handleDeleteProject.bind(projectsHandlers)),
    GetAllUserProjects: validateRPCBody("GetAllUserProjects", projectsHandlers.handleGetAllUserProjects.bind(projectsHandlers)),
    GetLatestProjects: validateRPCBody("GetLatestProjects", projectsHandlers.handleGetLatestProjects.bind(projectsHandlers)),
    UpdateProject: validateRPCBody("UpdateProject", projectsHandlers.handleUpdateProject.bind(projectsHandlers)),
    GetProjectsLinkedToTeam: validateRPCBody("GetProjectsLinkedToTeam", projectsHandlers.handleGetProjectsLinkedToTeam.bind(projectsHandlers)),
    CheckDomainAvailability: validateRPCBody("CheckDomainAvailability", projectsHandlers.handleCheckDomainAvailability.bind(projectsHandlers)),
    LinkRepository: validateRPCBody("LinkRepository", repositoriesHandlers.handleLinkRepository.bind(repositoriesHandlers)),
    UnlinkRepository: validateRPCBody("UnlinkRepository", repositoriesHandlers.handleUnlinkRepository.bind(repositoriesHandlers)),

    GetGithubRepo: validateRPCBody("GetGithubRepo", githubHandlers.handleGetGithubRepo.bind(githubHandlers)),
    GetUserGithubRepos: validateRPCBody("GetUserGithubRepos", githubHandlers.handleGetUserGithubRepositories.bind(githubHandlers)),

    GetDeployment: validateRPCBody("GetDeployment", deploymentsHandlers.handleGetDeployment.bind(deploymentsHandlers)),
    GetAllDeployments: validateRPCBody("GetAllDeployments", deploymentsHandlers.handleGetAllDeployments.bind(deploymentsHandlers)),
    GetLatestDeployments: validateRPCBody("GetLatestDeployments", deploymentsHandlers.handleGetLatestDeployments.bind(deploymentsHandlers)),
    DeleteDeployment: validateRPCBody("DeleteDeployment", deploymentsHandlers.handleDeleteDeployment.bind(deploymentsHandlers)),
    Redeploy: validateRPCBody("Redeploy", deploymentsHandlers.handleRedeploy.bind(deploymentsHandlers)),

    UpsertEnvVars: validateRPCBody("UpsertEnvVars", projectsHandlers.handleUpsertProjectEnvironmentVariables.bind(projectsHandlers)),
    DeleteEnvVars: validateRPCBody("DeleteEnvVars", projectsHandlers.handleDeleteProjectEnvironmentVariables.bind(projectsHandlers)),
    GetEnvVars: validateRPCBody("GetEnvVars", projectsHandlers.handleGetProjectEnvironmentVariables.bind(projectsHandlers)),
    GetFrameworks: validateRPCBody("GetFrameworks", projectsHandlers.handleGetFrameworks.bind(projectsHandlers)),
    GithubWebhook: validateRPCBody("GithubWebhook", githubWebhookHandlers.handleGithubWebhook.bind(githubWebhookHandlers)),
    CreateGithubInstallation: validateRPCBody("CreateGithubInstallation", githubHandlers.handleCreateGithubInstallation.bind(githubHandlers)),
    GetGithubInstallation:validateRPCBody("GetGithubInstallation", githubHandlers.handleGetGithubInstallation.bind(githubHandlers)),
    IGetProject: validateRPCBody("IGetProject", projectsHandlers.handleIGetProject.bind(projectsHandlers)),
    IGetGithubRepoAccessToken: validateRPCBody("IGetGithubRepoAccessToken", githubHandlers.handleIGithubRepoAccessToken.bind(githubHandlers)),
    IGetStaleEnvironmentIds: validateRPCBody("IGetStaleEnvironmentIds", projectsHandlers.handleIGetStaleEnvironmentIds.bind(projectsHandlers)),
    IGetDeployment:validateRPCBody("IGetDeployment", deploymentsHandlers.handleIGetDeployment.bind(deploymentsHandlers)),
    IGetLastDeployment:validateRPCBody("IGetLastDeployment",deploymentsHandlers.handleIGetLastDeployment.bind(deploymentsHandlers)),
});

containerConsumer.startConsumer().then(() => {
    logger.info("[rid:N/A]: CONTAINER_CONSUMER_STARTED");
}).catch((err) => {
    errHandler(err,"CONTAINER_CONSUMER_STARTUP","N/A");
});

server.bindAsync(`${SECRETS.HOST}:${SECRETS.PORT}`,ServerCredentials.createInsecure(),(err)=>{
    if (err) {
        errHandler(err,"PROJECT_GRPC_SERVER_BINDING","N/A");
        process.exit(1);
    }
      logger.info(`[rid:N/A]: PROJECT_GRPC_SERVER_LISTENING_ON ${SECRETS.HOST}:${SECRETS.PORT}`)
})


process.on("uncaughtException", (err) => {
    errHandler(err,"PROJECTS_SERVICE_UNCAUGHT_EXCEPTION","N/A");
});

process.on("unhandledRejection", (reason) => {
    errHandler(reason as any,"PROJECTS_SERVICE_UNHANDLED_REJECTION","N/A");
});

process.on("SIGINT", () => {
    server.tryShutdown(err=>{
        if(err) errHandler(err,"SIGINT_SERVER_CLOSE","N/A");
        logger.info("[rid:N/A]: PROJECTS_SERVICE_SHUTDOWN_GRACEFULLY");
        process.exit(0);
    })
});

process.on("SIGTERM", () => {
    server.tryShutdown(err=>{
        if(err) errHandler(err,"SIGTERM_SERVER_CLOSE","N/A");
        logger.info("[rid:N/A]: PROJECTS_SERVICE_SHUTDOWN_GRACEFULLY");
        process.exit(0);
    })
});

