import mongoose from "mongoose";
import { SECRETS } from "./config/secrets";
import { createValidator, logger } from "@shipoff/services-commons";
import { UnimplementedOrchestratorServiceService } from "@shipoff/proto";
import { Server, ServerCredentials } from "@grpc/grpc-js";
import { RPC_SCHEMA } from "./config/rpc-schema";
import { ContainerHandler } from "./handlers/container.handler";

const server = new Server()
const validateRPCBody = createValidator(RPC_SCHEMA);
const containerHandlers = new ContainerHandler();

server.addService(UnimplementedOrchestratorServiceService.definition, {
    IGetContainer: validateRPCBody("IGetContainer", containerHandlers.handleIGetContainerByDomain.bind(containerHandlers)),
    IGetBuildContainerCreds: validateRPCBody("IGetBuildContainerCreds", containerHandlers.handleIGetBuildContainerCreds.bind(containerHandlers)),
    IGetProdContainerCreds: validateRPCBody("IGetProdContainerCreds", containerHandlers.handleIGetProdContainerCreds.bind(containerHandlers))
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
