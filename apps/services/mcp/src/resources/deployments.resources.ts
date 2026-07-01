import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp";
import { getUser } from "../libs/context";
import { ProjectService } from "@/services/projects.service";
import { unwrapGrpcResponse } from "@/utils/response.utils";
import { InferResponse } from "@shipoff/types";

const projectServiceClient = new ProjectService();

export function registerDeploymentsResource(server: McpServer) {
  server.registerResource(
    "latest_deployment_list",
    new ResourceTemplate("shipoff://projects/{project_id}/deployments{?limit,offset}", { list: undefined }),
    {
      title: "Project Deployments",
      description: `Returns a paginated list of deployments for a specific project, ordered
by creation time descending. Each deployment includes its ID, status,
created time, and trigger. Use this to find a deployment ID before
calling redeploy_deployment or reading deployment_status.`,
      mimeType: "application/json",
    },
    async (uri, { project_id }) => {
      const user = getUser();
      const deployments = unwrapGrpcResponse(await projectServiceClient.getAllDeployments({
        authUserData: user,
        projectId: project_id,
        reqMeta:{
            requestId:`${Date.now()}`
        }
      }));
      return {
        contents: [{
          uri: uri.href,
          mimeType: "application/json",
          text: JSON.stringify(deployments, null, 2),
        }],
      };
    }
  );

  server.registerResource(
     "deployment_details",
     new ResourceTemplate("shipoff://projects/{project_id}/deployments/{deployment_id}", { list: undefined }),
     {
       title: "Deployment Details",
       description: "Returns details of a specific deployment.",
       mimeType: "application/json",
     },
     async (uri, { project_id, deployment_id }) => {
       const user = getUser();
       const deployment = unwrapGrpcResponse(await projectServiceClient.getDeployment({
         authUserData: user,
         projectId: project_id,
         deploymentId: deployment_id,
         reqMeta:{
            requestId:`${Date.now()}`
         }
       }));
       return {
         contents: [{
           uri: uri.href,
           mimeType: "application/json",
           text: JSON.stringify(deployment, null, 2),
         }],
       };
     }
  )

  server.registerResource(
    "deployment_status",
    new ResourceTemplate("shipoff://projects/{project_id}/deployments/{deployment_id}/status",{list:undefined}),
    {
      title:"Deployment Status",
      description:`Returns only the status field for a specific deployment. Prefer this over
deployment_details when only the status is needed. Possible values:
PROVISIONING, BUILDING, DEPLOYING, PRODUCTION, FAILED, INACTIVE.`,
      mimeType:"application/json"
    },
    async(uri,{project_id,deployment_id})=>{
        const user = getUser()
        const data = unwrapGrpcResponse(await projectServiceClient.getDeployment({
           authUserData:user,
           projectId:project_id,
           deploymentId:deployment_id,
            reqMeta:{
            requestId:`${Date.now()}`
         }
        }))

        const deployment = {
           status:data.status
        }
        
        return {
           contents:[{
               uri:uri.href,
               mimeType:"application/json",
               text:JSON.stringify(deployment,null,2)
           }]
        }
        
    }
  )

  server.registerResource(
    "latest_deployment",
    new ResourceTemplate("shipoff://projects/{project_id}/deployments/latest",{list:undefined}),
    {
      title:"Latest Deployment",
      description:`Returns the most recent deployment for a project regardless of status.
Useful after create_project or redeploy_deployment to immediately track
the newly triggered deployment without knowing its ID.`,
      mimeType:"application/json"
    },
    async(uri,{project_id})=>{
        const user = getUser()
        const deployment = unwrapGrpcResponse(await projectServiceClient.getLatestDeployments({
          authUserData:user,
          projectId:project_id,
          limit:1,
          reqMeta:{
            requestId:`${Date.now()}`
          }
        }))
        return {
            contents:[{
              uri:uri.href,
              mimeType:"application/json",
              text:JSON.stringify(deployment[0],null,2)
            }]
        }
    }
  )
}