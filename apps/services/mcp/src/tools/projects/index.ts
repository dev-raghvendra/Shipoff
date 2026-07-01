import { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import { registerRedeployDeploymentTool } from "./redeploy-deployment";
import {registerCreateProjectTool} from "./create-project";

export function registerTools(server: McpServer) {
  registerRedeployDeploymentTool(server);
  registerCreateProjectTool(server);
}