import ProjectCard, {ProjectItem} from "./project-card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

export function ProjectsGrid({ projects }: { projects: ProjectItem[] }) {
  if (!projects?.length) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
        <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-10 w-10 text-muted-foreground"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z"
              />
            </svg>
          </div>
          <h3 className="mt-4 text-lg font-semibold">No projects found</h3>
          <p className="mb-4 mt-2 text-sm text-muted-foreground">
            You haven&apos;t created any projects yet. Create your first project to start deploying your applications.
          </p>
          <Button asChild className="gap-2">
            <Link href="/dashboard/projects/new">
              <Plus className="size-4" />
              Create your first project
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((p) => (
        <Link key={p.projectId} href={`/dashboard/projects/${p.projectId}/overview`}>
          <ProjectCard item={p} />
        </Link>
      ))}
      
    </div>
  )
}
