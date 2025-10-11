import Link from "next/link"
import ProjectCard from "../projects/project-card"
import { cn } from "@/lib/utils"

type Project = {
  projectId: string
  name: string
  frameworkName: string
  frameworkWordmarkName:string,
  applicationType: "Static" | "Dynamic"
  updatedAt: string
  description: string
}

const MOCK_PROJECTS: Project[] = [
  { projectId: "p1", name: "docs-website", frameworkName: "Next.js", frameworkWordmarkName:"next-js", applicationType: "Static", updatedAt: "2h ago", description: "A documentation website built with Next.js" },
  { projectId: "p2", name: "api-gateway", frameworkName: "Express", frameworkWordmarkName:"express", applicationType: "Dynamic", updatedAt: "5h ago", description: "An API gateway built with Express" },
  { projectId: "p3", name: "dashboard", frameworkName: "Next.js", frameworkWordmarkName:"next-js", applicationType: "Dynamic", updatedAt: "1d ago", description: "A dashboard application built with Next.js" },
  { projectId: "p4", name: "worker-jobs", frameworkName: "Express", frameworkWordmarkName:"express", applicationType: "Dynamic", updatedAt: "2d ago", description: "A set of worker jobs built with Express" },
]


export function LatestProjects({ className }: { className?: string }) {
  const items = MOCK_PROJECTS.slice(0, 4)

  return (
    <div className={cn("grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4", className)}>
      {items.map((p) => (
        <Link key={p.projectId} href={`/dashboard/projects/${p.projectId}`}>
          <ProjectCard item={p} />
        </Link>
      ))}
    </div>
  )
}
