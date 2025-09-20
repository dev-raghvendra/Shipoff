import { Server, ServerCredentials } from "@grpc/grpc-js";
import { ProjectsHandlers } from "@/handlers/projects.handlers";
import { GithubHandlers } from "@/handlers/github.handlers";
import { DeploymentsHandlers } from "@/handlers/deployments.handlers";
import { GithubWebhookHandlers } from "@/handlers/github-webhook.handlers";
import { RepositoriesHandlers } from "@/handlers/repositories.handlers";
import { createValidator } from "@shipoff/services-commons";
import { UnimplementedProjectsServiceService } from "@shipoff/proto";
import { RPC_SCHEMA } from "@/config/rpc-schema";
import { SECRETS } from "@/config/secrets";
import {logger} from "@/libs/winston";
import { ContainerConsumer } from "@/consumer/container.consumer";

const validateRPCBody = createValidator(RPC_SCHEMA,logger);    
const server = new Server();
const projectsHandlers = new ProjectsHandlers();
const deploymentsHandlers = new DeploymentsHandlers();
const githubWebhookHandlers = new GithubWebhookHandlers();
const repositoriesHandlers = new RepositoriesHandlers();
const githubHandlers = new GithubHandlers();
const containerConsumer = new ContainerConsumer("PROJECT_SERVICE");


server.addService(UnimplementedProjectsServiceService.definition, {
    CreateProject: validateRPCBody("CreateProject", projectsHandlers.handleCreateProject.bind(projectsHandlers)),
    GetProject: validateRPCBody("GetProject", projectsHandlers.handleGetProject.bind(projectsHandlers)),
    DeleteProject: validateRPCBody("DeleteProject", projectsHandlers.handleDeleteProject.bind(projectsHandlers)),
    GetAllUserProjects: validateRPCBody("GetAllUserProjects", projectsHandlers.handleGetAllUserProjects.bind(projectsHandlers)),
    UpdateProject: validateRPCBody("UpdateProject", projectsHandlers.handleUpdateProject.bind(projectsHandlers)),

    GetRepository: validateRPCBody("GetRepository", repositoriesHandlers.handleGetRepository.bind(repositoriesHandlers)),
    CreateRepository: validateRPCBody("CreateRepository", repositoriesHandlers.handleCreateRepository.bind(repositoriesHandlers)),
    DeleteRepository: validateRPCBody("DeleteRepository", repositoriesHandlers.handleDeleteUniqueRepository.bind(repositoriesHandlers)),

    GetGithubRepo: validateRPCBody("GetGithubRepo", githubHandlers.handleGetGithubRepo.bind(githubHandlers)),
    GetUserGithubRepos: validateRPCBody("GetUserGithubRepos", githubHandlers.handleGetUserGithubRepositories.bind(githubHandlers)),

    GetDeployment: validateRPCBody("GetDeployment", deploymentsHandlers.handleGetDeployment.bind(deploymentsHandlers)),
    GetAllDeployments: validateRPCBody("GetAllDeployments", deploymentsHandlers.handleGetAllDeployments.bind(deploymentsHandlers)),
    DeleteDeployment: validateRPCBody("DeleteDeployment", deploymentsHandlers.handleDeleteDeployment.bind(deploymentsHandlers)),
    Redeploy: validateRPCBody("Redeploy", deploymentsHandlers.handleRedeploy.bind(deploymentsHandlers)),

    UpsertEnvVars: validateRPCBody("UpsertEnvVars", projectsHandlers.handleUpsertProjectEnvironmentVariables.bind(projectsHandlers)),
    DeleteEnvVars: validateRPCBody("DeleteEnvVars", projectsHandlers.handleDeleteProjectEnvironmentVariables.bind(projectsHandlers)),
    GetEnvVars: validateRPCBody("GetEnvVars", projectsHandlers.handleGetProjectEnvironmentVariables.bind(projectsHandlers)),
    GetFrameworks: validateRPCBody("GetFrameworks", projectsHandlers.handleGetFrameworks.bind(projectsHandlers)),
    IGetProject: validateRPCBody("IGetProject", projectsHandlers.handleIGetProject.bind(projectsHandlers)),
    GithubWebhook: validateRPCBody("GithubWebhook", githubWebhookHandlers.handleGithubWebhook.bind(githubWebhookHandlers)),
    CreateGithubInstallation: validateRPCBody("CreateGithubInstallation", githubHandlers.handleCreateGithubInstallation.bind(githubHandlers)),
    GetGithubInstallation:validateRPCBody("GetGithubInstallation", githubHandlers.handleGetGithubInstallation.bind(githubHandlers)),
    IGetGithubRepoAccessToken: validateRPCBody("IGetGithubRepoAccessToken", githubHandlers.handleIGithubRepoAccessToken.bind(githubHandlers))
});

containerConsumer.startConsumer().then(() => {
    logger.info("CONTAINER_CONSUMER_STARTED");
}).catch((err) => {
    logger.error(`ERROR_STARTING_CONTAINER_CONSUMER: ${JSON.stringify(err, null, 2)}`);
});

server.bindAsync(`${SECRETS.HOST}:${SECRETS.PORT}`,ServerCredentials.createInsecure(),(err)=>{
    if (err) {
        logger.error(`ERROR_STARTING_PROJECT_GRPC_SERVER: ${err}`)
        process.exit(1);
    }
      logger.info(`PROJECT_GRPC_SERVER_LISTENING_ON ${SECRETS.HOST}:${SECRETS.PORT}`)
})


process.on("uncaughtException", (err) => {
    logger.error(`UNCAUGHT_EXCEPTION_AT_PROJECTS_SERVICE: ${err.message}`);
});

process.on("unhandledRejection", (reason) => {
    logger.error(`UNHANDLED_REJECTION_AT_PROJECTS_SERVICE: ${reason}`);
});

process.on("SIGINT", () => {
    logger.info("PROJECTS_SERVICE_STOPPED");
    server.tryShutdown(() => process.exit(0));
});


