import { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import { z } from "zod";
import { getUser } from "../../libs/context";
import { ProjectService } from "@/services/projects.service";
import { unwrapGrpcResponse } from "@/utils/response.utils";

const projectServiceClient = new ProjectService()

export function registerCreateProjectTool(server: McpServer) {
  server.registerTool(
  "create_project",
  {
    title: "Create Project",
    description: `
Create a new project on Shipoff and start its initial deployment.

Prerequisites:
- Check if githubInstallation of a user exists by checking githubInstallation resource.
- If githubInstallation does not exist then user must complete the Github Installation from Shipoff dashboard
- Select a supported framework from the available frameworks resource.
- Verify the requested domain is available using the domain resource.
- Select a GitHub repository from the authenticated user's repositories.

After successful creation, the returned projeft ID can be used to retreive the latest deployment or stream deployment logs.
`,
    inputSchema: {
      name: z.string().min(2).describe("Project name."),

      description: z.string().optional().describe("Project description."),

      frameworkId: z
        .string()
        .min(2)
        .describe("Framework identifier."),

      buildCommand: z
        .string()
        .min(1)
        .describe("Build command for the project."),

      prodCommand: z
        .string()
        .optional()
        .describe(
          `Production start command (e.g. "node dist/index.js"). Required for 
server-side frameworks. Must be omitted or left empty for static frameworks
— check the frameworks resource to determine if the selected framework is static.`
        ),

      branch: z
        .string()
        .min(1)
        .describe("Git branch to deploy."),

      domain: z
        .string()
        .min(1)
        .describe("Unique domain for the project."),

      githubRepoId: z
        .string()
        .min(1)
        .describe("GitHub repository identifier."),

      githubRepoURI: z
        .string()
        .url()
        .describe("GitHub repository URL."),

      githubRepoFullName: z
        .string()
        .min(1)
        .describe("GitHub repository full name in the format owner/repository."),

      outDir: z
        .string()
        .min(1)
        .describe("Directory containing the build output."),

      rootDir: z
        .string()
        .min(1)
        .describe("Root directory of the project inside the repository."),

      environmentVars: z
        .array(
          z.object({
            name: z.string().min(1),
            value: z.string().min(1),
          })
        )
        .default([])
        .describe("Environment variables for the project."),
    },
  },
  async (body) => {
    const user = getUser();

    const project = unwrapGrpcResponse(
      await projectServiceClient.createProject({
        authUserData: user,
        ...body,
        reqMeta:{
                requestId:`${Date.now()}`
             }
      })
    );

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(project, null, 2),
        },
      ],
    };
  }
);
}