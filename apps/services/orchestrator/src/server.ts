import mongoose from "mongoose";
import { CONFIG } from "./config/config";
import { logger } from "@shipoff/services-commons";


mongoose.connect(CONFIG.MONGODB_URI).then(()=>{
    logger.info("MONGO-DB_CONNECTED_IN_ORCHESTRATOR_SERVICE");
}).catch((error) => {
    logger.error(`UNEXPECTED_ERR_OCCURED_WHILE_CONNECTING_MONGO-DB_IN_ORCHESTRATOR_SERVICE: ${error}`);
});