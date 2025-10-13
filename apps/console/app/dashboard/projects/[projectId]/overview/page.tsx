import { ProjectOverview, type ProjectOverviewData } from "@/components/projects/projects-overview"

function getMockProject(projectId: string): ProjectOverviewData {
  // In the next step, replace this with server-fetched data.
  return {
    id: projectId,
    name: "my-paas-app",
    framework:{
      frameworkIcon:"https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg",
      frameworkName:"Next.js",
      frameworkWordmarkName:"next-js",
      applicationType:"DYNAMIC"
    },
    branch: "main",
    repoUrl: "https://github.com/example/my-paas-app",
    team: [
      {
        id: "team_1",
        name: "Core Platform",
        description: "Owns core infra, deployments, and internal tooling.",
        members: [
          { id: "u1", name: "You", email: "you@example.com", role: "Owner" }
        ]
      }
    ],
    createdAt: "2025-01-12",
    updatedAt: "2025-10-10",
    defaultDomain: "my-paas-app.example.com",
    domains: ["www.my-paas-app.example.com", "staging.my-paas-app.example.com"],
    description: "Web app for managing deployments and environments.",
    outDir: ".next",
    buildCommand: "next build",
    prodCommand: "next start -p 3000",
    recentDeployments: [
      {
        id: "dpl_1",
        status: "BUILDING",
        commitMessage: "feat: add healthcheck endpoint",
        commitHash: "a1b2c3d",
        createdAt:"2025-01-12",
        commitAuthor: "Alice",
        branch: "main",
        duration: "5m 30s",
        env: "production",
        project: "my-paas-app"
      },
      {
        id: "dpl_2",
        status: "BUILDING",
        commitMessage: "chore: bump deps",
        commitHash: "9f8e7d6",
        createdAt:"2025-01-13",
        commitAuthor: "Alice",
        branch: "main",
        duration: "5m 30s",
        env: "production",
        project: "my-paas-app"
      },
    ],
  }
}

export default async function ProjectOverviewPage({
  params,
}: {
  params: { projectId: string }
}) {
  const data = getMockProject(params.projectId)

  return (
    <div className="space-y-6">
      <ProjectOverview data={data} />
    </div>
  )
}
