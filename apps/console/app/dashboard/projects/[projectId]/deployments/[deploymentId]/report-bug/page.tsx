"use client"

import { ReportBugForm } from "@/components/report-bug/report-bug-form"
import { DEPLOYMENT_CONFIG } from "@/components/report-bug/configs"

interface DeploymentReportBugPageProps {
  params: {
    projectId: string
    deploymentId: string
  }
}

export default function DeploymentReportBugPage({ params }: DeploymentReportBugPageProps) {
  const handleGenerateUrl = (data: any) => {
    const { title, description } = data
    const encodedTitle = encodeURIComponent(title)
    const encodedBody = encodeURIComponent(description)
    
    return `https://github.com/${DEPLOYMENT_CONFIG.repository}/issues/new?title=${encodedTitle}&body=${encodedBody}&labels=${DEPLOYMENT_CONFIG.labels.join(",")}`
  }

  return (
    <ReportBugForm
      context={DEPLOYMENT_CONFIG.context}
      issueTypes={DEPLOYMENT_CONFIG.issueTypes}
      priorityLevels={DEPLOYMENT_CONFIG.priorityLevels}
      repository={DEPLOYMENT_CONFIG.repository}
      labels={DEPLOYMENT_CONFIG.labels}
      onGenerateUrl={handleGenerateUrl}
    />
  )
}