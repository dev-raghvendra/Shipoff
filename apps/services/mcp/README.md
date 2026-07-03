# Shipoff MCP Server

The Shipoff Model Context Protocol (MCP) server provides AI agents with direct access to your Shipoff PaaS environment. It allows LLMs to query resources, manage projects, and monitor deployments using standard MCP interfaces.

## Features

This server exposes Shipoff's core platform capabilities via standard MCP Tools and Resources, communicating over SSE (Server-Sent Events).

### 🛠️ Tools

Agents can perform actions on your behalf using the following tools:

- `createProject`: Create and configure a new project on Shipoff (static or dynamic).
- `deleteProject`: Delete an existing project and its associated resources.
- `redeployDeployment`: Trigger a new deployment for an existing project.
- `monitorDeployment`: Monitor the status and logs of a deployment.
- `deleteDeployment`: Delete a specific deployment.

### 📚 Resources

Agents can read context from your Shipoff account using these resources:

- **Projects Resource**: Fetch details about configured projects.
- **Deployments Resource**: Access deployment history and states (`QUEUED`, `BUILDING`, `PRODUCTION`, etc.).
- **Framework Resource**: Access the list of supported frameworks and runtimes (Node.js, Python, PHP, etc.).
- **Github Resource**: Read connected GitHub repository configurations.
- **Domain Resource**: Inspect domain settings and routing configurations.

## Architecture

The MCP Server is integrated into Shipoff's microservices architecture and communicates with the other internal services via gRPC:
- Connects to the `ProjectService` for project/deployment management.
- Uses `AuthService` for authorization and permission scoping.
- Communicates with `OrchestratorService` to trigger and monitor deployments.

## Getting Started

### Local Development

1. Ensure the Shipoff platform dependencies are running (`pnpm dev:db`).
2. Run the MCP server in development mode:
   ```bash
   pnpm dev
   ```
   Or from the root workspace:
   ```bash
   pnpm --filter mcp dev
   ```

The server exposes endpoints:
- `GET /health` - Healthcheck
- `GET /mcp` - SSE Endpoint for MCP clients
- `POST /mcp/message` - Message endpoint for MCP clients
- `GET /.well-known/ai-plugin.json` - Metadata endpoint

### Integrating with AI Agents

Point your MCP-compatible client (e.g., Claude Desktop, custom agents) to the SSE endpoint:
`http://localhost:<PORT>/mcp`
