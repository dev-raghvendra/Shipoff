
**Shipoff** — a developer-friendly PaaS that lets users create projects, pick a framework, supply build & run commands, choose a domain, and get **automatic deployments** on every push.



## Table of contents
- [About](#about)  
- [Features](#features)  
- [Architecture & Components](#architecture--components)  
- [Microservices (what each does)](#microservices-what-each-does)  
- [Data & Communication](#data--communication)  
- [Logging & Observability](#logging--observability)  
- [CI / CD for the platform](#ci--cd-for-the-platform)  
- [Quick start (dev & k8s)](#quick-start-dev--k8s)  
- [Repository layout](#repository-layout)  
- [Configuration / env vars](#configuration--env-vars)  
- [Scaling & autoscaling](#scaling--autoscaling)  
- [Security & auth](#security--auth)  
- [Troubleshooting & tips](#troubleshooting--tips)  
- [Roadmap](#roadmap)  
- [Contributing](#contributing)  
- [License & contact](#license--contact)

---

## About
Shipoff aims to be a simple, reliable platform that supports both **static** (SPAs) and **dynamic** applications (Express, PHP, Python, Next.js, etc.).  
The user creates a project on the platform UI, configures build/run commands and domain, and Shipoff handles build, deploy, logs, scaling and analytics automatically.

---

## Features
- **Autodeployment** on every git push (per-project repo webhook).  
- **Static & Dynamic** app support (SPA builds, Node/PHP/Python/fullstack).  
- **Role-based authorization** for teams/projects.  
- **Authentication**: email/pass and OAuth (Google, GitHub).  
- **Automated up/downscaling** based on metrics.  
- **Platform CI/CD** uses Kubernetes + ArgoCD.  
- **Microservices architecture** with separate DBs for services.  
- **gRPC** for low-latency sync calls between services.  
- **Redis Streams** for async/event-driven flows (Kafka substitute).  
- **Fluent Bit** to collect logs from user containers → Log service.  
- **Grafana** for platform microservice logs/metrics dashboards.  
- **Cloudflare CDN** as the edge entrypoint for global performance & security.

---

## Architecture & Components
Flow:  
User repo → webhook (Project service) → deployment entry → Redis event → Orchestrator consumes → spawns build/prod pods → output stored (S3 or running containers) → Req service routes traffic → Cloudflare edge → end users.  

Main microservices:  
- **auth** — user registration, login, OAuth, RBAC.  
- **project** — stores project config, receives webhooks, creates deployment entries, publishes events to Redis Streams.  
- **orchestrator** — consumes deployment events, spawns build pods (ephemeral) or prod pods (long-running), tracks lifecycle via pod→webhook state updates.  
- **log** — receives logs from Fluent Bit, stores, exposes search/stream APIs.  
- **gateway (API Gateway)** — sits between internal gRPC services and nginx; handles API requests to `api.shipoff.in`.  
- **req service** — routes external traffic: dynamic → user containers; static → S3 buckets.  

Infrastructure pieces:  
- Cloudflare CDN as entrypoint.  
- Nginx reverse proxy for API traffic.  
- Kubernetes cluster(s) for workloads.  
- Container registry (private).  
- ArgoCD for platform manifests / GitOps.  
- Redis Streams for async events.  
- Postgres (per-service DBs).  
- Fluent Bit DaemonSet for logs.  
- Prometheus + Grafana for metrics/alerts.

---

## Microservices (what each does)
### auth
- Handles accounts, JWTs, sessions, OAuth (Google/GitHub), role-based access.  

### project
- Stores project config: framework, build/run commands, env vars, domain.  
- Receives webhooks on code push → creates deployment entry → publishes event to Redis Streams.  

### orchestrator
- Consumes deployment events.  
- Spawns **build pods** (exit after pushing build artifacts to S3).  
- Spawns **prod pods** (build → run production command).  
- Receives pod state webhooks to track health & lifecycle.  

### log
- Receives logs from Fluent Bit, indexes & stores.  
- Provides APIs for search & real-time streaming.  
- Integrates with Grafana dashboards.  

### gateway (API Gateway)
- Routes API traffic (`api.shipoff.in`).  
- Bridges internal gRPC services and external REST traffic.  
- Performs auth checks, request validation.  

### req service
- Routes external user app traffic.  
- If project is **dynamic** → routes to running pods.  
- If project is **static** → serves files from S3 bucket.  

---

## Data & Communication
- **Sync**: gRPC calls between services.  
- **Async**: Redis Streams for events (deployment started/completed, build finished, pod status).  
- **DB per service**: each owns its DB/schema.  

---

## Logging & Observability
- Fluent Bit collects logs from all user/app containers → pushes to Log service.  
- Prometheus scrapes metrics; Grafana visualizes dashboards.  
- Support for tracing with OpenTelemetry (planned).  

---

## CI / CD for the platform
- ArgoCD + GitOps for platform manifests.  
- GitHub Actions/GitLab CI to build images, push to registry, and update manifests.  

---

