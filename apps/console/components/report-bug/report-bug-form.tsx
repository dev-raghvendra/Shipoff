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
    <div className="space-y-6 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex items-center justify-between animate-in fade-in-0 slide-in-from-top-2 duration-300">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
            Report Bug
          </h1>
          <p className="text-sm text-muted-foreground mt-1.5">
            Create a GitHub issue for {context.title.toLowerCase()}
          </p>
        </div>
        <Badge variant="outline" className="flex items-center gap-1.5 px-3 py-1.5">
          <Github className="h-3.5 w-3.5" />
          <span>GitHub Issue</span>
        </Badge>
      </div>

      {/* Context Information */}
      <Card className="animate-in fade-in-0 slide-in-from-bottom-3 duration-500 delay-75 border-primary/10 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-primary/10">
              <Info className="h-4 w-4 text-primary" />
            </div>
            <span>{context.title} Context</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            {context.items.map((item, index) => {
              const Icon = item.icon
              return (
                <div 
                  key={index} 
                  className="flex items-center gap-3 p-2.5 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors animate-in fade-in-0 slide-in-from-left-2 duration-300"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {Icon && (
                    <div className="p-1 rounded bg-background">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <span className="font-medium text-foreground">{item.label}:</span>
                    <span className="text-muted-foreground ml-1.5 truncate block">{item.value}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* System Information */}
      {systemInfo && (
        <Card className="animate-in fade-in-0 slide-in-from-bottom-3 duration-500 delay-150 border-primary/10 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-primary/10">
                {getDeviceIcon()}
              </div>
              <span>System Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-2.5 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors">
                  <Monitor className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                  <div className="min-w-0">
                    <span className="font-medium text-foreground">Platform:</span>
                    <span className="text-muted-foreground ml-1.5">{systemInfo.platform}</span>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-2.5 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors">
                  <Globe className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                  <div className="min-w-0">
                    <span className="font-medium text-foreground">Language:</span>
                    <span className="text-muted-foreground ml-1.5">{systemInfo.language}</span>
                  </div>
                </div>
                <div className="p-2.5 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors">
                  <span className="font-medium text-foreground">Screen:</span>
                  <span className="text-muted-foreground ml-1.5">{systemInfo.screenResolution}</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="p-2.5 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors">
                  <span className="font-medium text-foreground">Timezone:</span>
                  <span className="text-muted-foreground ml-1.5">{systemInfo.timezone}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors">
                  <span className="font-medium text-foreground">Timestamp:</span>
                  <span className="text-muted-foreground ml-1.5 text-xs">
                    {new Date(systemInfo.timestamp).toLocaleString()}
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors">
                  <span className="font-medium text-foreground block mb-1">URL:</span>
                  <code className="text-xs text-muted-foreground break-all font-mono bg-background px-1.5 py-0.5 rounded">
                    {systemInfo.url}
                  </code>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Issue Form */}
      <Card className="animate-in fade-in-0 slide-in-from-bottom-3 duration-500 delay-225 border-primary/10 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-destructive/10">
              <Bug className="h-4 w-4 text-destructive" />
            </div>
            <span>Issue Details</span>
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
          <div className="border rounded-lg p-4 bg-gradient-to-br from-muted/40 to-muted/20 border-primary/10 hover:border-primary/20 transition-colors">
            <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <ExternalLink className="h-4 w-4 text-primary" />
              <span>GitHub Issue Preview</span>
            </h4>
            <div className="text-xs text-muted-foreground space-y-2.5">
              <div className="flex items-start gap-2">
                <span className="font-semibold text-foreground min-w-[60px]">Title:</span>
                <span className="flex-1">{title || `${issueTypes.find(t => t.value === issueType)?.icon || "🐛"} ${issueTypes.find(t => t.value === issueType)?.label || "Bug"} - ${context.title}`}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-foreground min-w-[60px]">Labels:</span>
                <div className="flex flex-wrap gap-1.5">
                  {labels.map((label, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs px-1.5 py-0">
                      {label}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-foreground min-w-[60px]">Repository:</span>
                <code className="text-xs font-mono bg-background px-1.5 py-0.5 rounded flex-1 truncate">
                  {repository}
                </code>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
            <Button 
              onClick={handleOpenGitHub}
              className="flex-1 group transition-all hover:scale-[1.02] active:scale-[0.98]"
              disabled={!issueType}
            >
              <Github className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
              Open GitHub Issue
            </Button>
            <Button 
              variant="outline" 
              onClick={handleCopyLink}
              disabled={!issueType}
              className="transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              {copied ? (
                <>
                  <Check className="mr-2 h-4 w-4 animate-in zoom-in-50 duration-200" />
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
          <div className="flex items-start gap-3 p-4 bg-[var(--label-alert)] rounded-lg border border-[var(--label-alert)]/50 animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
            <div className="p-1.5 rounded-md bg-[var(--label-fg-alert)]/10 flex-shrink-0">
              <AlertTriangle className="h-4 w-4 text-[var(--label-fg-alert)]" />
            </div>
            <div className="text-sm text-[var(--label-fg-alert)]">
              <p className="font-semibold mb-1">Note:</p>
              <p className="leading-relaxed">This will open GitHub in a new tab with a pre-filled issue template. You can edit the content before submitting the issue.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
