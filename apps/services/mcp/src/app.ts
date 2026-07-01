import express from "express";
import cors from "cors";
import { mcpRouter } from "@/routers/mcp.router";
import { metaDataRouter } from "./routers/metadata.router";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "shipoff-mcp" });
});
app.use("/mcp", mcpRouter);
app.use("/.well-known", metaDataRouter);

export { app };
