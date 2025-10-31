"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Filter } from "lucide-react"
import DeploymentCard from "@/components/deployments/deployment-card"
import { useInfiniteDeployments } from "@/hooks/use-deployment"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import { redirect, useParams } from "next/navigation"
import { useLoadMore } from "@/hooks/use-load-more"
import { useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"



export default function DeploymentsPage() {

  const params = useParams<{projectId:string}>()
  const queryClient = useQueryClient()
  const {data:deployments,isLoading,isFetchingNextPage,isError, error, hasNextPage, fetchNextPage} = useInfiniteDeployments({projectId:params.projectId})
  const { handleLoadMore, canLoadMore, isLoadingMore } = useLoadMore(hasNextPage, isFetchingNextPage, fetchNextPage)
  const router = useRouter()

  const handleDeploymentUpdate = () => {
    // Invalidate and refetch deployments
    queryClient.invalidateQueries({ queryKey: ['deployments', 'infinite', params.projectId] })
  }

  const [filterStatus, setFilterStatus] = useState<string | null>(null)
//   const [filterEnv, setFilterEnv] = useState<string | null>(null)

  const filteredDeployments = deployments.filter((d) => {
    if (filterStatus && d.status !== filterStatus) return false
    return true
  })

  const getStatusRank = (status: string) => {
    // Lower rank comes first
    switch (status) {
      case "PRODUCTION":
        return 0
      case "BUILDING":
      case "PROVISIONING":
      case "QUEUED":
        return 1
      case "FAILED":
      case "INACTIVE":
        return 2
      default:
        return 3
    }
  }

  const orderedDeployments = [...filteredDeployments].sort((a, b) => {
    const rankA = getStatusRank(a.status)
    const rankB = getStatusRank(b.status)
    if (rankA !== rankB) return rankA - rankB
    // Secondary sort: latest first by lastDeployedAt (fallback to createdAt)
    const timeA = new Date(a.lastDeployedAt || a.createdAt || 0).getTime()
    const timeB = new Date(b.lastDeployedAt || b.createdAt || 0).getTime()
    return timeB - timeA
  })

  useEffect(() => {
    if (isError && isLoading) {
      if((error as any).code==404){
        redirect(`/not-found?code=404&message=Project not found`)
      }
      else toast.error((error as any).message || "Failed to load deployments" )
    }
    else if(isError) toast.error((error as any).message || "Failed to load deployments" )
  }, [isError,isLoading,error])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Deployments</h1>
        <p className="text-muted-foreground mt-1">View all deployments for this project</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={filterStatus === null ? "default" : "outline"}
          size="sm"
          onClick={() => setFilterStatus(null)}
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          All
        </Button>
        <Button
          variant={filterStatus === "PRODUCTION" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilterStatus("PRODUCTION")}
        >
          Production
        </Button>
        <Button
          variant={filterStatus === "BUILDING" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilterStatus("BUILDING")}
        >
          Building
        </Button>
        <Button
          variant={filterStatus === "PROVISIONING" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilterStatus("PROVISIONING")}
        >
          Provisioning
        </Button>
        <Button
          variant={filterStatus === "FAILED" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilterStatus("FAILED")}
        >
          Failed
        </Button>
        <Button
          variant={filterStatus === "QUEUED" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilterStatus("QUEUED")}
        >
          Queued
        </Button>

        <div className="w-full" />

        {/* <Button variant={filterEnv === null ? "default" : "outline"} size="sm" onClick={() => setFilterEnv(null)}>
          All Environments
        </Button>
        <Button
          variant={filterEnv === "production" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilterEnv("production")}
        >
          Production
        </Button>
        <Button
          variant={filterEnv === "staging" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilterEnv("staging")}
        >
          Staging
        </Button>
        <Button
          variant={filterEnv === "preview" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilterEnv("preview")}
        >
          Preview
        </Button> */}
      </div>

      {/* Deployments List */}
      <div className="flex flex-col gap-3">
        {isLoading && (
          Array.from({ length: 3 }).map((_, idx) => (
            <Skeleton key={idx} className="h-24 w-full rounded-lg" />
          ))
        )}
        {isLoading ||orderedDeployments.length > 0 ? (
          orderedDeployments.map((d) => (
        <div key={d.deploymentId} className="cursor-pointer" onClick={(e:any)=>{
                  if(e.target.classList.contains('deployment-action-button')) return
                  router.push(`/dashboard/projects/${params.projectId}/deployments/${d.deploymentId}/overview`)
            }}>
              <DeploymentCard d={d} onUpdate={handleDeploymentUpdate} />
            </div>
          ))
        ) : deployments.length === 0 ? (
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
                    d="M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3m3 3a3 3 0 100 6h13.5a3 3 0 100-6m-16.5-3a3 3 0 013-3h13.5a3 3 0 013 3m-19.5 0a4.5 4.5 0 01.9-2.7L5.737 5.1a3.375 3.375 0 012.7-1.35h7.126c1.062 0 2.062.5 2.7 1.35l2.587 3.45a4.5 4.5 0 01.9 2.7m0 0a3 3 0 01-3 3m0 3h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008zm-3 6h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008z"
                  />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-semibold">No deployments yet</h3>
              <p className="mb-4 mt-2 text-sm text-muted-foreground">
                This project doesn&apos;t have any deployments yet. Push your code to trigger your first deployment.
              </p>
            </div>
          </div>
        ) : (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No deployments found matching your filters.
            </CardContent>
          </Card>
        )}
        {isLoadingMore && (
          <div className="flex flex-col gap-3">
            {Array.from({ length: 2 }).map((_, idx) => (
              <Skeleton key={idx} className="h-24 w-full rounded-lg" />
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
              {isLoadingMore ? "Loading..." : "Load More Deployments"}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
