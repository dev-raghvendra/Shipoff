import mongoose from "mongoose";
import { SECRETS } from "@/config";
import { createSyncErrHandler, createUnaryValidator } from "@shipoff/services-commons";
import { UnimplementedOrchestratorServiceService } from "@shipoff/proto";
import { Server, ServerCredentials } from "@grpc/grpc-js";
import { RPC_SCHEMA } from "./config/rpc-schema";
import { OrchestratorWebhookHandler } from "./handlers/orchestrator-webhook.handler";
import { OrchestratorHandler } from "./handlers/orchestrator.handler";
import {DeploymentConsumer} from "@/consumer/deployment.consumer"
import { ProjectConsumer } from "@/consumer/project.consumer";
import { logger } from "@/libs/winston";

const server = new Server()
const validateRPCBody = createUnaryValidator(RPC_SCHEMA,logger);
const orchestratorHandlers = new OrchestratorHandler();
const orchestratorWebhookHandler = new OrchestratorWebhookHandler()
const deploymentConsumer = new DeploymentConsumer("ORCHESTRATOR_SERVICE");
const projectConsumer = new ProjectConsumer("ORCHESTRATOR_SERVICE",deploymentConsumer);
const errHandler = createSyncErrHandler({subServiceName:"ORCHESTRATOR_SERVER",logger});

server.addService(UnimplementedOrchestratorServiceService.definition, {
    IStartK8Deployment: validateRPCBody("IStartK8Deployment", orchestratorHandlers.handleIStartK8Deployment.bind(orchestratorHandlers)),
    IGetCloneURI: validateRPCBody("IGetCloneURI", orchestratorHandlers.handleIGetCloneURI.bind(orchestratorHandlers)),
    IOrchestratorWebhook: validateRPCBody("IOrchestratorWebhook", orchestratorWebhookHandler.handleIOrchestratorWebhook.bind(orchestratorWebhookHandler)),
})

deploymentConsumer.startConsumer().then(() => {
    logger.info("[rid:N/A]: DEPLOYMENT_CONSUMER_STARTED");
    projectConsumer.startConsumer().then(() => {
    logger.info("[rid:N/A]: PROJECT_CONSUMER_STARTED");
    }).catch((err) => {
      errHandler(err,"STARTING_PROJECT_CONSUMER","N/A");
    });
}).catch((err) => {
    errHandler(`${err}`,"STARTING_DEPLOYMENT_CONSUMER","N/A");
});

mongoose.connect(SECRETS.DATABASE_URI).then(()=>{
    logger.info("[rid:N/A]: MONGO-DB_CONNECTED");
}).catch((error) => {
    errHandler(error,"MONGO-DB-CONNECTION","N/A");
});



server.bindAsync(`${SECRETS.HOST}:${SECRETS.PORT}`,ServerCredentials.createInsecure(),(err)=>{
    if(err) return errHandler(err,"BINDING_SERVER","N/A");
    logger.info(`[rid:N/A]: ORCHESTRATOR_GRPC_SERVER_LISTENING_ON ${SECRETS.HOST}:${SECRETS.PORT}`);
})

process.on("uncaughtException",(err)=>{
    errHandler(err,"UNCAUGHT_EXCEPTION","N/A");
    process.exit(1);
});

process.on("unhandledRejection",(reason)=>{
    errHandler(reason as any,"UNHANDLED_REJECTION","N/A");
    process.exit(1);
});

process.on("SIGINT", () => {
    server.tryShutdown((err) =>{
        if(err) errHandler(err,"SIGINT_SERVER_CLOSE","N/A");
        logger.info("[rid:N/A]: ORCHESTRATOR_SERVICE_SHUTDOWN_GRACEFULLY");
    });
});

process.on("SIGTERM", () => {
    server.tryShutdown((err) =>{
        if(err) errHandler(err,"SIGTERM_SERVER_CLOSE","N/A");
        logger.info("[rid:N/A]: ORCHESTRATOR_SERVICE_SHUTDOWN_GRACEFULLY");
    });
});