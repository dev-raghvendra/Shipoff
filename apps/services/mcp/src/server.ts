import { app } from "@/app";
import { getSessions } from "@/libs/mcp.js";
import { CONFIG } from "./config/config";
import { logger } from "./libs/winston";



const httpServer = app.listen(CONFIG.PORT, () => {
  logger.info(`MCP_SERVER_RUNNING_ON_PORT_http://localhost:${CONFIG.PORT}`)
});

process.on("SIGINT", async () => {
  logger.info(`MCP_SERVER_SHUTTING_DOWN`)
  for (const [id, session] of getSessions()) {
    await session.transport.close();
    await session.server.close();
  }
  httpServer.close(() => process.exit(0));
});

