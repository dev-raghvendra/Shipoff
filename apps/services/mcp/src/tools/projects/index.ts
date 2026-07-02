import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerRedeployDeploymentTool } from "./redeploy-deployment";
import {registerCreateProjectTool} from "./create-project";
import { registerDeleteDeploymentTool } from "./delete-deployment";
import { registerDeleteProjectTool } from "./delete-project";
import { registerMonitorDeploymentTool } from "./monitor-deployment";

export function registerTools(server: McpServer) {
  registerRedeployDeploymentTool(server);
  registerCreateProjectTool(server);
  registerDeleteDeploymentTool(server);
  registerDeleteProjectTool(server);
  registerMonitorDeploymentTool(server)
}