"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ProjectsGrid } from "@/components/projects/projects-grid"
import { Plus } from "lucide-react"
import Link from "next/link"
import { useInfiniteProjects } from "@/hooks/use-project"
import { ProjectLimits } from "@/components/projects/project-limits"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import { useLoadMore } from "@/hooks/use-load-more"

export default function ProjectsPage() {
  const {data, isLoading, error, isFetchingNextPage, hasNextPage, fetchNextPage} = useInfiniteProjects(10)
  const { handleLoadMore, canLoadMore, isLoadingMore } = useLoadMore(hasNextPage, isFetchingNextPage, fetchNextPage)
  
  // Error handling
  useEffect(() => {
    if (error) {
      toast.error((error as any)?.message || "Failed to load projects")
    }
  }, [error])

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

        <div className="space-y-4">
          {isLoading && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, idx) => (
                <Skeleton key={idx} className="h-32 w-full rounded-lg" />
              ))}
            </div>
          )}
          
          {isLoading || <ProjectsGrid  projects={data} />}
          
          {isLoadingMore && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, idx) => (
                <Skeleton key={idx} className="h-32 w-full rounded-lg" />
              ))}
            </div>
          )}

          {canLoadMore && (
            <div className="flex justify-center pt-4">
              <Button 
                onClick={handleLoadMore}
                disabled={isLoadingMore}
                variant="outline"
                className="gap-2"
              >
                {isLoadingMore ? "Loading..." : "Load More Projects"}
              </Button>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}

