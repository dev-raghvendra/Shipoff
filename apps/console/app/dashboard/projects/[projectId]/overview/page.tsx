"use client"

import { ProjectOverview } from "@/components/projects/projects-overview"
import { useProject } from "@/hooks/use-project"
import { redirect, useParams } from "next/navigation"
import { useEffect } from "react"
import { toast } from "sonner"

export default function ProjectOverviewPage() {
  const {projectId} = useParams()
  const {data,isLoading,isError,error} = useProject({projectId:projectId as string})

  useEffect(()=>{
    if(isError){
      if((error as any).code==404){
        redirect(`/not-found?code=404&message=Project not found`)
      }
      else toast.error((error as any).message || "Failed to load project overview" )
    }
  },[isError,error])

  if(isError){
    return null
  }

  return (
    <div className="space-y-6">
      <ProjectOverview isLoading={isLoading} projectOverviewData={data} />
    </div>
  )
}
