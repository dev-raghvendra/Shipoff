import Link from "next/link"
import DeploymentCard from "../deployments/deployment-card"
import { useLatestDeployments } from "@/hooks/use-deployment"


export function LatestDeployments() {
  const {data:items,isLoading} = useLatestDeployments()
  return (
    <div className="flex flex-col gap-3">
      {items.map((d) => (
        <Link key={d.deploymentId} href={`/dashboard/deployments/${d.deploymentId}`}>
           <DeploymentCard d={d} />
        </Link>
      ))}
    </div>
  )
}
