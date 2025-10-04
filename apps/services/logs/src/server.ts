import { createStreamValidator, createSyncErrHandler, createUnaryValidator } from "@shipoff/services-commons";
import { Server, ServerCredentials } from "@grpc/grpc-js";
import { STREAM_RPC_SCHEMA, UNARY_RPC_SCHEMA } from "@/config/rpc-schema";
import { LogsHandler } from "@/handlers/logs.handler";
import { logger } from "@/libs/winston";
import { UnimplementedLogServiceService } from "@shipoff/proto";
import { SECRETS } from "./config";


const validateUnaryRPCBody = createUnaryValidator(UNARY_RPC_SCHEMA, logger);
const validateStreamRPCBody = createStreamValidator(STREAM_RPC_SCHEMA, logger);
const server = new Server();
const logsHandler = new LogsHandler();
const errHandler = createSyncErrHandler({ subServiceName: "LOGS_SERVER", logger })

server.addService(UnimplementedLogServiceService.definition, {
    IPutLog: validateUnaryRPCBody("IPutLog", logsHandler.handleIPutLog.bind(logsHandler)),
    GetLogs: validateUnaryRPCBody("GetLogs", logsHandler.handleGetLogs.bind(logsHandler)),
    StreamLogs: validateStreamRPCBody("StreamLogs", logsHandler.handleStreamLogs.bind(logsHandler))
})

server.bindAsync(`${SECRETS.HOST}:${SECRETS.PORT}`,ServerCredentials.createInsecure(),(err)=>{
    if (err) {
        errHandler(err,"LOGS_GRPC_SERVER_BINDING","N/A");
        process.exit(1);
    }
      logger.info(`[rid:N/A]: LOGS_GRPC_SERVER_LISTENING_ON ${SECRETS.HOST}:${SECRETS.PORT}`)
})

process.on("uncaughtException", (err) => {
    errHandler(err,"LOGS_SERVER_UNCAUGHT_EXCEPTION","N/A");
    process.exit(1);
});

process.on("unhandledRejection", (reason) => {
    errHandler(reason as any,"LOGS_SERVER_UNHANDLED_REJECTION","N/A");
    process.exit(1);
});

process.on("SIGINT", () => {
    server.tryShutdown(err=>{
        if(err) errHandler(err,"SIGINT_SERVER_CLOSE","N/A");
        logger.info("[rid:N/A]: LOGS_SERVICE_SHUTDOWN_GRACEFULLY");
        process.exit(0);
    })
});

process.on("SIGTERM", () => {
    server.tryShutdown(err=>{
        if(err) errHandler(err,"SIGTERM_SERVER_CLOSE","N/A");
        logger.info("[rid:N/A]: LOGS_SERVICE_SHUTDOWN_GRACEFULLY");
        process.exit(0);
    })
});

