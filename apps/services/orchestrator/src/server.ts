import mongoose from "mongoose";
import { SECRETS } from "@/config";
import { createValidator, logger } from "@shipoff/services-commons";
import { UnimplementedOrchestratorServiceService } from "@shipoff/proto";
import { Server, ServerCredentials } from "@grpc/grpc-js";
import { RPC_SCHEMA } from "./config/rpc-schema";
import { OrchestratorWebhookHandler } from "./handlers/orchestrator-webhook.handler";
import { OrchestratorHandler } from "./handlers/orchestrator.handler";

const server = new Server()
const validateRPCBody = createValidator(RPC_SCHEMA);
const orchestratorHandlers = new OrchestratorHandler();
const orchestratorWebhookHandler = new OrchestratorWebhookHandler()

server.addService(UnimplementedOrchestratorServiceService.definition, {
    IGetContainer: validateRPCBody("IGetContainer", orchestratorHandlers.handleIGetContainer.bind(orchestratorHandlers)),
    IGetCloneURI: validateRPCBody("IGetCloneURI", orchestratorHandlers.handleIGetCloneURI.bind(orchestratorHandlers)),
    IOrchestratorWebhook: validateRPCBody("IOrchestratorWebhook", orchestratorWebhookHandler.handleIOrchestratorWebhook.bind(orchestratorWebhookHandler)),
})


mongoose.connect(SECRETS.DATABASE_URI).then(()=>{
    logger.info("MONGO-DB_CONNECTED_IN_ORCHESTRATOR_SERVICE");
}).catch((error) => {
    logger.error(`UNEXPECTED_ERR_OCCURED_WHILE_CONNECTING_MONGO-DB_IN_ORCHESTRATOR_SERVICE: ${error}`);
});

server.bindAsync(`${SECRETS.HOST}:${SECRETS.PORT}`,ServerCredentials.createInsecure(),(err)=>{
    if(err) return logger.error(`ERROR_STARTING_ORCHESTRATOR_GRPC_SERVER: ${err}`);
    logger.info(`ORCHESTRATOR_GRPC_SERVER_LISTENING_ON ${SECRETS.HOST}:${SECRETS.PORT}`);
})
