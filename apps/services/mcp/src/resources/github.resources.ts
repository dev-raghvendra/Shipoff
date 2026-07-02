import { getUser } from "@/libs/context";
import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp";
import { GithubService } from "@/services/github.service";
import { unwrapGrpcResponse } from "@/utils/response.utils";
const githubServiceClient = new GithubService()

export function registerGithubResource(server:McpServer){
    server.registerResource(
        "github_installation",
        "shipoff://github/githubInstallation",
        {
            title:"Github Installation",
            description:`Returns the GitHub App installation for the authenticated user.
If no installation exists, the user must install the Shipoff GitHub App
from the dashboard before repositories can be accessed or projects created.
Always check this before listing repositories or creating a project.`,
            mimeType:"application/json"
        },
        async(uri,{requestId,sessionId})=>{
            
            const user = getUser()
            try {
             const inst = unwrapGrpcResponse(await githubServiceClient.getGithubInstallation({
                authUserData:user,
                reqMeta:{
                requestId:`rid-${sessionId}:${requestId}`
                }
            }))

            return {
                contents:[{
                    uri:uri.href,
                    mimeType:"application/json",
                    text:JSON.stringify(inst,null,2)
                }]
            }   
            } catch (e:any) {
                return {
          contents:[{
             uri:uri.href,
             mimeType:"application/json",
             text:JSON.stringify({
               error:e.message ?? "Faiiled to fetch github installation.",
               errCode:e.code ?? "UNKNOWN_ERROR"
             },null,2)
          }],
        }
            }
            
        }
    )

    server.registerResource(
        "github_repos",
        new ResourceTemplate("shipoff://github/repos{?limit,offset}",{list:undefined}),
        {
            title:"List Github Repositories",
            description:`
             Returns the GitHub repositories accessible through the user's Shipoff
GitHub App installation.

Use this resource to obtain a valid repository ID, repository URL, and
repository full name before creating a project.

             Prerequisites:
             - Check if github installation exists for the user.
             - If not then user must complete it on shipoff dashboard
            `,
            mimeType:"application/json"
        },
        async(uri,{limit,offset},{requestId,sessionId})=>{
           try {
            const user = getUser()
           const repos = unwrapGrpcResponse(await githubServiceClient.getUserGithubRepositories({
             authUserData:user,
             limit,
             skip:offset,
             reqMeta:{
                requestId:`rid-${sessionId}:${requestId}`
             }
           }))

           return {
            contents:[{
                uri:uri.href,
                mimeType:"application/json",
                text:JSON.stringify(repos,null,2)
            }]
           }
           } catch (e:any) {
            return {
          contents:[{
             uri:uri.href,
             mimeType:"application/json",
             text:JSON.stringify({
               error:e.message ?? "Faiiled to fetch github repos",
               errCode:e.code ?? "UNKNOWN_ERROR"
             },null,2)
          }],
        }
           }
           
        }
    )
}