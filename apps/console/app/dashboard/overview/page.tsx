import { LatestProjects } from "@/components/overview/latest-projects"
import { LatestDeployments } from "@/components/overview/latest-deployments"

export default async function OverviewPage() {
  // In the future, fetch real data on the server and pass it down as props.
  // For now, we’ll use placeholder data within the components.

  return (
    <div className="flex flex-col gap-14">
      <section className="flex flex-col gap-3">
        <div>
          <h2 className="text-lg font-semibold text-pretty">Latest projects</h2>
          <p className="text-sm text-muted-foreground">Your most recently updated applications.</p>
        </div>
        <LatestProjects />
      </section>

      <section className="flex flex-col gap-3">
        <div>
          <h2 className="text-lg font-semibold text-pretty">Latest deployments</h2>
          <p className="text-sm text-muted-foreground">Most recent deploys across your projects.</p>
        </div>
        <LatestDeployments />
      </section>
    </div>
  )
}
