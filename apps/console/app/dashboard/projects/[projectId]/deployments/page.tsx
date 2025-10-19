"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Filter } from "lucide-react"
import DeploymentCard from "@/components/deployments/deployment-card"

type Deployment = {
  id: string
  project: string
  env: "production" | "preview" | "staging"
  status: "PRODUCTION" | "BUILDING" | "FAILED" | "QUEUED" | "PROVISIONING"
  duration: string
  createdAt: string
  commitMessage: string
  commitAuthor: string
  commitHash: string
  branch: string
}

const MOCK_DEPLOYMENTS: Deployment[] = [
  {
    id: "d1",
    project: "dashboard",
    env: "production",
    status: "PRODUCTION",
    duration: "1m 24s",
    createdAt: "2h ago",
    commitMessage: "Refactor auth flow and fix session hydration",
    commitAuthor: "Ananya Sharma",
    commitHash: "a1b2c3d",
    branch: "main",
  },
  {
    id: "d2",
    project: "dashboard",
    env: "staging",
    status: "BUILDING",
    duration: "—",
    createdAt: "3h ago",
    commitMessage: "Add rate limiting to POST /v1/ingest",
    commitAuthor: "Liam Chen",
    commitHash: "4e5f6a7",
    branch: "feat/rate-limit",
  },
  {
    id: "d3",
    project: "dashboard",
    env: "preview",
    status: "FAILED",
    duration: "38s",
    createdAt: "5h ago",
    commitMessage: "Fix broken link checks in CI",
    commitAuthor: "Sara Kim",
    commitHash: "8b9c0de",
    branch: "chore/ci",
  },
  {
    id: "d4",
    project: "dashboard",
    env: "production",
    status: "PRODUCTION",
    duration: "51s",
    createdAt: "1d ago",
    commitMessage: "Batch job enqueue optimization",
    commitAuthor: "Diego Perez",
    commitHash: "11223aa",
    branch: "main",
  },
  {
    id: "d5",
    project: "dashboard",
    env: "staging",
    status: "PRODUCTION",
    duration: "2m 15s",
    createdAt: "2d ago",
    commitMessage: "Update dependencies and security patches",
    commitAuthor: "Ananya Sharma",
    commitHash: "bb4455cc",
    branch: "main",
  },
  {
    id: "d6",
    project: "dashboard",
    env: "production",
    status: "QUEUED",
    duration: "—",
    createdAt: "3d ago",
    commitMessage: "Add new dashboard widgets",
    commitAuthor: "Liam Chen",
    commitHash: "dd6677ee",
    branch: "feat/widgets",
  },
]


export default function DeploymentsPage({ params }: { params: { projectId: string } }) {
  const [filterStatus, setFilterStatus] = useState<string | null>(null)
//   const [filterEnv, setFilterEnv] = useState<string | null>(null)

  const filteredDeployments = MOCK_DEPLOYMENTS.filter((d) => {
    if (filterStatus && d.status !== filterStatus) return false
    // if (filterEnv && d.env !== filterEnv) return false
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
            <Link key={d.id} href={`/dashboard/projects/${params.projectId}/deployments/${d.id}`}>
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
