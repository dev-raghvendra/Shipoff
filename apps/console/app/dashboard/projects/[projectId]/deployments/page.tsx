"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Filter } from "lucide-react"
import DeploymentCard from "@/components/deployments/deployment-card"
import { useInfiniteDeployments } from "@/hooks/use-deployment"



export default function DeploymentsPage({ params }: { params: { projectId: string } }) {

  const {data:deployments} = useInfiniteDeployments({projectId:params.projectId})

  const [filterStatus, setFilterStatus] = useState<string | null>(null)
//   const [filterEnv, setFilterEnv] = useState<string | null>(null)

  const filteredDeployments = deployments.filter((d) => {
    if (filterStatus && d.status !== filterStatus) return false
    return true
  })

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
        {filteredDeployments.length > 0 ? (
          filteredDeployments.map((d) => (
            <Link key={d.deploymentId} href={`/dashboard/projects/${params.projectId}/deployments/${d.deploymentId}`}>
              <DeploymentCard d={d} />
            </Link>
          ))
        ) : (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No deployments found matching your filters.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
