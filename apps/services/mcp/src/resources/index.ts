import { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import { registerProjectsResource } from "./projects.resources";
import { registerDeploymentsResource } from "./deployments.resources";
import { registerFrameworkResource } from "./framework.resource";
import { registerGithubResource } from "./github.resources";

export function registerResources(server: McpServer) {
  registerProjectsResource(server);
  registerDeploymentsResource(server);
  registerFrameworkResource(server)
  registerGithubResource(server)
}