"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { 
  Bug, 
  ExternalLink, 
  Copy, 
  Check,
  AlertTriangle,
  Info,
  Github,
  Monitor,
  Smartphone,
  Globe
} from "lucide-react"
import { toast } from "sonner"

interface SystemInfo {
  userAgent: string
  platform: string
  language: string
  screenResolution: string
  timezone: string
  timestamp: string
  url: string
  referrer: string
}

interface IssueType {
  value: string
  label: string
  icon: string
}

interface PriorityLevel {
  value: string
  label: string
  color: string
}

interface ContextInfo {
  title: string
  description: string
  items: Array<{
    label: string
    value: string
    icon?: React.ComponentType<{ className?: string }>
  }>
}

interface ReportBugFormProps {
  context: ContextInfo
  issueTypes: IssueType[]
  priorityLevels: PriorityLevel[]
  repository: string
  labels: string[]
  onGenerateUrl: (data: {
    title: string
    description: string
    steps: string
    expected: string
    actual: string
    systemInfo: SystemInfo
  }) => string
}

export function ReportBugForm({
  context,
  issueTypes,
  priorityLevels,
  repository,
  labels,
  onGenerateUrl
}: ReportBugFormProps) {
  const [issueType, setIssueType] = useState("")
  const [priority, setPriority] = useState("medium")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [steps, setSteps] = useState("")
  const [expected, setExpected] = useState("")
  const [actual, setActual] = useState("")
  const [copied, setCopied] = useState(false)
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null)

  // Capture system information
  useEffect(() => {
    const captureSystemInfo = (): SystemInfo => {
      const now = new Date()
      return {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
        screenResolution: `${screen.width}x${screen.height}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        timestamp: now.toISOString(),
        url: window.location.href,
        referrer: document.referrer || 'Direct'
      }
    }

    setSystemInfo(captureSystemInfo())
  }, [])

  const generateGitHubIssueUrl = () => {
    if (!systemInfo) return ""
    
    const issueTypeData = issueTypes.find(t => t.value === issueType)
    const priorityData = priorityLevels.find(p => p.value === priority)
    
    const issueTitle = title || `${issueTypeData?.icon || "🐛"} ${issueTypeData?.label || "Bug"} - ${context.title}`
    
    const issueBody = `## 🐛 Bug Report - ${context.title}

${context.description}

**System Information:**
- **User Agent:** \`${systemInfo.userAgent}\`
- **Platform:** ${systemInfo.platform}
- **Language:** ${systemInfo.language}
- **Screen Resolution:** ${systemInfo.screenResolution}
- **Timezone:** ${systemInfo.timezone}
- **Timestamp:** ${new Date(systemInfo.timestamp).toLocaleString()}
- **URL:** ${systemInfo.url}
- **Referrer:** ${systemInfo.referrer}

**Issue Details:**
- **Type:** ${issueTypeData?.label || "Unknown"}
- **Priority:** ${priorityData?.label || "Medium"}

${description ? `## 📝 Description\n\n${description}\n` : ""}

${steps ? `## 🔄 Steps to Reproduce\n\n${steps}\n` : ""}

${expected ? `## ✅ Expected Behavior\n\n${expected}\n` : ""}

${actual ? `## ❌ Actual Behavior\n\n${actual}\n` : ""}

## 🔧 Additional Context
Please provide any additional context, screenshots, or error messages that might help resolve this issue.

---
*This issue was generated from Shipoff ${context.title.toLowerCase()}*`

    return onGenerateUrl({
      title: issueTitle,
      description: issueBody,
      steps,
      expected,
      actual,
      systemInfo
    })
  }

  const handleCopyLink = async () => {
    try {
      const url = generateGitHubIssueUrl()
      console.log("Generated URL:", url)
      await navigator.clipboard.writeText(url)
      setCopied(true)
      toast.success("GitHub issue link copied to clipboard!")
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast.error("Failed to copy link")
    }
  }

  const handleOpenGitHub = () => {
    window.open(generateGitHubIssueUrl(), "_blank")
  }

  const getDeviceIcon = () => {
    const userAgent = systemInfo?.userAgent.toLowerCase() || ""
    if (userAgent.includes('mobile') || userAgent.includes('android') || userAgent.includes('iphone')) {
      return <Smartphone className="h-4 w-4 text-muted-foreground" />
    }
    return <Monitor className="h-4 w-4 text-muted-foreground" />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Report Bug</h1>
          <p className="text-sm text-muted-foreground">Create a GitHub issue for {context.title.toLowerCase()}</p>
        </div>
        <Badge variant="outline" className="flex items-center gap-1">
          <Github className="h-3 w-3" />
          GitHub Issue
        </Badge>
      </div>

      {/* Context Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Info className="h-4 w-4" />
            {context.title} Context
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            {context.items.map((item, index) => {
              const Icon = item.icon
              return (
                <div key={index} className="flex items-center gap-2">
                  {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
                  <div>
                    <span className="font-medium">{item.label}:</span> {item.value}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* System Information */}
      {systemInfo && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              {getDeviceIcon()}
              System Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Monitor className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <span className="font-medium">Platform:</span> {systemInfo.platform}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <span className="font-medium">Language:</span> {systemInfo.language}
                  </div>
                </div>
                <div>
                  <span className="font-medium">Screen:</span> {systemInfo.screenResolution}
                </div>
              </div>
              <div className="space-y-2">
                <div>
                  <span className="font-medium">Timezone:</span> {systemInfo.timezone}
                </div>
                <div>
                  <span className="font-medium">Timestamp:</span> {new Date(systemInfo.timestamp).toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground break-all">
                  <span className="font-medium">URL:</span> {systemInfo.url}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Issue Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Bug className="h-4 w-4" />
            Issue Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Issue Type and Priority */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Issue Type</label>
              <Select value={issueType} onValueChange={setIssueType}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select issue type" />
                </SelectTrigger>
                <SelectContent>
                  {issueTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <span className="flex items-center gap-2">
                        <span>{type.icon}</span>
                        {type.label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Priority</label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {priorityLevels.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      <Badge className={level.color}>
                        {level.label}
                      </Badge>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="text-sm font-medium">Issue Title</label>
            <Input
              className="mt-1"
              placeholder="Brief description of the issue"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Leave empty to auto-generate from issue type
            </p>
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium">Description</label>
            <Textarea
              className="mt-1"
              rows={4}
              placeholder="Describe the issue in detail..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Steps to Reproduce */}
          <div>
            <label className="text-sm font-medium">Steps to Reproduce</label>
            <Textarea
              className="mt-1"
              rows={3}
              placeholder="1. Go to...&#10;2. Click on...&#10;3. See error..."
              value={steps}
              onChange={(e) => setSteps(e.target.value)}
            />
          </div>

          {/* Expected vs Actual */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Expected Behavior</label>
              <Textarea
                className="mt-1"
                rows={3}
                placeholder="What should happen?"
                value={expected}
                onChange={(e) => setExpected(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Actual Behavior</label>
              <Textarea
                className="mt-1"
                rows={3}
                placeholder="What actually happens?"
                value={actual}
                onChange={(e) => setActual(e.target.value)}
              />
            </div>
          </div>

          {/* Preview */}
          <div className="border rounded-lg p-4 bg-muted/30">
            <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
              <ExternalLink className="h-4 w-4" />
              GitHub Issue Preview
            </h4>
            <div className="text-xs text-muted-foreground space-y-1">
              <div><strong>Title:</strong> {title || `${issueTypes.find(t => t.value === issueType)?.icon || "🐛"} ${issueTypes.find(t => t.value === issueType)?.label || "Bug"} - ${context.title}`}</div>
              <div><strong>Labels:</strong> {labels.join(", ")}</div>
              <div><strong>Repository:</strong> {repository}</div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
            <Button 
              onClick={handleOpenGitHub}
              className="flex-1"
              disabled={!issueType}
            >
              <Github className="mr-2 h-4 w-4" />
              Open GitHub Issue
            </Button>
            <Button 
              variant="outline" 
              onClick={handleCopyLink}
              disabled={!issueType}
            >
              {copied ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy Link
                </>
              )}
            </Button>
          </div>

          {/* Info */}
          <div className="flex items-start gap-2 p-3 bg-[var(--label-alert)] rounded-lg">
            <AlertTriangle className="h-4 w-4 text-[var(--label-fg-alert)] mt-0.5 flex-shrink-0" />
            <div className="text-sm text-[var(--label-fg-alert)]">
              <p className="font-medium">Note:</p>
              <p>This will open GitHub in a new tab with a pre-filled issue template. You can edit the content before submitting the issue.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
