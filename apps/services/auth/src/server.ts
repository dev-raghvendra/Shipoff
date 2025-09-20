import { Server, ServerCredentials } from "@grpc/grpc-js";
import { UnimplementedAuthServiceService } from "@shipoff/proto";
import AuthHandlers from "@/handlers/auth.handler";
import {createValidator} from "@shipoff/services-commons"
import { RPC_SCHEMA } from "@/config/rpc-schema";
import TeamHandlers from "@/handlers/team.handler";
import ProjectHandlers from "@/handlers/project.handlers";
import SECRETS from "@/config/secrets";
import { ProjectConsumer } from "./consumer/project.consumer";
import { logger } from "./libs/winston";


const validateRPCBody = createValidator(RPC_SCHEMA,logger);
const server = new Server();
const authhandlers = new AuthHandlers();
const teamHandlers = new TeamHandlers();
const projectHandlers = new ProjectHandlers();
const projectConsumer = new ProjectConsumer();

server.addService(UnimplementedAuthServiceService.definition, {
    Login: validateRPCBody("Login", authhandlers.handleLogin.bind(authhandlers)),
    Signin: validateRPCBody("Signin", authhandlers.handleSignin.bind(authhandlers)),
    OAuth: validateRPCBody("OAuth", authhandlers.handleOAuth.bind(authhandlers)),
    GetUser: validateRPCBody("GetUser", authhandlers.handleGetUser.bind(authhandlers)),
    GetMe: validateRPCBody("GetMe", authhandlers.handleGetMe.bind(authhandlers)),
    RefreshToken: validateRPCBody("RefreshToken", authhandlers.handleRefreshToken.bind(authhandlers)),
    HasPermissions: validateRPCBody("HasPermissions", authhandlers.handleHasPermissions.bind(authhandlers)),

    CreateTeam: validateRPCBody("CreateTeam", teamHandlers.handleCreateTeam.bind(teamHandlers)),
    GetTeam: validateRPCBody("GetTeam", teamHandlers.handleGetTeam.bind(teamHandlers)),
    DeleteTeam: validateRPCBody("DeleteTeam", teamHandlers.handleDeleteTeam.bind(teamHandlers)),
    CreateTeamMemberInvitation: validateRPCBody("CreateTeamMemberInvitation", teamHandlers.handleCreateTeamMemberInvitation.bind(teamHandlers)),
    AcceptTeamInvitation: validateRPCBody("AcceptTeamInvitation", teamHandlers.handleAcceptTeamInvitation.bind(teamHandlers)),
    GetTeamMember: validateRPCBody("GetTeamMember", teamHandlers.handleGetTeamMember.bind(teamHandlers)),
    DeleteTeamMember: validateRPCBody("DeleteTeamMember", teamHandlers.handleDeleteTeamMember.bind(teamHandlers)),
    GetAllUserTeams:validateRPCBody("GetAllUserTeams",teamHandlers.handleGetAllUserTeams.bind(teamHandlers)),

    CreateProjectMemberInvitation: validateRPCBody("CreateProjectMemberInvitation", projectHandlers.handleCreateProjectMemberInvitation.bind(projectHandlers)),
    AcceptProjectInvitation: validateRPCBody("AcceptProjectInvitation", projectHandlers.handleAcceptInvitation.bind(projectHandlers)),
    GetProjectMember: validateRPCBody("GetProjectMember", projectHandlers.handleGetProjectMember.bind(projectHandlers)),
    DeleteProjectMember: validateRPCBody("DeleteProjectMember", projectHandlers.handleDeleteProjectMember.bind(projectHandlers)),
    GetAllUserProjectIds:validateRPCBody("GetAllUserProjectIds",projectHandlers.handleGetAllUserProjectIds.bind(projectHandlers))
});

server.bindAsync(`${SECRETS.HOST}:${SECRETS.PORT}`,ServerCredentials.createInsecure(),(err)=>{
    if (err) {
        logger.error(`ERROR_STARTING_AUTH_GRPC_SERVER: ${JSON.stringify(err,null,4)}`)
        process.exit(1);
    }
      logger.info(`AUTH_GRPC_SERVER_LISTENING_ON ${SECRETS.HOST}:${SECRETS.PORT}`)
})

projectConsumer.startProjectConsumer().then(() => {
    logger.info("PROJECT_CONSUMER_STARTED");
}).catch((err) => {
    logger.error(`ERROR_STARTING_PROJECT_CONSUMER_IN_AUTH_SERVICE: ${JSON.stringify(err, null, 2)}`);
});

process.on("uncaughtException", (err) => {
    logger.error(`UNCAUGHT_EXCEPTION_AT_AUTH_SERVICE: ${err.message}`);
});

process.on("unhandledRejection", (reason) => {
    logger.error(`UNHANDLED_REJECTION_AT_AUTH_SERVICE: ${reason}`);
});

process.on("SIGINT", () => {
    logger.info("AUTH_SERVICE_STOPPED");
    process.exit(0);
});

