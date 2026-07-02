import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp";
import { getUser } from "../libs/context";
import {ProjectService} from "@/services/projects.service";
import { unwrapGrpcResponse } from "@/utils/response.utils";
const projectServiceClient = new ProjectService();

export function registerProjectsResource(server: McpServer) {
  server.registerResource(
    "latest_projects_list",
    new ResourceTemplate("shipoff://projects{?limit,offset}", { list: undefined }),
    {
      title: "Projects",
      description: `Returns a paginated list of the authenticated user's projects on Shipoff,
including project ID, name, domain, framework, and current status.
Use limit and offset for pagination. 
Use this when the user asks about their existing projects or when a project
ID is needed for another operation.`,
      mimeType: "application/json",
    },
    async (uri,{limit,offset},{requestId,sessionId}) => {
      const user = getUser();
      console.log(requestId)
      const projects = unwrapGrpcResponse(await projectServiceClient.getAllUserProjects({
        authUserData:user,
        limit,
        skip:offset,
        reqMeta:{
            requestId:`rid-${sessionId}:${requestId}`
        }
      }))
      console.log("Projects",projects)
      return {
        contents: [{
          uri: uri.href,
          mimeType: "application/json",
          text: JSON.stringify(projects, null, 2),
        }],
      };
    }
  );

  server.registerResource(
    "project_details",
    new ResourceTemplate("shipoff://projects/{project_id}",{list:undefined}),
    {
      title: "Project Details",
      description: `Returns the complete configuration and current state of a project,
including framework, deployment history, environment variables,
repository configuration, and domain.`,
      mimeType: "application/json",
    },
    async (uri, { project_id },{requestId,sessionId}) => {
      try {
        const user = getUser();
      const project = unwrapGrpcResponse(await projectServiceClient.getProject({
        authUserData: user,
        projectId: project_id,
        reqMeta:{
            requestId:`rid-${sessionId}:${requestId}`
        }
      }));
      return {
        contents: [{
          uri: uri.href,
          mimeType: "application/json",
          text: JSON.stringify(project, null, 2),
        }],
      };
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
  );
}