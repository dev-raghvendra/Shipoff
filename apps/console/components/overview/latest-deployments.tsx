"use client"
import Link from "next/link"
import DeploymentCard from "../deployments/deployment-card"
import { useLatestDeployments } from "@/hooks/use-deployment"
import { Skeleton } from "../ui/skeleton"
import { useEffect } from "react"
import { toast } from "sonner"
import { Button } from "../ui/button"
import { Plus } from "lucide-react"
import { useRouter } from "next/navigation"



export function LatestDeployments() {
  const {data:items,isLoading,isError,error} = useLatestDeployments()
  const router = useRouter()
  useEffect(()=>{
    if(isError) toast.error(error?.message || "Failed to load latest deployments" )
  },[isError,error])

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        {[...Array(4)].map((_, index) => (
          <Skeleton key={index} className="h-24 w-full rounded-lg" />
        ))}
      </div>
    )
  }

  if (items.length === 0) {
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
                d="M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3m3 3a3 3 0 100 6h13.5a3 3 0 100-6m-16.5-3a3 3 0 013-3h13.5a3 3 0 013 3m-19.5 0a4.5 4.5 0 01.9-2.7L5.737 5.1a3.375 3.375 0 012.7-1.35h7.126c1.062 0 2.062.5 2.7 1.35l2.587 3.45a4.5 4.5 0 01.9 2.7m0 0a3 3 0 01-3 3m0 3h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008zm-3 6h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008z"
              />
            </svg>
          </div>
          <h3 className="mt-4 text-lg font-semibold">No deployments yet</h3>
          <p className="mb-4 mt-2 text-sm text-muted-foreground">
            Create a project and push your code to trigger your first deployment.
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
    <div className="flex flex-col gap-3">
      {items.map((d) => (
        <div key={d.deploymentId} className="cursor-pointer" onClick={(e:any)=>{
                  if(e.target.classList.contains('deployment-action-button'))return
                  router.push(`/dashboard/projects/${d.projectId}/deployments/${d.deploymentId}/overview`)
            }}>
              <DeploymentCard d={d} />
            </div>
      ))}
    </div>
  )
}
