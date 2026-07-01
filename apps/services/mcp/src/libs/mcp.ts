import { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp";
import { randomUUID } from "node:crypto";
import { registerResources } from "@/resources";
import { registerTools } from "@/tools/projects";
import { CONFIG } from "@/config/config";

export interface Session {
  server: McpServer;
  transport: StreamableHTTPServerTransport;
  lastSeen: number;
}

const sessions = new Map<string, Session>();

export function createSession(): Session {
  const server = new McpServer({
    name: CONFIG.MCP_SERVER_NAME,
    version: CONFIG.MCP_SERVER_VERSION,
  });

  registerTools(server);
  registerResources(server);

  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: () => randomUUID(),
    onsessioninitialized: (sessionId) => {
      sessions.set(sessionId, { server, transport, lastSeen: Date.now() });
    },
  });

  transport.onclose = () => {
    if (transport.sessionId) sessions.delete(transport.sessionId);
  };

  return { server, transport, lastSeen: Date.now() };
}

export function getSession(sessionId: string): Session | undefined {
  const session = sessions.get(sessionId);
  if (session) session.lastSeen = Date.now(); // refresh TTL on access
  return session;
}

export function getSessions(): Map<string, Session> {
  return sessions;
}

// evict sessions idle for more than 1 hour
setInterval(() => {
  const now = Date.now();
  for (const [id, session] of sessions) {
    if (now - session.lastSeen > 60 * 60 * 1000) {
      session.transport.close();
      sessions.delete(id);
    }
  }
}, 10 * 60 * 1000);
