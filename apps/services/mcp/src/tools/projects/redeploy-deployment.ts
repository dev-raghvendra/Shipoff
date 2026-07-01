import { getUser } from "@/libs/context";
import { ProjectService } from "@/services/projects.service";
import { unwrapGrpcResponse } from "@/utils/response.utils";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import { z } from "zod";

const projectServiceClient = new ProjectService();

export function registerRedeployDeploymentTool(server: McpServer) {
  server.registerTool(
    "redeploy_deployment",
    {
      title: "Redeploy Deployment",
      description: `
Starts a new deployment from an existing deployment.

Use this tool to redeploy a previously deployed application.

Prerequisites:
- Obtain the deployment identifier from the deployment resources.
- Ensure the deployment status is one of: INACTIVE, FAILED, or PRODUCTION.
- Deployments in any other state cannot be redeployed.

On success, a new deployment is created and begins in QUEUED state.
Use the returned deploymentId with deployment_status to monitor progress,
or with deployment_details for full information.
`,
      inputSchema: {
        deploymentId: z
          .string()
          .min(1)
          .describe("Identifier of the deployment to redeploy."),

        projectId: z
          .string()
          .min(1)
          .describe("Identifier of the project that owns the deployment."),
      },
    },
    async (body) => {
      const user = getUser();

      const deployment = unwrapGrpcResponse(
        await projectServiceClient.redeploy({
          authUserData: user,
          deploymentId: body.deploymentId,
          projectId: body.projectId,
          reqMeta:{
            requestId:`${Date.now()}`
          }
        })
      );

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                deploymentId: deployment.deploymentId,
                projectId: deployment.projectId,
                status: deployment.status,
                createdAt: deployment.createdAt,
              },
              null,
              2
            ),
          },
        ],
      };
    }
  );
}