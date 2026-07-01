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
Use limit and offset for pagination. Fetch this first when the user asks
about their projects or before creating/deploying a project.`,
      mimeType: "application/json",
    },
    async (uri,{limit,offset}) => {
      const user = getUser();
      const projects = unwrapGrpcResponse(await projectServiceClient.getAllUserProjects({
        authUserData:user,
        limit,
        skip:offset,
        reqMeta:{
            requestId:`${Date.now()}`
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
      description: "Returns details of a specific project.",
      mimeType: "application/json",
    },
    async (uri, { project_id }) => {
      const user = getUser();
      const project = unwrapGrpcResponse(await projectServiceClient.getProject({
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
          text: JSON.stringify(project, null, 2),
        }],
      };
    }
  );
}