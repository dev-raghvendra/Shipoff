import express, { Request } from "express";
import cors from "cors";
import { mcpRouter } from "@/routers/mcp.router";
import { metaDataRouter } from "./routers/metadata.router";
import { handleErrorMiddleware } from "./middlewares/err.middleware";
import { formatUptime } from "./utils/request.utils";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "shipoff-mcp", uptime:formatUptime(process.uptime()) });
});
app.use("/mcp", mcpRouter);
app.use("/.well-known", metaDataRouter);
app.use((_,res)=>{
    res.status(404).json({
      code:404,
      message:`${_.url} not found`
    })
})
app.use(handleErrorMiddleware)

export { app };
