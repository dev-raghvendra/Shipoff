"use client"

import { ReportBugForm } from "@/components/report-bug/report-bug-form"
import { DASHBOARD_CONFIG } from "@/components/report-bug/configs"

export default function DashboardReportBugPage() {
  const handleGenerateUrl = (data: any) => {
    const { title, description } = data
    const encodedTitle = encodeURIComponent(title)
    const encodedBody = encodeURIComponent(description)
    
    return `https://github.com/${DASHBOARD_CONFIG.repository}/issues/new?title=${encodedTitle}&body=${encodedBody}&labels=${DASHBOARD_CONFIG.labels.join(",")}`
  }

  return (
    <ReportBugForm
      context={DASHBOARD_CONFIG.context}
      issueTypes={DASHBOARD_CONFIG.issueTypes}
      priorityLevels={DASHBOARD_CONFIG.priorityLevels}
      repository={DASHBOARD_CONFIG.repository}
      labels={DASHBOARD_CONFIG.labels}
      onGenerateUrl={handleGenerateUrl}
    />
  )
}
