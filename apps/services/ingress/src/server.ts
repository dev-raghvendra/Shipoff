import app from "./app";
import { createServer } from "http";
import { logger } from "./libs/winston";
import { SECRETS } from "./config";
import { createSyncErrHandler } from "@shipoff/services-commons";

const errHandler = createSyncErrHandler({ subServiceName: "INGRESS_SERVER", logger });

const server = createServer(app);
server.listen(SECRETS.PORT, () => {
    logger.info(`[rid:N/A]: INGRESS_SERVICE_LISTENING_ON_PORT_${SECRETS.PORT}`);
});

process.on("uncaughtException", (err) => {
    errHandler(err,"UNCAUGHT_EXCEPTION","N/A");
    process.exit(1);
});

process.on("unhandledRejection", (reason) => {
    errHandler(reason as any,"UNHANDLED_REJECTION","N/A");
    process.exit(1);
});

process.on("SIGINT", () => {
    server.close((err)=>{
        if(err) errHandler(err,"SIGINT_SERVER_CLOSE","N/A");
        logger.info("[rid:N/A]: INGRESS_SERVICE_SHUTDOWN_GRACEFULLY");
        process.exit(0);
    })
});

process.on("SIGTERM", () => {
    server.close((err)=>{
        if(err) errHandler(err,"SIGTERM_SERVER_CLOSE","N/A");
        logger.info("[rid:N/A]: INGRESS_SERVICE_SHUTDOWN_GRACEFULLY");
        process.exit(0);
    })
});