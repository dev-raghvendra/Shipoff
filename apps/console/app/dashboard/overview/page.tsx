import { LatestProjects } from "@/components/overview/latest-projects"
import { LatestDeployments } from "@/components/overview/latest-deployments"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, ArrowRight } from "lucide-react"
import Link from "next/link"

export default async function OverviewPage() {
  return (
    <div className="flex flex-col gap-8">
      {/* Welcome Section */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
        <p className="text-muted-foreground">
          Here's what's happening with your projects and deployments.
        </p>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Get started with common tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button asChild className="gap-2">
              <Link href="/dashboard/projects/new">
                <Plus className="size-4" />
                Create Project
              </Link>
            </Button>
            <Button variant="outline" asChild className="gap-2">
              <Link href="/dashboard/projects">
                View All Projects
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild className="gap-2">
              <Link href="/dashboard/teams">
                Manage Teams
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Latest Projects */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">Latest Projects</h2>
            <p className="text-sm text-muted-foreground">Your most recently updated applications</p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/dashboard/projects">View All</Link>
          </Button>
        </div>
        <LatestProjects />
      </section>

      {/* Latest Deployments */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">Latest Deployments</h2>
            <p className="text-sm text-muted-foreground">Most recent deploys across your projects</p>
          </div>
        </div>
        <LatestDeployments />
      </section>
    </div>
  )
}
