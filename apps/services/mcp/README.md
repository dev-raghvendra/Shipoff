# Shipoff MCP Server

The Shipoff Model Context Protocol (MCP) server provides AI agents with direct access to your Shipoff PaaS environment. It allows LLMs to query resources, manage projects, and monitor deployments using standard MCP interfaces.

## 🔐 Authentication & Authorization (OAuth 2.1 & PAT)

Shipoff MCP Server implements a secure, state-of-the-art authentication mechanism leveraging **OAuth 2.1**, **Dynamic Client Registration (DCR)**, and **Personal Access Tokens (PAT)**.

### The OAuth 2.1 Flow
When an unauthenticated MCP client attempts to connect to the server, it receives an HTTP 401 Unauthorized response with a `WWW-Authenticate` header pointing to the server's `.well-known/oauth-protected-resource`:
```http
WWW-Authenticate: Bearer resource_metadata="https://api.shipoff.in/.well-known/oauth-protected-resource"
```
The client then fetches this metadata to discover the authorization server endpoints.

### Dynamic Client Registration (DCR)
Before an AI agent or a new MCP client can authenticate on behalf of a user, it dynamically registers itself with Shipoff's Auth service via the DCR endpoint. This process provisions a unique `clientId` and `clientSecret` for the agent without requiring manual developer configuration in the console. 

### Personal Access Tokens (PAT)
Once the client is registered and authorized, it obtains a Personal Access Token (PAT). This token is passed as a Bearer token in the `Authorization` header of all subsequent MCP requests:
```http
Authorization: Bearer <PAT_TOKEN>
```
The MCP server's `authMiddleware` verifies the JWT token signature via the `services-commons` package and establishes the user context for the session.

## 🚀 Features

This server exposes Shipoff's core platform capabilities via standard MCP Tools and Resources, communicating over the `StreamableHTTPServerTransport`.

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

## 🏗️ Architecture

The MCP Server is integrated into Shipoff's microservices architecture and communicates with the other internal services via gRPC:
- **`AuthService`**: Handles the OAuth 2.1 flow, Dynamic Client Registration (DCR), and validates Personal Access Tokens (PAT).
- **`ProjectService`**: Manages project and deployment states.
- **`OrchestratorService`**: Triggers and monitors Kubernetes deployments.

**Session Management**: 
Sessions are uniquely identified by a `mcp-session-id` header. The server maintains active sessions in memory using `@modelcontextprotocol/sdk`'s `StreamableHTTPServerTransport` and automatically cleans up inactive sessions after a timeout period.

## 💻 Getting Started

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
- `GET /mcp` - Main MCP endpoint
- `POST /mcp` - Message endpoint for MCP clients
- `GET /.well-known/oauth-protected-resource` - OAuth 2.1 metadata endpoint

### Integrating with AI Agents

Point your MCP-compatible client (e.g., Claude Desktop, custom agents) to the MCP endpoint:
`http://localhost:<PORT>/mcp`
Make sure to configure the client to handle the OAuth 2.1 flow or manually inject your PAT in the headers if bypassing DCR in local development.
