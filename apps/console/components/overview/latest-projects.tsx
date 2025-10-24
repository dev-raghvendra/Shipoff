import Link from "next/link"
import ProjectCard from "../projects/project-card"
import { cn } from "@/lib/utils"
import { useInfiniteProjects, useLatestProjects } from "@/hooks/use-project"

export function LatestProjects({ className }: { className?: string }) {
  const {data:items,isLoading} = useLatestProjects(4)

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
