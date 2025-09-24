import mongoose from "mongoose";
import { SECRETS } from "@/config";
import { createUnaryValidator } from "@shipoff/services-commons";
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

server.addService(UnimplementedOrchestratorServiceService.definition, {
    IStartK8Deployment: validateRPCBody("IStartK8Deployment", orchestratorHandlers.handleIStartK8Deployment.bind(orchestratorHandlers)),
    IGetCloneURI: validateRPCBody("IGetCloneURI", orchestratorHandlers.handleIGetCloneURI.bind(orchestratorHandlers)),
    IOrchestratorWebhook: validateRPCBody("IOrchestratorWebhook", orchestratorWebhookHandler.handleIOrchestratorWebhook.bind(orchestratorWebhookHandler)),
})

deploymentConsumer.startConsumer().then(() => {
    logger.info("DEPLOYMENT_CONSUMER_STARTED");
    projectConsumer.startConsumer().then(() => {
    logger.info("PROJECT_CONSUMER_STARTED");
    }).catch((err) => {
      logger.error(`ERROR_STARTING_PROJECT_CONSUMER: ${JSON.stringify(err, null, 2)}`);
    });
}).catch((err) => {
    logger.error(`ERROR_STARTING_DEPLOYMENT_CONSUMER: ${JSON.stringify(err, null, 2)}`);
});

mongoose.connect(SECRETS.DATABASE_URI).then(()=>{
    logger.info("MONGO-DB_CONNECTED");
}).catch((error) => {
    logger.error(`UNEXPECTED_ERR_OCCURED_WHILE_CONNECTING_MONGO-DB: ${error}`);
});



server.bindAsync(`${SECRETS.HOST}:${SECRETS.PORT}`,ServerCredentials.createInsecure(),(err)=>{
    if(err) return logger.error(`ERROR_STARTING_ORCHESTRATOR_GRPC_SERVER: ${err}`);
    logger.info(`ORCHESTRATOR_GRPC_SERVER_LISTENING_ON ${SECRETS.HOST}:${SECRETS.PORT}`);
})
