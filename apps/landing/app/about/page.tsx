import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Github, Rocket, Code2, Database, Zap, Users, Settings, Book } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/ui/logo'
import { CONFIG } from '../config/config'

export const metadata: Metadata = {
  title: 'About | Shipoff',
  description: 'Learn about Shipoff - A modern Platform-as-a-Service built with cutting-edge technologies.',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <Logo className="h-8" />
            </Link>
            <div className="flex items-center gap-4">
              <Button variant="ghost" asChild size="sm">
                <Link href="/">
                  <ArrowLeft className="size-4 mr-2" />
                  Back to Home
                </Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/login">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-4xl">
        <div className="prose prose-slate dark:prose-invert max-w-none">
          {/* Header */}
          <div className="mb-8">
            <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
              <ArrowLeft className="size-4 mr-2" />
              Back to Home
            </Link>
            <h1 className="text-4xl font-bold mb-4">About Shipoff</h1>
            <p className="text-lg text-muted-foreground">
              A modern Platform-as-a-Service built with passion and cutting-edge technology
            </p>
          </div>

          {/* Creator Section */}
          <section className="mb-12">
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-6">
              <div className="flex items-start gap-4">
                <Github className="size-8 text-primary shrink-0 mt-1" />
                <div className="flex-1">
                  <h2 className="text-2xl font-semibold mb-2 flex items-center gap-2">
                    Created by
                    <a 
                      href="https://github.com/dev-raghvendra" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline inline-flex items-center gap-2"
                    >
                      dev-raghvendra
                      <Github className="size-4" />
                    </a>
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Shipoff was created by <strong>dev-raghvendra</strong> as a demonstration of modern software engineering 
                    practices, distributed systems architecture, and full-stack development expertise. This project showcases 
                    production-ready development skills across the entire technology stack.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* What is Shipoff */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <Rocket className="size-8 text-primary" />
              What is Shipoff?
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              <strong>Shipoff</strong> is a production-ready, developer-friendly Platform-as-a-Service (PaaS) that automates 
              the entire deployment pipeline—from code push to production. Users simply connect their GitHub repositories, 
              configure build commands, and get automatic deployments on every push with zero configuration overhead.
            </p>
            
            <div className="bg-muted p-6 rounded-lg mb-6">
              <p className="font-semibold mb-3">Live Platform Features:</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Deploy static sites, full-stack applications (Node.js, Python, PHP), and modern frameworks</li>
                <li>Automatic scaling, CDN distribution, and comprehensive monitoring</li>
                <li>Real-time log streaming and observability</li>
                <li>Team collaboration and project management</li>
                <li>Zero-downtime deployments with automatic rollback</li>
              </ul>
            </div>

            <p className="text-muted-foreground leading-relaxed">
              Shipoff competes with platforms like <strong>Vercel</strong>, <strong>Netlify</strong>, and <strong>Railway</strong>, 
              demonstrating expertise in distributed systems, Kubernetes orchestration, event-driven architecture, and 
              production-grade frontend development.
            </p>
          </section>

          {/* Documentation Reference */}
          <section className="mb-12">
            <div className="border-l-4 border-primary pl-6 py-4 bg-primary/5 rounded-r-lg">
              <h2 className="text-2xl font-semibold mb-3 flex items-center gap-2">
                <Book className="size-6 text-primary" />
                Documentation
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                For detailed information about how to use Shipoff, including getting started guides, framework support, 
                deployment state machine, and troubleshooting, please refer to our comprehensive documentation.
              </p>
              <Button asChild>
                <Link href="/docs">
                  <Book className="size-4 mr-2" />
                  View Documentation
                </Link>
              </Button>
            </div>
          </section>

          {/* Project Summary */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Project Summary</h2>
            
            {/* Architecture Overview */}
            <div className="mb-8">
              <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <Database className="size-6 text-primary" />
                Architecture Overview
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Shipoff is a <strong>microservices-based PaaS platform</strong> built with modern distributed systems 
                principles. The architecture consists of:
              </p>
              
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Code2 className="size-5 text-primary" />
                    Frontend Applications
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• <strong>Console Dashboard:</strong> Next.js 15 with React 19</li>
                    <li>• <strong>Landing Page:</strong> Marketing site with docs</li>
                    <li>• 60+ Radix UI components</li>
                    <li>• TanStack Query for state</li>
                  </ul>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Settings className="size-5 text-primary" />
                    Backend Services
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• <strong>6 Microservices:</strong> Auth, Projects, Orchestrator, Gateway, Logs, Ingress</li>
                    <li>• <strong>gRPC:</strong> Type-safe inter-service communication</li>
                    <li>• <strong>Redis Streams:</strong> Event-driven architecture</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Core Technologies */}
            <div className="mb-8">
              <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <Zap className="size-6 text-primary" />
                Technology Stack
              </h3>
              
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Frontend</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Next.js 15.2.4 with App Router</li>
                    <li>• React 19 with TypeScript</li>
                    <li>• Tailwind CSS v4</li>
                    <li>• TanStack Query v5</li>
                    <li>• NextAuth.js for authentication</li>
                    <li>• Framer Motion for animations</li>
                  </ul>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Backend</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• TypeScript 5.8+ (strict mode)</li>
                    <li>• Node.js 18+</li>
                    <li>• gRPC with Protocol Buffers</li>
                    <li>• PostgreSQL with Prisma ORM</li>
                    <li>• Redis Streams for events</li>
                    <li>• Express.js for API Gateway</li>
                  </ul>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Infrastructure</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Kubernetes for orchestration</li>
                    <li>• Docker with multi-stage builds</li>
                    <li>• Fluent Bit for log aggregation</li>
                    <li>• Prometheus & Grafana for monitoring</li>
                    <li>• Cloudflare CDN for edge distribution</li>
                    <li>• S3-compatible storage</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Key Features */}
            <div className="mb-8">
              <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <Rocket className="size-6 text-primary" />
                Key Features & Capabilities
              </h3>
              
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4 py-2">
                  <h4 className="font-semibold mb-2">1. Automated Deployment Pipeline</h4>
                  <p className="text-sm text-muted-foreground">
                    GitHub webhook integration with a complex state machine managing deployment lifecycle: 
                    QUEUED → BUILDING → PROVISIONING → PRODUCTION / FAILED / INACTIVE. Automatic rollback 
                    on failures, production protection, and multi-stage container builds.
                  </p>
                </div>
                
                <div className="border-l-4 border-green-500 pl-4 py-2">
                  <h4 className="font-semibold mb-2">2. Project Management System</h4>
                  <p className="text-sm text-muted-foreground">
                    Support for static and dynamic projects with framework auto-detection. Multi-step 
                    configuration wizard, GitHub OAuth integration, environment variable management, 
                    and domain selection with validation.
                  </p>
                </div>
                
                <div className="border-l-4 border-purple-500 pl-4 py-2">
                  <h4 className="font-semibold mb-2">3. Resource Management</h4>
                  <p className="text-sm text-muted-foreground">
                    Free tier with 5-minute build timeouts, 512MB memory limits, automatic scale-to-zero 
                    for dynamic projects, real-time memory monitoring, and graceful shutdown handling.
                  </p>
                </div>
                
                <div className="border-l-4 border-orange-500 pl-4 py-2">
                  <h4 className="font-semibold mb-2">4. Real-Time Log Streaming</h4>
                  <p className="text-sm text-muted-foreground">
                    Fluent Bit DaemonSet for log collection, gRPC log service, WebSocket streaming 
                    to frontend, full-text search across deployment logs, and structured JSON logging.
                  </p>
                </div>
                
                <div className="border-l-4 border-pink-500 pl-4 py-2">
                  <h4 className="font-semibold mb-2">5. Team Collaboration</h4>
                  <p className="text-sm text-muted-foreground">
                    Team creation and management, role-based access control (RBAC), project sharing, 
                    member invitations, and ownership transfer capabilities.
                  </p>
                </div>
              </div>
            </div>

            {/* Supported Runtimes */}
            <div className="mb-8">
              <h3 className="text-2xl font-semibold mb-4">Supported Runtimes</h3>
              
              <div className="grid md:grid-cols-3 gap-4">
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Node.js</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Static: React, Vue, Angular</li>
                    <li>• Dynamic: Express, Nest.js, Fastify</li>
                  </ul>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Python</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Django</li>
                    <li>• Flask</li>
                    <li>• FastAPI</li>
                  </ul>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-2">PHP</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Laravel</li>
                    <li>• Symfony</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Project Statistics */}
            <div className="mb-8">
              <h3 className="text-2xl font-semibold mb-4">Project Scale</h3>
              
              <div className="grid md:grid-cols-3 gap-4">
                <div className="border rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-primary mb-2">6+</div>
                  <div className="text-sm text-muted-foreground">Microservices</div>
                </div>
                
                <div className="border rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-primary mb-2">120+</div>
                  <div className="text-sm text-muted-foreground">React Components</div>
                </div>
                
                <div className="border rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-primary mb-2">15K+</div>
                  <div className="text-sm text-muted-foreground">Lines of Code</div>
                </div>
              </div>
            </div>

            {/* Complexities Handled */}
            <div className="mb-8">
              <h3 className="text-2xl font-semibold mb-4">Technical Complexities</h3>
              
              <div className="bg-muted p-6 rounded-lg">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• <strong>Distributed System Coordination:</strong> Managing state across multiple services</li>
                  <li>• <strong>Event-Driven Architecture:</strong> Redis Streams for reliable event processing</li>
                  <li>• <strong>Container Lifecycle Management:</strong> Complex orchestration of build and runtime containers</li>
                  <li>• <strong>State Machine Implementation:</strong> Enforcing business rules at multiple layers</li>
                  <li>• <strong>Real-Time Features:</strong> WebSocket streaming for logs and updates</li>
                  <li>• <strong>Monorepo Management:</strong> Efficient build and dependency management with Turborepo</li>
                  <li>• <strong>Type Safety:</strong> End-to-end TypeScript with gRPC code generation</li>
                  <li>• <strong>Production Readiness:</strong> Error handling, logging, monitoring, and observability</li>
                </ul>
              </div>
            </div>

            {/* Development Practices */}
            <div className="mb-8">
              <h3 className="text-2xl font-semibold mb-4">Development Practices</h3>
              
              <div className="space-y-3 text-sm text-muted-foreground">
                <p>
                  <strong>Monorepo Structure:</strong> Turborepo with pnpm workspaces for efficient dependency 
                  resolution and parallel builds. Shared packages for proto definitions, gRPC clients, Redis 
                  utilities, and common services.
                </p>
                <p>
                  <strong>Type Safety:</strong> TypeScript strict mode across all packages with runtime validation 
                  using Zod schemas. Generated TypeScript clients for gRPC services ensuring type safety end-to-end.
                </p>
                <p>
                  <strong>Infrastructure as Code:</strong> Kubernetes manifests, Docker images, and service 
                  configurations version controlled. GitOps workflows with ArgoCD for automated deployments.
                </p>
              </div>
            </div>

            {/* Call to Action */}
            <div className="mt-12 p-6 bg-primary/10 border border-primary/20 rounded-lg text-center">
              <h3 className="text-2xl font-semibold mb-3">Ready to Get Started?</h3>
              <p className="text-muted-foreground mb-6">
                Deploy your applications with Shipoff and experience zero-configuration deployments, 
                automatic scaling, and comprehensive monitoring.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button asChild size="lg">
                  <Link href="https://console.shipoff.in/login">Get Started</Link>
                </Button>
                <Button variant="outline" asChild size="lg">
                  <Link href="/docs">View Docs</Link>
                </Button>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
