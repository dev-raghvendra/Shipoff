import app from "./app";
import {createServer} from "http";
import logger from "@shipoff/services-commons/libs/winston";
import { CONFIG } from "./config/config";

createServer(app).listen(CONFIG.PORT,()=>logger.info(`GATEWAY_SERVICE_STARTED_ON_PORT: ${CONFIG.PORT}`));

process.on("uncaughtException", (err) => {
    logger.error(`UNCAUGHT_EXCEPTION_AT_GATEWAY: ${err.message}`);
});

process.on("unhandledRejection", (reason) => {
    logger.error(`UNHANDLED_REJECTION_AT_GATEWAY: ${reason}`);
});

process.on("SIGINT", () => {
    logger.info("GATEWAY_SERVICE_STOPPED");
    process.exit(0);
});


