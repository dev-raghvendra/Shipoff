import { CONFIG } from "@/config/config";
import { Request, Response } from "express";

export class MetadataController {
   async protectedResource(_:Request, res: Response) {
    res.json({
      resource: `${CONFIG.MCP_SERVER_URL}/mcp`,
      authorization_servers: [
        CONFIG.AUTHORIZATION_SERVER_URL
      ],
      resource_name: "Shipoff MCP Server",
      resource_documentation: "https://docs.shipoff.in/mcp.js"
    });
  }
}