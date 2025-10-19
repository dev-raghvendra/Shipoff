import { Button } from "@/components/ui/button"
import { ProjectsGrid } from "@/components/projects/projects-grid"
import { Plus } from "lucide-react"
import Link from "next/link"

type Project = {
  projectId: string
  name: string
  frameworkName: "Next.js" | "Node.js" | "Remix" | "Nuxt" | "SvelteKit" | string
  frameworkWordmarkName:string,
  applicationType: "Static" | "Dynamic"
  updatedAt: string
  description: string
}

const MOCK_PROJECTS: Project[] = [
  {
    projectId: "1",
    name: "marketing-site",
    frameworkName: "Flask",
    applicationType: "Dynamic",
    updatedAt: "Updated 2h ago",
    frameworkWordmarkName:"flask",
    description: "Public website and blog",
  },
  {
    projectId: "2",
    name: "api-gateway",
    frameworkName: "FastAPI",
    applicationType: "Dynamic",
    updatedAt: "Updated 1d ago",
    frameworkWordmarkName:"fastapi",
    description: "Service routing and auth",
  },
  {
    projectId: "3",
    name: "docs",
    frameworkName: "Svelte",
    frameworkWordmarkName:"svelte",
    applicationType: "Static",
    updatedAt: "Updated 3d ago",
    description: "Developer documentation",
  },
  {
    projectId: "4",
    name: "dashboard",
    frameworkName: "Next.js",
    frameworkWordmarkName:"next-js",
    applicationType: "Dynamic",
    updatedAt: "Updated 20m ago",
    description: "Internal admin portal",
  },
  {
    projectId: "5",
    name: "payments",
    frameworkName: "Angular",
    frameworkWordmarkName:"angular-js",
    applicationType: "Static",
    updatedAt: "Updated 5d ago",
    description: "Checkout and billing",
  },
  {
    projectId: "6",
    name: "landing-v2",
    frameworkName: "React.js",
    frameworkWordmarkName:"next-js",
    applicationType: "Dynamic",
    updatedAt: "Updated 8h ago",
    description: "A/B test variant",
  },
]

const LIMIT_TOTAL = 10
const LIMIT_USED = MOCK_PROJECTS.length
const LIMIT_REMAINING = Math.max(0, LIMIT_TOTAL - LIMIT_USED)
const PERCENT = Math.min(100, Math.round((LIMIT_USED / LIMIT_TOTAL) * 100))

export default function ProjectsPage() {
  return (
    <main className="flex flex-col gap-6">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-balance">Projects</h1>
          <p className="text-sm text-muted-foreground">Manage your applications, frameworks, and deployments</p>
        </div>
        <Button asChild className="gap-2">
          <Link href="/dashboard/projects/new">
            <Plus className="size-4" />
            Create Project
          </Link>
        </Button>
      </header>

      {/* Usage / Limits */}
      <section aria-label="Project limits" className="rounded-lg border">
        <div className="flex flex-col gap-3 p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Limit: <span className="text-foreground">{LIMIT_TOTAL}</span> projects
            </div>
            <div className="text-sm text-muted-foreground">
              Used: <span className="text-foreground">{LIMIT_USED}</span> • Available:{" "}
              <span className="text-foreground">{LIMIT_REMAINING}</span>
            </div>
          </div>
          <div className="h-2 w-full overflow-hidden rounded bg-muted">
            <div
              className="h-full bg-primary transition-all"
              style={{ width: `${PERCENT}%` }}
              aria-label={`Projects used ${LIMIT_USED} of ${LIMIT_TOTAL}`}
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={LIMIT_TOTAL}
              aria-valuenow={LIMIT_USED}
            />
          </div>
        </div>
      </section>

      {/* Projects List */}
      <section aria-label="All projects" className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing <span className="text-foreground">{LIMIT_USED}</span> projects
          </p>
          {/* Placeholder for filters/search in future */}
          <div />
        </div>

        <ProjectsGrid projects={MOCK_PROJECTS} />
      </section>
    </main>
  )
}
