import Link from "next/link"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GitBranch, User, GitCommit } from "lucide-react"
import DeploymentCard from "../deployments/deployment-card"

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
    project: "api-gateway",
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
    project: "docs-website",
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
    project: "worker-jobs",
    env: "production",
    status: "QUEUED",
    duration: "51s",
    createdAt: "1d ago",
    commitMessage: "Batch job enqueue optimization",
    commitAuthor: "Diego Perez",
    commitHash: "11223aa",
    branch: "main",
  },
]




export function LatestDeployments() {
  const items = MOCK_DEPLOYMENTS.slice(0, 6)

  return (
    <div className="flex flex-col gap-3">
      {items.map((d) => (
        <Link key={d.id} href={`/dashboard/deployments/${d.id}`}>
           <DeploymentCard d={d} />
        </Link>
      ))}
    </div>
  )
}
