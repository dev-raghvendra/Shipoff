import { createValidator } from "@shipoff/services-commons";
import { Server, ServerCredentials } from "@grpc/grpc-js";
import { RPC_SCHEMA } from "@/config/rpc-schema";
import { LogsHandler } from "@/handlers/logs.handler";
import { logger } from "@/libs/winston";
import { UnimplementedLogServiceService } from "@shipoff/proto";
import { SECRETS } from "./config";


const validateRPCBody = createValidator(RPC_SCHEMA, logger);
const server = new Server();
const logsHandler = new LogsHandler();

server.addService(UnimplementedLogServiceService.definition, {
    IPutLog: validateRPCBody("IPutLog", logsHandler.handleIPutLog.bind(logsHandler)),
})

server.bindAsync(`${SECRETS.HOST}:${SECRETS.PORT}`,ServerCredentials.createInsecure(),(err)=>{
    if (err) {
        logger.error(`ERROR_STARTING_LOGS_GRPC_SERVER: ${JSON.stringify(err,null,4)}`)
        process.exit(1);
    }
      logger.info(`LOGS_GRPC_SERVER_LISTENING_ON ${SECRETS.HOST}:${SECRETS.PORT}`)
})

process.on("uncaughtException", (err) => {
    logger.error(`UNCAUGHT_EXCEPTION: ${err.message}`);
    process.exit(1);
});

process.on("unhandledRejection", (reason) => {
    logger.error(`UNHANDLED_REJECTION: ${JSON.stringify(reason, null, 4)}`);
    process.exit(1);
});

