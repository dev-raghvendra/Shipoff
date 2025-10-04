import app from "./app";
import { createServer } from "http";
import { logger } from "@/libs/winston";
import { CONFIG } from "./config/config";
import { createWebSocketServer } from "./ws-server";
import { createSyncErrHandler } from "@shipoff/services-commons";

const errHandler = createSyncErrHandler({ subServiceName: "GATEWAY_SERVER", logger });

const server = createServer(app);
createWebSocketServer(server);

server.listen(CONFIG.PORT,()=>logger.info(`[rid:N/A]: GATEWAY_SERVICE_STARTED_ON_PORT: ${CONFIG.PORT}`));

process.on("uncaughtException", (err) => {
    errHandler(err,"UNCAUGHT_EXCEPTION","N/A");
});

process.on("unhandledRejection", (reason) => {
    errHandler(reason as any,"UNHANDLED_REJECTION","N/A");
});

process.on("SIGINT", () => {
    server.close((err)=>{
        if(err) errHandler(err,"SIGINT_SERVER_CLOSE","N/A");
        logger.info("[rid:N/A]: GATEWAY_SERVICE_SHUTDOWN_GRACEFULLY");
        process.exit(0);
    })
});

process.on("SIGTERM", () => {
    server.close((err)=>{
        if(err) errHandler(err,"SIGTERM_SERVER_CLOSE","N/A");
        logger.info("[rid:N/A]: GATEWAY_SERVICE_SHUTDOWN_GRACEFULLY");
        process.exit(0);
    })
});


