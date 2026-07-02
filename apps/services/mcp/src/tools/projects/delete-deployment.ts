import { getUser } from "@/libs/context";
import { ProjectService } from "@/services/projects.service";
import { withIdempotency } from "@/utils/request.utils";
import { unwrapGrpcResponse } from "@/utils/response.utils";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import z from "zod";

const projectServiceClient = new ProjectService()
export function registerDeleteDeploymentTool(server:McpServer){
    server.registerTool(
        "delete_deployment",
        {
            title:"Delete Deployment",
            description:`
Permanently deletes a deployment and all its associated logs, build and runtime environments
from Shipoff. This action is irreversible.

Prerequisites:
- Obtain the project ID from the projects resource or project_details resource.
- Obtain the deployment ID from the deployments resource or deployment_details resource.
- Confirm with the user before invoking this tool — deletion cannot be undone.
- Deployments whose state is either INACTIVE or FAILED can only be Deleted.

On success, the deployment and all its resources are permanently removed.
            `,
            inputSchema: {
                    deploymentId: z
                      .string()
                      .min(1)
                      .describe("Identifier of the deployment to delete."),
            
                    projectId: z
                      .string()
                      .min(1)
                      .describe("Identifier of the project that owns the deployment."),
                  
                  idempotencyKey: z
              .string()
              .min(1)
              .describe("Unique key for this operation. Use a UUID generated once per user intent and reuse it on retries. Prevents duplicate operations if the request is retried."),
                }
        },
        async(body,{requestId,sessionId})=>{
           const user = getUser()
           try {
             const del = await withIdempotency(
            body.idempotencyKey,
            user.userId,
            async()=>unwrapGrpcResponse(await projectServiceClient.deleteDeployment({
                authUserData:user,
                projectId:body.projectId,
                deploymentId:body.deploymentId,
                reqMeta:{
                    requestId:`rid-${sessionId}:${requestId}`
                }
            }))
           )

           return {
               content:[{
                type:"text",
                text:`${body.deploymentId} Deleted`
               },
               {
                type:"resource",
                resource:{
                    uri:`shipoff://projects/${body.projectId}/deployments/${body.deploymentId}`,
                    mimeType:"application/json",
                    text:JSON.stringify(del.result,null,2)
                }
               }]
           }
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
    )
}