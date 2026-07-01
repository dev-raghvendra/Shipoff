import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp";
import { getUser } from "@/libs/context";
import { ProjectService } from "@/services/projects.service";
import { unwrapGrpcResponse } from "@/utils/response.utils";

const projectServiceClient = new ProjectService();

export function registerDomainResource(server: McpServer) {
  server.registerResource(
    "domain_availability",
    new ResourceTemplate(
      "shipoff://domains/{domain}/availability",
      { list: undefined }
    ),
    {
      title: "Domain Availability",
      description: `
Checks whether a Shipoff subdomain is available.

Use this resource before creating a project to verify that the requested
domain is available. If the domain is unavailable, the user should choose
another domain before invoking the create_project tool.
`,
      mimeType: "application/json",
    },
    async (uri, { domain }) => {
      const user = getUser();

      const result = unwrapGrpcResponse(
        await projectServiceClient.checkDomainAvailability({
          authUserData: user,
          domain,
          reqMeta:{
                requestId:`${Date.now()}`
             }
        })
      );

      return {
        contents: [
          {
            uri: uri.href,
            mimeType: "application/json",
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    }
  );
}