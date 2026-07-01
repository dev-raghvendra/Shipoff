import { Request, Response, NextFunction } from "express";

export class MetadataController {
   async protectedResource(_:Request, res: Response) {
    res.json({
      resource: "https://mcp.shipoff.in/mcp",
      authorization_servers: [
        "https://shipoff.in"
      ],
      resource_name: "Shipoff MCP Server",
      resource_documentation: "https://docs.shipoff.in/mcp"
    });
  }
}