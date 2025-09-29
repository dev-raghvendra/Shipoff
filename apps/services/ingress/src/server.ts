import app from "./app";
import { createServer } from "http";
import { logger } from "./libs/winston";
import { SECRETS } from "./config";

const server = createServer(app);
server.listen(SECRETS.PORT, () => {
    logger.info(`INGRESS_SERVICE_LISTENING_ON_PORT_${SECRETS.PORT}`);
});
