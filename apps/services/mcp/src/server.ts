import { app } from "@/app";
import { getSessions } from "@/libs/mcp";

const PORT = Number(process.env.PORT) || 3000;

const httpServer = app.listen(PORT, () => {
  console.log(`shipoff-mcp running on :${PORT}`);
});

process.on("SIGINT", async () => {
  console.log("Shutting down shipoff-mcp...");
  for (const [id, session] of getSessions()) {
    await session.transport.close();
    await session.server.close();
  }
  httpServer.close(() => process.exit(0));
});
