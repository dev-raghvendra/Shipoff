import { getUser } from "@/libs/context";
import { ProjectService } from "@/services/projects.service";
import { unwrapGrpcResponse } from "@/utils/response.utils";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

const projectServiceClient= new ProjectService()

export function registerFrameworkResource(server:McpServer){
    server.registerResource(
        "frameworks",
        "shipoff://frameworks",
        {
           title:"Supported Frameworks",
           description:`Lists all frameworks supported by Shipoff, including their frameworkId,
default build command, output directory, and whether they are static or
server-side. Always fetch this before create_project to obtain a valid
frameworkId and default configuration values.
The returned framework configuration should be used as the default values
when creating a project unless the user explicitly overrides them.`,
           mimeType:"application/json"
        },
        async(uri,{requestId,sessionId})=>{
            try {
             const user = getUser()
            const fws = unwrapGrpcResponse(await projectServiceClient.getFrameworks({
                authUserData:user,
                reqMeta:{
                requestId:`rid-${sessionId}:${requestId}`
                }
            }))

            return {
                contents:[{
                    uri:uri.href,
                    mimeType:"application/json",
                    text:JSON.stringify(fws,null,2)
                }]
            }   
            } catch (e:any) {
               return {
          contents:[{
             uri:uri.href,
             mimeType:"application/json",
             text:JSON.stringify({
               error:e.message ?? "Faiiled to fetch resource.",
               errCode:e.code ?? "UNKNOWN_ERROR"
             },null,2)
          }],
        } 
            }
            
        }
    )
}