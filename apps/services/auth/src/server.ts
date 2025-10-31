import { Server, ServerCredentials } from "@grpc/grpc-js";
import { UnimplementedAuthServiceService } from "@shipoff/proto";
import AuthHandlers from "@/handlers/auth.handler";
import {createSyncErrHandler, createUnaryValidator} from "@shipoff/services-commons"
import { RPC_SCHEMA } from "@/config/rpc-schema";
import TeamHandlers from "@/handlers/team.handler";
import ProjectHandlers from "@/handlers/project.handlers";
import SECRETS from "@/config/secrets";
import { ProjectConsumer } from "./consumer/project.consumer";
import { logger } from "./libs/winston";


const validateRPCBody = createUnaryValidator(RPC_SCHEMA,logger);
const server = new Server({
    'grpc.max_connection_idle_ms':10*60*1000,
    'grpc.keepalive_time_ms':60*1000,
    'grpc.keepalive_timeout_ms':20*1000,
});
const authhandlers = new AuthHandlers();
const teamHandlers = new TeamHandlers();
const projectHandlers = new ProjectHandlers();
const projectConsumer = new ProjectConsumer();
const errHandler = createSyncErrHandler({subServiceName:"AUTH_SERVER",logger})

server.addService(UnimplementedAuthServiceService.definition, {
    Login: validateRPCBody("Login", authhandlers.handleLogin.bind(authhandlers)),
    Signin: validateRPCBody("Signin", authhandlers.handleSignin.bind(authhandlers)),
    OAuth: validateRPCBody("OAuth", authhandlers.handleOAuth.bind(authhandlers)),
    GetMe: validateRPCBody("GetMe", authhandlers.handleGetMe.bind(authhandlers)),
    RefreshToken: validateRPCBody("RefreshToken", authhandlers.handleRefreshToken.bind(authhandlers)),
    GetWSAuthToken: validateRPCBody("GetWSAuthToken", authhandlers.handleGetWSAuthToken.bind(authhandlers)),
    HasPermissions: validateRPCBody("HasPermissions", authhandlers.handleHasPermissions.bind(authhandlers)),
    VerifyEmail: validateRPCBody("VerifyEmail", authhandlers.handleVerifyEmail.bind(authhandlers)),
    
    CreateTeam: validateRPCBody("CreateTeam", teamHandlers.handleCreateTeam.bind(teamHandlers)),
    GetTeam: validateRPCBody("GetTeam", teamHandlers.handleGetTeam.bind(teamHandlers)),
    DeleteTeam: validateRPCBody("DeleteTeam", teamHandlers.handleDeleteTeam.bind(teamHandlers)),
    CreateTeamMemberInvitation: validateRPCBody("CreateTeamMemberInvitation", teamHandlers.handleCreateTeamMemberInvitation.bind(teamHandlers)),
    AcceptTeamInvitation: validateRPCBody("AcceptTeamInvitation", teamHandlers.handleAcceptTeamInvitation.bind(teamHandlers)),
    GetTeamMembers: validateRPCBody("GetTeamMembers", teamHandlers.handleGetTeamMembers.bind(teamHandlers)),
    DeleteTeamMember: validateRPCBody("DeleteTeamMember", teamHandlers.handleDeleteTeamMember.bind(teamHandlers)),
    GetAllUserTeams:validateRPCBody("GetAllUserTeams",teamHandlers.handleGetAllUserTeams.bind(teamHandlers)),
    TransferTeamOwnership:validateRPCBody("TransferTeamOwnership",teamHandlers.handleTransferTeamOwnership.bind(teamHandlers)),
    GetTeamsLinkedToProject:validateRPCBody("GetTeamsLinkedToProject",teamHandlers.handleGetTeamsLinkedToProject.bind(teamHandlers)),
    LinkTeamToProject:validateRPCBody("LinkTeamToProject",teamHandlers.handleLinkTeamToProject.bind(teamHandlers)), 
    UnlinkTeamFromProject:validateRPCBody("UnlinkTeamFromProject",teamHandlers.handleUnlinkTeamFromProject.bind(teamHandlers)),
    
    CreateProjectMemberInvitation: validateRPCBody("CreateProjectMemberInvitation", projectHandlers.handleCreateProjectMemberInvitation.bind(projectHandlers)),
    AcceptProjectInvitation: validateRPCBody("AcceptProjectInvitation", projectHandlers.handleAcceptInvitation.bind(projectHandlers)),
    DeleteProjectMember: validateRPCBody("DeleteProjectMember", projectHandlers.handleDeleteProjectMember.bind(projectHandlers)),
    GetAllUserProjectIds:validateRPCBody("GetAllUserProjectIds",projectHandlers.handleGetAllUserProjectIds.bind(projectHandlers)),
    IGetAllProjectIdsLinkedToTeam:validateRPCBody("IGetAllProjectIdsLinkedToTeam",projectHandlers.handleIGetAllProjectIdsLinkedToTeam.bind(projectHandlers)),
    TransferProjectOwnership:validateRPCBody("TransferProjectOwnership",projectHandlers.handleTransferProjectOwnership.bind(projectHandlers))
});

server.bindAsync(`${SECRETS.HOST}:${SECRETS.PORT}`,ServerCredentials.createInsecure(),(err)=>{
    if (err) {
        errHandler(err,"GRPC_SERVER_BINDING","N/A");
        process.exit(1);
    }
      logger.info(`[rid:N/A]: AUTH_GRPC_SERVER_LISTENING_ON ${SECRETS.HOST}:${SECRETS.PORT}`)
})

projectConsumer.startProjectConsumer().then(() => {
    logger.info("[rid:N/A]: PROJECT_CONSUMER_STARTED");
}).catch((err) => {
    errHandler(err,"PROJECT_CONSUMER_STARTUP","N/A");
});

process.on("uncaughtException", (err) => {
    errHandler(err,"UNCAUGHT_EXCEPTION","N/A");
});

process.on("unhandledRejection", (reason) => {
    errHandler(reason as {},"UNHANDLED_REJECTION","N/A");
});

process.on("SIGINT", () => {
    server.tryShutdown(err=>{
        if(err) errHandler(err,"SIGINT_SERVER_SHUTDOWN","N/A");
        logger.info("[rid:N/A]: AUTH_SERVICE_SHUTDOWN_GRACEFULLY");
        process.exit(0);
    })
});

process.on("SIGTERM", () => {
    server.tryShutdown(err=>{
        if(err) errHandler(err,"SIGTERM_SERVER_SHUTDOWN","N/A");
        logger.info("[rid:N/A]: AUTH_SERVICE_SHUTDOWN_GRACEFULLY");
        process.exit(0);
    })
});

