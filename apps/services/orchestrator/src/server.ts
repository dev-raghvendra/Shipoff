import mongoose from "mongoose";
import { createValidator, logger } from "@shipoff/services-commons";
import { UnimplementedOrchestratorServiceService } from "@shipoff/proto";
import { SECRETS } from "./config/secrets";
import { Server, ServerCredentials } from "@grpc/grpc-js";
import { RPC_SCHEMA } from "./config/rpc-schema";
import { ContainerHandler } from "./handlers/container.handler";

const server = new Server()
const validateRPCBody = createValidator(RPC_SCHEMA);
const containerHandlers = new ContainerHandler();

server.addService(UnimplementedOrchestratorServiceService.definition, {
    IGetContainer: validateRPCBody("IGetContainer", containerHandlers.handleGetContainerByDomain.bind(containerHandlers)),
    IGetBuildContainerCreds: validateRPCBody("IGetBuildContainerCreds", containerHandlers.handleGetBuildContainerCreds.bind(containerHandlers)),
    IGetProdContainerCreds: validateRPCBody("IGetProdContainerCreds", containerHandlers.handleGetProdContainerCreds.bind(containerHandlers))
})


mongoose.connect(SECRETS.MONGODB_URI).then(()=>{
    logger.info("MONGO-DB_CONNECTED_IN_ORCHESTRATOR_SERVICE");
}).catch((error) => {
    logger.error(`UNEXPECTED_ERR_OCCURED_WHILE_CONNECTING_MONGO-DB_IN_ORCHESTRATOR_SERVICE: ${error}`);
});

server.bindAsync(`${SECRETS.HOST}:${SECRETS.PORT}`,ServerCredentials.createInsecure(),(err)=>{
    if(err) return logger.error(`ERROR_STARTING_ORCHESTRATOR_GRPC_SERVER: ${err}`);
    logger.info(`ORCHESTRATOR_GRPC_SERVER_LISTENING_ON ${SECRETS.HOST}:${SECRETS.PORT}`);
})
