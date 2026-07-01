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
        async(uri)=>{
            const user = getUser()
            const inst = unwrapGrpcResponse(await githubServiceClient.getGithubInstallation({
                authUserData:user,
                reqMeta:{
                requestId:`${Date.now()}`
             }
            }))

            return {
                contents:[{
                    uri:uri.href,
                    mimeType:"application/json",
                    text:JSON.stringify(inst,null,2)
                }]
            }
        }
    )

    server.registerResource(
        "github_repos",
        new ResourceTemplate("shipoff://github/repos{?limit,offset}",{list:undefined}),
        {
            title:"List Github Repositories",
            description:`
             Returns the Github Repositories currently the user has in their github installation.

             Prerequisites:
             - Check if github installation exists for the user.
             - If not then user must complete it on shipoff dashboard
            `,
            mimeType:"application/json"
        },
        async(uri,{limit,offset})=>{
           const user = getUser()
           const repos = unwrapGrpcResponse(await githubServiceClient.getUserGithubRepositories({
             authUserData:user,
             limit,
             skip:offset,
             reqMeta:{
                requestId:`${Date.now()}`
             }
           }))

           return {
            contents:[{
                uri:uri.href,
                mimeType:"application/json",
                text:JSON.stringify(repos,null,2)
            }]
           }
        }
    )
}