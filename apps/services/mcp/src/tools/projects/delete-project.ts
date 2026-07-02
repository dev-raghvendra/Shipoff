import { getUser } from "@/libs/context";
import { ProjectService } from "@/services/projects.service";
import { withIdempotency } from "@/utils/request.utils";
import { unwrapGrpcResponse } from "@/utils/response.utils";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import z from "zod";

const projectServiceClient = new ProjectService()
export function registerDeleteProjectTool(server:McpServer){
    server.registerTool(
        "delete_project",
        {
            title:"Delete Project",
            description:`
Permanently deletes a project and all its associated deployments, domains,
and environment variables from Shipoff. This action is irreversible.

Prerequisites:
- Obtain the project ID from the projects resource or project_details resource.
- Confirm with the user before invoking this tool — deletion cannot be undone.

On success, the project and all its resources are permanently removed.
Any active deployments will be terminated immediately.
            `,
            inputSchema:{
                projectId:z.string().min(5),
                idempotencyKey: z
                          .string()
                          .min(1)
                          .describe(
                            "Unique key for this operation. Use a UUID generated once per user intent and reuse it on retries. Prevents duplicate operations if the request is retried.",
                          )
            }
        },
        async(body,{requestId,sessionId})=>{
           const user = getUser()
           try {
             const del = await withIdempotency(
            body.idempotencyKey,
            user.userId,
            async()=>unwrapGrpcResponse(await projectServiceClient.deleteProject({
                authUserData:user,
                projectId:body.projectId,
                reqMeta:{
                    requestId:`rid-${sessionId}:${requestId}`
                }
            }))
           )

           return {
               content:[{
                type:"text",
                text:`${body.projectId} Deleted`
               },
               {
                type:"resource",
                resource:{
                    uri:`shipoff://projects/${body.projectId}`,
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