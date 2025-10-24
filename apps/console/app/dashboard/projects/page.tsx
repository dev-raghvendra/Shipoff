import { Button } from "@/components/ui/button"
import { ProjectsGrid } from "@/components/projects/projects-grid"
import { Plus } from "lucide-react"
import Link from "next/link"
import { useInfiniteProjects } from "@/hooks/use-project"
import { ProjectLimits } from "@/components/projects/project-limits"


export default function ProjectsPage() {
  const {data} = useInfiniteProjects()

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

      <ProjectLimits projectCount={data.length} />

      {/* Projects List */}
      <section aria-label="All projects" className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing <span className="text-foreground">{data.length}</span> projects
          </p>
      
          <div />
        </div>

        <ProjectsGrid projects={data} />
      </section>
    </main>
  )
}
