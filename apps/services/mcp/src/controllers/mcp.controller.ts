import { createSession, getSession } from "@/libs/mcp";
import { Request, Response } from "express";

export class McpController {
  async handle(req: Request, res: Response) {
    const sessionId = req.headers["mcp-session-id"] as string | undefined;

    if (sessionId) {
      const session = getSession(sessionId);
      if (!session) {
        res.status(404).json({ error: "Session not found or expired" });
        return;
      }
      await session.transport.handleRequest(req, res, req.body);
      return;
    }

    // no session ID — only initialize is allowed here
    if (req.body?.method !== "initialize") {
      res.status(400).json({
        jsonrpc: "2.0",
        error: { code: -32000, message: "Bad Request: Server not initialized" },
        id: req.body?.id ?? null,
      });
      return;
    }

    // new session
    const { server, transport } = createSession();
    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
  }
}
