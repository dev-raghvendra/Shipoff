# Shipoff - Modern Platform-as-a-Service (PaaS)

**Shipoff** is a production-ready, developer-friendly Platform-as-a-Service that automates the entire deployment pipeline—from code push to production. Users simply connect their GitHub repositories, configure build commands, and get automatic deployments on every push with zero configuration overhead.

> **Live Platform**: Deploy static sites, full-stack applications (Node.js, Python, PHP), and modern frameworks with automatic scaling, CDN distribution, and comprehensive monitoring.

---

## 🚀 Executive Summary

Shipoff is a **microservices-based PaaS platform** that competes with platforms like Vercel, Netlify, and Railway. It demonstrates expertise in:

- **Distributed Systems Architecture** with 7+ microservices
- **Kubernetes Orchestration** for container lifecycle management
- **Event-Driven Architecture** using Redis Streams
- **Real-time Log Streaming** and observability
- **Complex State Machine** for deployment lifecycle management
- **Model Context Protocol (MCP) Integration** for AI agents
- **Production-Grade Frontend** with modern React patterns
- **Infrastructure as Code** with GitOps workflows

---

## 🏗️ Technology Stack

### **Frontend Applications**

#### Console Dashboard (`apps/console`)
- **Framework**: Next.js 15.2.4 with App Router
- **UI Library**: React 19 with Radix UI primitives (60+ components)
- **State Management**: TanStack Query v5 for server state
- **Authentication**: NextAuth.js v4 with JWT sessions
- **Form Handling**: React Hook Form v7 + Zod validation
- **Styling**: Tailwind CSS v4 with custom design system
- **Animations**: Framer Motion for smooth transitions
- **Charts**: Recharts for analytics dashboards
- **Architecture**: Component-based with custom hooks and service layer

#### Landing Page (`apps/landing`)
- **Framework**: Next.js 15.2.4 (static optimization)
- **Features**: 
  - Interactive scroll-based animations
  - Comprehensive documentation with Ctrl+K search
  - Privacy Policy & Terms of Service pages
  - Modern, responsive design system
  - Real-time content search with DOM traversal

### **Backend Microservices**

#### Core Technologies
- **Language**: TypeScript 5.8+ (strict mode)
- **Runtime**: Node.js 18+
- **Package Manager**: pnpm 9.0.0 with workspace monorepo
- **Build System**: Turborepo for parallel builds and caching

#### Service Communication
- **Synchronous**: gRPC with Protocol Buffers for inter-service calls
- **Asynchronous**: Redis Streams for event-driven workflows (Kafka alternative)
- **API Gateway**: Express.js REST API bridging gRPC to HTTP
- **AI Agent Integration**: Model Context Protocol (MCP) server over SSE

#### Data Layer
- **Database**: PostgreSQL with Prisma ORM
- **Schema**: Database-per-service pattern for isolation
- **Migrations**: Prisma migrations with version control
- **Caching**: Redis for session storage and event queuing

### **Infrastructure & DevOps**

#### Container Orchestration
- **Platform**: Kubernetes (k3d for local, production K8s)
- **Container Runtime**: Docker with multi-stage builds
- **Service Mesh**: Native K8s networking with RBAC policies

#### Observability
- **Log Collection**: Fluent Bit DaemonSet for container log aggregation
- **Metrics**: Prometheus for service metrics
- **Visualization**: Grafana dashboards for platform monitoring
- **Log Service**: Custom gRPC service for log indexing and streaming

#### CI/CD & GitOps
- **Platform CI/CD**: ArgoCD for GitOps-based deployments
- **Image Builds**: Docker Buildx for multi-architecture (ARM64)
- **Registry**: Private container registry
- **Manifests**: Kubernetes YAML with GitOps workflows

#### CDN & Edge
- **Edge Network**: Cloudflare CDN for global distribution
- **Static Assets**: S3-compatible storage for static site hosting
- **Routing**: Custom ingress service for dynamic/static routing

### **Runtime Environments**

#### Supported Runtimes
- **Node.js**: Static (SPA) and Dynamic (Express, Nest.js, Fastify)
- **Python**: Dynamic (Django, Flask, FastAPI)
- **PHP**: Dynamic (Laravel, Symfony)

#### Runtime Features
- **Build Timeouts**: 5-minute limit enforcement
- **Memory Monitoring**: Real-time cgroup memory tracking (512MB free tier)
- **Health Checks**: Automated server startup validation
- **Graceful Shutdown**: Resource cleanup and state management
- **Log Forwarding**: Structured logging to central service

---

## 🎯 Core Features & Functionalities

### **1. Automated Deployment Pipeline**

**Complexity**: ⭐⭐⭐⭐⭐

- **GitHub Webhook Integration**: Real-time push event handling
- **Deployment State Machine**: 
  - States: `QUEUED` → `BUILDING` → `PROVISIONING` → `PRODUCTION` / `FAILED` / `INACTIVE`
  - State transition rules enforced at service level
  - Production protection (cannot delete active deployments)
  - Automatic rollback on build failures (static projects)
- **Multi-Stage Container Builds**: 
  - Ephemeral build pods (exit after artifact upload)
  - Production pods (long-running with health monitoring)
- **Framework Auto-Detection**: Analyzes repository to suggest frameworks

### **2. Project Management System**

**Complexity**: ⭐⭐⭐⭐

- **Project Types**: 
  - Static: React, Vue, Angular, SPA frameworks (CDN-served)
  - Dynamic: Node.js, Python, PHP applications (containerized)
- **Configuration Wizard**: 
  - Multi-step form with validation
  - Framework selection with icons
  - Build/run command customization
  - Environment variable management
  - Domain selection and validation
- **GitHub Integration**: 
  - OAuth-based repository access
  - Branch selection
  - Root directory configuration
  - Automatic webhook setup

### **3. Deployment State Management**

**Complexity**: ⭐⭐⭐⭐⭐

#### State Machine Implementation
```
QUEUED → BUILDING → PROVISIONING → PRODUCTION
                            ↓
                         FAILED
                            ↓
                        INACTIVE
```

**Key Constraints**:
- **Deletable States**: Only `FAILED` and `INACTIVE` deployments can be deleted
- **Redeployable States**: Only `FAILED` and `INACTIVE` deployments can be redeployed
- **Production Protection**: `PRODUCTION` deployments cannot be deleted (prevents downtime)
- **State Transitions**: 
  - Build timeout → `FAILED`
  - Memory limit exceeded → `FAILED`
  - Server startup timeout → `FAILED`
  - New production deployment → Previous `PRODUCTION` → `INACTIVE`

**Implementation Details**:
- State validation in gRPC service layer
- Atomic database transactions for state updates
- Event-driven state propagation via Redis Streams
- Container event → deployment state mapping

### **4. Resource Management & Limits**

**Complexity**: ⭐⭐⭐⭐

#### Free Tier Constraints
- **Build Timeout**: 5 minutes (300 seconds) - enforced via background monitoring
- **Server Startup Timeout**: 5 minutes for dynamic projects - health check validation
- **Memory Limit**: 512MB RAM with real-time cgroup monitoring
- **Autoscaling**: Dynamic projects scale to zero after 15 minutes of inactivity
- **Cold Starts**: Automatic provisioning on first request after scale-to-zero

#### Resource Monitoring
- Real-time memory tracking using Linux cgroups
- Background monitoring processes with graceful shutdown
- Automatic termination on limit violations
- Webhook notifications for state changes

### **5. Authentication & Authorization**

**Complexity**: ⭐⭐⭐⭐

#### Authentication Methods
- **Email/Password**: Bcrypt hashing with JWT tokens
- **OAuth Providers**: Google OAuth 2.0, GitHub OAuth
- **Session Management**: NextAuth.js with refresh token rotation
- **Token Security**: Access tokens (24h) + refresh tokens (6 days)

#### Authorization System
- **Role-Based Access Control (RBAC)**: Per-project permissions
- **Team Collaboration**: 
  - Team creation and member invitations
  - Project-to-team linking
  - Ownership transfer
- **Permission Scopes**: `READ`, `WRITE`, `DELETE` per resource type
- **Multi-level Authorization**: Project-level and deployment-level checks

### **6. Real-Time Log Streaming**

**Complexity**: ⭐⭐⭐⭐⭐

- **Log Collection**: Fluent Bit DaemonSet captures all container stdout/stderr
- **Log Service**: gRPC service for log ingestion, indexing, and querying
- **WebSocket Streaming**: Real-time log delivery to frontend
- **Log Search**: Full-text search across deployment logs
- **Structured Logging**: JSON format with metadata (buildId, runtimeId, timestamps)

### **7. Team Collaboration**

**Complexity**: ⭐⭐⭐⭐

- **Team Management**: 
  - Create teams with ownership
  - Invite members via email
  - Role assignment (owner, member)
  - Project linking/unlinking
- **Project Sharing**: 
  - Multiple teams per project
  - Granular permission management
  - Member invitations with accept/decline flow
- **Ownership Transfer**: Team and project ownership changes

### **8. Frontend Features**

#### Console Dashboard
- **Real-Time Updates**: TanStack Query with optimistic updates
- **Infinite Scrolling**: Custom `useLoadMore` hook for pagination
- **Debounced Search**: Custom debounce hook for API optimization
- **Responsive Design**: Mobile-first with sidebar navigation
- **Theme Support**: Dark/light mode with Next Themes
- **Error Handling**: Comprehensive error boundaries and user feedback
- **Form Validation**: Zod schemas with React Hook Form integration

#### Landing Page
- **Scroll Animations**: Intersection Observer-based scroll triggers
- **Component Architecture**: Modular, reusable components
- **Documentation**: 
  - Full-text search with Ctrl+K shortcut
  - Scroll-based active section highlighting
  - Search result highlighting with navigation
  - Comprehensive deployment state machine documentation
- **SEO Optimized**: Proper meta tags and structured content

### **9. Infrastructure Features**

#### Container Lifecycle
- **Build Pods**: Ephemeral containers that build and upload artifacts
- **Runtime Pods**: Long-running containers with health monitoring
- **Resource Limits**: CPU and memory constraints via Kubernetes
- **Graceful Shutdown**: Signal handling and cleanup processes

#### Networking
- **API Gateway**: Express.js service routing to internal gRPC services
- **Ingress Service**: Custom routing for user applications
- **Service Discovery**: Kubernetes-native service discovery
- **Load Balancing**: K8s Service for pod load distribution

#### Storage
- **Static Sites**: S3-compatible object storage for build artifacts
- **Artifact Backup**: Rollback support with previous version storage
- **Environment Secrets**: Encrypted storage with injection at runtime

### **10. AI Agent Integration (MCP)**

**Complexity**: ⭐⭐⭐⭐⭐

- **MCP Server**: Fully implemented Model Context Protocol server exposing platform capabilities to AI agents.
- **OAuth 2.1 & DCR**: Implements standard OAuth 2.1 flow with Dynamic Client Registration (DCR), allowing AI agents to securely register and obtain client credentials automatically.
- **PAT Authentication**: Uses Personal Access Tokens (PAT) passed via Bearer headers for secure, scoped access to the user's platform resources.
- **Tools**: AI agents can programmatically `createProject`, `deleteProject`, `monitorDeployment`, `redeployDeployment`, and `deleteDeployment`.
- **Resources**: Exposes context resources like projects, deployments, frameworks, and domains directly to LLMs.
- **Transport**: Utilizes Streamable HTTP Server Transport for seamless communication with MCP clients like Claude Desktop.

---

## 🧩 Architecture Complexities

### **1. Monorepo Structure**

**Pattern**: Turborepo with pnpm workspaces

- **Workspace Packages**:
  - `@shipoff/proto`: Protocol Buffer definitions and generated clients
  - `@shipoff/grpc-clients`: Type-safe gRPC client wrappers
  - `@shipoff/redis`: Redis Streams consumer/producer abstractions
  - `@shipoff/services-commons`: Shared middleware and utilities
  - `@shipoff/types`: TypeScript type definitions
  - `@shipoff/typescript-config`: Shared TSConfig presets

- **Build Optimization**: 
  - Parallel builds with dependency graph
  - Incremental builds with caching
  - Type checking across workspaces

### **2. Event-Driven Architecture**

**Pattern**: Redis Streams for async event processing

**Event Flow**:
```
GitHub Webhook → Project Service → Redis Stream → Orchestrator Consumer
                                      ↓
                              Container Events → Redis Stream → State Updates
```

**Implementation**:
- Custom Redis Stream consumer/producer abstractions
- Event queuing with backoff retry logic
- Event deduplication and ordering
- Consumer groups for parallel processing

### **3. Deployment Orchestration**

**Pattern**: Event-driven container lifecycle management

**Complex Flow**:
1. Project service creates deployment entry → `QUEUED`
2. Publishes event to Redis Stream
3. Orchestrator consumer picks up event
4. Spawns build pod with environment injection
5. Build pod executes build → uploads artifacts
6. Orchestrator spawns runtime pod (dynamic) or updates static bucket
7. Runtime pod starts → health checks → `PRODUCTION` state
8. Container sends webhook events for state updates

**Challenges Solved**:
- Ensuring only one production deployment per project
- Handling container crashes and state recovery
- Coordinating between build and runtime phases
- Managing resource limits and timeouts

### **4. gRPC Service Mesh**

**Pattern**: Service-to-service communication via gRPC

**Implementation**:
- Protocol Buffer definitions for type safety
- Generated TypeScript clients for each service
- Error handling with gRPC status codes
- Request validation with Zod schemas
- Authentication middleware for service calls

**Services**:
- `AuthService`: User management, teams, permissions
- `ProjectService`: Projects, deployments, repositories
- `OrchestratorService`: Container lifecycle, clone URIs
- `LogService`: Log ingestion and streaming

### **5. Frontend State Management**

**Pattern**: Server State + Client State separation

**Architecture**:
- **Server State**: TanStack Query for API data
  - Automatic caching and refetching
  - Optimistic updates for better UX
  - Background synchronization
- **Client State**: React hooks and context
  - Session management via NextAuth
  - UI state (modals, forms) with useState
  - Sidebar state with custom provider

### **6. Security Implementation**

**Complexities**:
- **JWT Token Management**: Access + refresh token rotation
- **OAuth Flow**: Multiple providers with callback handling
- **Permission Checks**: Multi-level authorization (project, deployment, team)
- **Environment Isolation**: Blocked environment variables in build containers
- **Secret Injection**: Runtime-only secret availability

### **7. Runtime Environment Management**

**Pattern**: Custom base images with entrypoint scripts

**Implementation**:
- Base Docker images per runtime (Node.js, Python, PHP)
- Entrypoint scripts handling:
  - Repository cloning with authentication
  - Build command execution with timeout
  - Production command startup
  - Health check polling
  - Memory monitoring
  - Graceful shutdown handling
  - Webhook state updates

**Scripts**:
- `build-util.sh`: Build execution with filtered environment
- `health-check-util.sh`: Server startup validation
- `res-monitoring-util.sh`: Memory limit monitoring
- `shutdown-util.sh`: Graceful termination with rollback
- `webhook-util.sh`: State update notifications

---

## 📊 Technical Metrics

### **Codebase Scale**
- **Total Services**: 7 microservices (auth, projects, orchestrator, mcp, gateway, logs, ingress)
- **Frontend Apps**: 2 (console, landing)
- **Shared Packages**: 7 workspace packages
- **Lines of Code**: ~15,000+ (estimated)
- **Components**: 120+ React components
- **Database Models**: 15+ Prisma models across services

### **Infrastructure Components**
- **Kubernetes Resources**: 17+ K8s manifests (deployments, services, RBAC)
- **Docker Images**: 10+ (base runtimes + platform services)
- **gRPC Services**: 4 major service definitions
- **Database Schemas**: 2 separate Prisma schemas (auth, projects)

---

## 🔧 Development Workflow

### **Monorepo Management**
- **Turborepo**: Parallel task execution with dependency graph
- **pnpm Workspaces**: Efficient dependency resolution
- **TypeScript**: Shared configs with strict mode
- **ESLint**: Workspace-wide linting rules

### **Local Development**
```bash
# Start development databases
pnpm dev:db

# Start all services in development mode
pnpm dev

# Build platform runtime images
pnpm build:user:runtimes

# Build platform services
pnpm build:platform:services
```

### **Code Quality**
- TypeScript strict mode across all packages
- Zod schemas for runtime validation
- Error handling with custom error classes
- Structured logging with Winston

---

## 🎨 UI/UX Highlights

### **Design System**
- **Component Library**: 60+ Radix UI-based components
- **Theming**: CSS variables with dark/light mode support
- **Responsive**: Mobile-first with Tailwind breakpoints
- **Accessibility**: ARIA labels, keyboard navigation, focus management

### **User Experience**
- **Loading States**: Skeleton loaders and progress indicators
- **Error Feedback**: Toast notifications with actionable messages
- **Optimistic Updates**: Instant UI updates before API confirmation
- **Infinite Scroll**: Seamless pagination without page reloads
- **Real-Time Logs**: WebSocket-based live log streaming

---

## 🚦 Deployment State Machine (Detailed)

### **State Definitions**

1. **QUEUED**
   - Deployment created, waiting for orchestrator
   - Cannot be deleted or redeployed
   - Transitions: → `BUILDING`

2. **BUILDING**
   - Build container active, executing build commands
   - 5-minute timeout enforced
   - Cannot be deleted or redeployed
   - Transitions: → `PROVISIONING` or → `FAILED`

3. **PROVISIONING**
   - Runtime container starting
   - Health checks being performed
   - 5-minute server startup timeout (dynamic only)
   - Cannot be deleted or redeployed
   - Transitions: → `PRODUCTION` or → `FAILED`

4. **PRODUCTION**
   - Deployment live and serving traffic
   - Protected state (cannot be deleted)
   - Only one per project at a time
   - Auto-transitions to `INACTIVE` when replaced
   - Transitions: → `INACTIVE` (when new production deployment created)

5. **INACTIVE**
   - Previously production, now replaced
   - Stable terminal state
   - Can be deleted or redeployed
   - No automatic transitions

6. **FAILED**
   - Error occurred during build or runtime
   - Stable terminal state
   - Can be deleted or redeployed
   - No automatic transitions

### **State Transition Logic**
- Atomic database transactions ensure state consistency
- Container events trigger state updates via webhooks
- Race condition prevention with deployment locking
- Automatic cleanup of old deployments

---

## 🔒 Security Features

- **JWT-Based Authentication**: Secure token management with refresh rotation
- **OAuth Integration**: Google and GitHub OAuth 2.0
- **RBAC**: Fine-grained permission system
- **Environment Isolation**: Blocked variables in build containers
- **Secret Management**: Encrypted storage with runtime injection
- **HTTPS**: Cloudflare SSL/TLS termination
- **Kubernetes RBAC**: Service-level permissions in cluster

---

## 📈 Scalability & Performance

### **Horizontal Scaling**
- Kubernetes horizontal pod autoscaling ready
- Stateless microservices for easy replication
- Redis Streams for distributed event processing

### **Resource Optimization**
- Container resource limits prevent resource exhaustion
- Build timeout prevents stuck deployments
- Memory monitoring for early termination
- Scale-to-zero for cost optimization (free tier)

### **Frontend Performance**
- Next.js automatic code splitting
- Image optimization and lazy loading
- Static page generation where possible
- TanStack Query caching reduces API calls

---

## 🧪 Testing & Quality Assurance

- **Type Safety**: TypeScript strict mode across codebase
- **Runtime Validation**: Zod schemas for API validation
- **Error Handling**: Comprehensive error boundaries
- **Logging**: Structured logs for debugging
- **Health Checks**: Kubernetes liveness/readiness probes

---

## 📚 Project Structure

```
shipoff/
├── apps/
│   ├── console/          # Next.js dashboard application
│   ├── landing/          # Next.js marketing site
│   └── services/         # Backend microservices
│       ├── auth/         # Authentication service
│       ├── projects/     # Project management service
│       ├── orchestrator/ # Container orchestration service
│       ├── mcp/          # Model Context Protocol server for AI agents
│       ├── gateway/      # API gateway
│       ├── logs/        # Log aggregation service
│       └── ingress/     # Traffic routing service
├── packages/             # Shared workspace packages
│   ├── proto/           # Protocol Buffer definitions
│   ├── grpc-clients/    # gRPC client wrappers
│   ├── redis/           # Redis Streams utilities
│   └── services-commons/# Shared service utilities
├── infra/               # Infrastructure as code
│   ├── paas-base-runtimes/ # Container runtime images
│   └── service-configs/    # Kubernetes manifests
└── dev/                 # Development tooling
    ├── docker.compose.dev.yml
    └── k3d/             # Local K8s cluster setup
```

---

## 🎓 Key Learnings & Complexities Handled

1. **Distributed System Coordination**: Managing state across multiple services
2. **Event-Driven Architecture**: Redis Streams for reliable event processing
3. **Container Lifecycle Management**: Complex orchestration of build and runtime containers
4. **State Machine Implementation**: Enforcing business rules at multiple layers
5. **Real-Time Features**: WebSocket streaming for logs and updates
6. **Monorepo Management**: Efficient build and dependency management
7. **Type Safety**: End-to-end TypeScript with gRPC code generation
8. **Production Readiness**: Error handling, logging, monitoring, and observability

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- pnpm 9.0.0
- Docker & Docker Compose
- Kubernetes cluster (or k3d for local)

### Quick Start
```bash
# Install dependencies
pnpm install

# Start development databases
pnpm dev:db

# Start all services
pnpm dev

# Access console at http://localhost:3000
# Access landing at http://localhost:3001
```

---

## 📝 License

Shpioff - All rights reserved

---

## 👨‍💻 Author

Built with modern best practices, focusing on scalability, type safety, and developer experience.

**Technologies Demonstrated**: Microservices, Kubernetes,Redis, gRPC, Event-Driven Architecture, React, Next.js, TypeScript, Monorepo Management, CI/CD, Observability
