import { getUser } from "@/libs/context";
import { ProjectService } from "@/services/projects.service";
import { withIdempotency } from "@/utils/request.utils";
import { unwrapGrpcResponse } from "@/utils/response.utils";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
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
After a successful redeploy, use monitor_deployment to wait until the new
deployment reaches a terminal state.
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
      
      idempotencyKey: z
  .string()
  .min(1)
  .describe("Unique key for this operation. Use a UUID generated once per user intent and reuse it on retries. Prevents duplicate operations if the request is retried."),
    }},
    async (body,{requestId,sessionId}) => {
      try {
        const user = getUser();

      const deployment = await withIdempotency(body.idempotencyKey,user.userId,async ()=>{return unwrapGrpcResponse(
        await projectServiceClient.redeploy({
          authUserData: user,
          deploymentId: body.deploymentId,
          projectId: body.projectId,
          reqMeta:{
            requestId:`rid-${sessionId}:${requestId}`
          }
        })
      )})


      return {
        content: [
          {
            type: "text",
            text: "success",
          },
          {
            type:"resource",
            resource:{
              mimeType:"application/json",
              uri:`shipoff://projects/${body.projectId}/deployments/${deployment.result.deploymentId}/`,
              text:JSON.stringify(deployment,null,2)
            }
          }
        ],
      };
      } catch (e:any) {
        return {
                content:[{
                    type:"text",
                    text:JSON.stringify({
                        error:e.message ?? "UNKWNOWN_ERROR"
                    },null,2)
                }],
                isError:true
        }
      }
    }
  );
}
