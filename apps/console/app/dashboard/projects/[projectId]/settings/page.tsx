"use client"

import { ProjectNameSettings } from "@/components/projects/settings/project-info-settings"
import { RepositorySettings } from "@/components/projects/settings/repository-settings"
import { FrameworkSettings } from "@/components/projects/settings/framework-settings"
import { DomainSettings } from "@/components/projects/settings/domain-settings"
import { EnvVariablesSettings } from "@/components/projects/settings/env-var-settings"
import { useProject } from "@/hooks/use-project"
import { useEffect } from "react"
import { toast } from "sonner"
import { redirect, useParams } from "next/navigation"
import { Separator } from "@/components/ui/separator"


export default function ProjectSettingsPage() {
  const {projectId} = useParams() 
  const {data:project,updateProjectState,isLoading,error,refetch} = useProject({projectId:projectId as string})
   
  useEffect(()=>{
    if(error){
      if((error as any).code === 404){
        redirect('/error?code=404&message=Project not found')
      }
      else toast.error(error.message || "Failed to load project settings")
    }
  },[error])

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your project configuration and deployment settings</p>
      </div>

      <Separator />

      <div className="space-y-8">
        {/* General Section */}
        <section className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-1">General</h2>
            <p className="text-sm text-muted-foreground">Basic project information and identity</p>
          </div>
          <ProjectNameSettings 
            isLoading={isLoading}
            projectId={projectId as string} 
            initialName={project?.name} 
            initialDescription={project?.description} 
            refetchProject={refetch} 
          />
        </section>

        <Separator />

        {/* Source Section */}
        <section className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-1">Source Code</h2>
            <p className="text-sm text-muted-foreground">Configure your GitHub repository connection</p>
          </div>
          <RepositorySettings 
            isLoading={isLoading}
            projectId={projectId as string} 
            initialGithubRepoBranch={project?.repository?.[0]?.branch || ""} 
            initialGithubRepoFullName={project?.repository?.[0]?.githubRepoFullName || ""} 
            intialGithubRepoURI={project?.repository?.[0]?.githubRepoURI || ""} 
            initialGithubRepoRootDir={project?.repository?.[0]?.rootDir || ""} 
            refetchProject={refetch} 
          />
        </section>

        <Separator />

        {/* Build Section */}
        <section className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-1">Build & Deploy</h2>
            <p className="text-sm text-muted-foreground">Framework and build configuration for your project</p>
          </div>
          <FrameworkSettings 
            isLoading={isLoading}
            projectId={projectId as string} 
            initialFrameworkId={project?.framework?.frameworkId} 
            initialBuildCommand={project?.buildCommand} 
            initialProdCommand={project?.prodCommand} 
            initialFrameworkIcon={project?.framework?.icon}
            initialOutDir={project?.outDir} 
            refetchProject  ={refetch} 
          />
        </section>

        <Separator />

        {/* Environment Section */}
        <section className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-1">Environment</h2>
            <p className="text-sm text-muted-foreground">Manage environment variables for your deployments</p>
          </div>
          <EnvVariablesSettings 
            isLoading={isLoading}
            projectId={projectId as string} 
            initialEnvVars={project?.environmentVariables}
            applicationType={project?.framework?.applicationType as "STATIC" | "DYNAMIC"}
            refetchProject={refetch} 
          />
        </section>

        <Separator />

        {/* Domain Section */}
        <section className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-1">Domain</h2>
            <p className="text-sm text-muted-foreground">Configure your project's domain and URL</p>
          </div>
          <DomainSettings 
            isLoading={isLoading}
            projectId={projectId as string} 
            initialPrefix={project?.domain?.split(".on")[0]} 
            refetchProject={refetch} 
          />
        </section>
      </div>
    </div>
  )
}
