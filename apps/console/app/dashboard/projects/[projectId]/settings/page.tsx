import { ProjectNameSettings } from "@/components/projects/settings/project-info-settings"
import { RepositorySettings } from "@/components/projects/settings/repository-settings"
import { FrameworkSettings } from "@/components/projects/settings/framework-settings"
import { DomainSettings } from "@/components/projects/settings/domain-settings"
import { EnvVariablesSettings } from "@/components/projects/settings/env-var-settings"

interface ProjectSettingsPageProps {
  params: { projectId: string }
}

export default function ProjectSettingsPage({ params }: ProjectSettingsPageProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Project Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your project configuration</p>
      </div>

      <ProjectNameSettings projectId={params.projectId} />
      <RepositorySettings projectId={params.projectId} />
      <FrameworkSettings projectId={params.projectId} />
      <EnvVariablesSettings projectId={params.projectId} />
      <DomainSettings projectId={params.projectId} />
    </div>
  )
}
