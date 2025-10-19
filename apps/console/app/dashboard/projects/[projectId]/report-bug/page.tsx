"use client"

import { ReportBugForm } from "@/components/report-bug/report-bug-form"
import { PROJECT_CONFIG } from "@/components/report-bug/configs"

interface ProjectReportBugPageProps {
  params: {
    projectId: string
  }
}

export default function ProjectReportBugPage({ params }: ProjectReportBugPageProps) {
  const handleGenerateUrl = (data: any) => {
    const { title, description } = data
    const encodedTitle = encodeURIComponent(title)
    const encodedBody = encodeURIComponent(description)
    
    return `https://github.com/dev-raghvendra/Shipoff/issues/new?title=${encodedTitle}&body=${encodedBody}&labels=${PROJECT_CONFIG.labels.join(",")}`
  }

  return (
    <ReportBugForm
      context={PROJECT_CONFIG.context}
      issueTypes={PROJECT_CONFIG.issueTypes}
      priorityLevels={PROJECT_CONFIG.priorityLevels}
      repository={PROJECT_CONFIG.repository}
      labels={PROJECT_CONFIG.labels}
      onGenerateUrl={handleGenerateUrl}
    />
  )
}
