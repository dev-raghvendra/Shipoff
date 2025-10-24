import { ProjectOverview, type ProjectOverviewData } from "@/components/projects/projects-overview"
import { useProject } from "@/hooks/use-project"

export default async function ProjectOverviewPage({
  params,
}: {
  params: { projectId: string }
}) {
   
  const {data} = useProject({projectId:params.projectId})

  return (
    <div className="space-y-6">
      <ProjectOverview data={data} />
    </div>
  )
}
