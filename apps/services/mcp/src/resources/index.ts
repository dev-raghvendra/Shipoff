import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerProjectsResource } from "./projects.resources";
import { registerDeploymentsResource } from "./deployments.resources";
import { registerFrameworkResource } from "./framework.resource";
import { registerGithubResource } from "./github.resources";
import { registerDomainResource } from "./domain.resource";

export function registerResources(server: McpServer) {
  registerProjectsResource(server);
  registerDeploymentsResource(server);
  registerFrameworkResource(server)
  registerGithubResource(server)
  registerDomainResource(server)
}