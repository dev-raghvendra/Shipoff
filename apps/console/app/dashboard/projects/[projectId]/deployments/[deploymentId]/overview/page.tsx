"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { statusBadge } from "@/components/deployments/deployment-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  CheckCircle,
  XCircle,
  Clock,
  Loader2, GitBranch,
  User,
  Calendar,
  Globe,
  Code,
  Terminal, ChevronDown,
  ChevronRight, AlertTriangle
} from "lucide-react"
import { useDeployment } from "@/hooks/use-deployment"

interface DeploymentDetailPageProps {
  params: {
    projectId: string
    deploymentId: string
  }
}


const getStatusIcon = (status: string) => {
  switch (status) {
    case "PRODUCTION":
      return <CheckCircle className="h-4 w-4 text-green-600" />
    case "BUILDING":
      return <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
    case "FAILED":
      return <XCircle className="h-4 w-4 text-red-600" />
    default:
      return <Clock className="h-4 w-4 text-yellow-600" />
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "PRODUCTION":
      return "bg-green-100 text-green-800 border-green-200"
    case "BUILDING":
      return "bg-blue-100 text-blue-800 border-blue-200"
    case "FAILED":
      return "bg-red-100 text-red-800 border-red-200"
    default:
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
  }
}

export default function DeploymentDetailPage({ params }: DeploymentDetailPageProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [buildLogsOpen, setBuildLogsOpen] = useState(true)
  const [runtimeLogsOpen, setRuntimeLogsOpen] = useState(true)
  const [selectedLogIndex, setSelectedLogIndex] = useState<number | null>(null)
  const [buildSearchQuery, setBuildSearchQuery] = useState("")
  const [runtimeSearchQuery, setRuntimeSearchQuery] = useState("")
  const [isExporting, setIsExporting] = useState(false)
  const {data:deployment} = useDeployment({projectId:params.projectId,deploymentId:params.deploymentId})


  const handleExportLogs = async () => {
    setIsExporting(true)
    // try {
    //   const response = await fetch(`/api/deployments/${params.deploymentId}/export-logs`, {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({
    //       projectId: params.projectId,
    //       deploymentId: params.deploymentId,
    //       buildLogs: deployment.buildLogs,
    //       runtimeLogs: deployment.runtimeLogs
    //     })
    //   })
      
    //   if (response.ok) {
    //     const blob = await response.blob()
    //     const url = window.URL.createObjectURL(blob)
    //     const a = document.createElement('a')
    //     a.href = url
    //     a.download = `deployment-${params.deploymentId}-logs.zip`
    //     document.body.appendChild(a)
    //     a.click()
    //     window.URL.revokeObjectURL(url)
    //     document.body.removeChild(a)
    //   } else {
    //     throw new Error('Export failed')
    //   }
    // } catch (error) {
    //   console.error('Export failed:', error)
    //   // Handle error - could show a toast notification
    // } finally {
    //   setIsExporting(false)
    // }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Deployment Details</h1>
          <p className="text-sm text-muted-foreground">Deployment ID: {params.deploymentId}</p>
        </div>
        {statusBadge(deployment.status)}
      </div>

      {/* Tabs */}
      <Card>
            <CardHeader>
              <CardTitle className="text-base">Deployment Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Domain</p>
                    <p className="text-sm text-muted-foreground">{deployment.project.domain}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Code className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Repository</p>
                      <p className="text-sm text-muted-foreground">{deployment.repository.githubRepoFullName}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <GitBranch className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Branch</p>
                      <p className="text-sm text-muted-foreground">{deployment.repository.branch}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Terminal className="h-4 w-4 text-muted-foreground" />
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">Framework</p>
                      <div>
                        <img src={deployment.project.framework.icon} alt="Framework Icon" className="inline-block h-4 w-4" />
                      <p className="text-sm text-muted-foreground">{deployment.project.framework.displayName}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Code className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Commit Hash</p>
                      <p className="text-sm text-muted-foreground font-mono">{deployment.commitHash}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Commit Author</p>
                      <p className="text-sm text-muted-foreground">{deployment.author}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Deployed At</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(deployment.lastDeployedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>


          {/* Environment Sections */}
          <div className="space-y-4">
            {/* Build Environment */}
            <div className="bg-background border border-border rounded-lg overflow-hidden">
              <Collapsible open={buildLogsOpen} onOpenChange={setBuildLogsOpen}>
                <CollapsibleTrigger asChild>
                  <div className="bg-muted/50 border-b border-border px-4 py-3 cursor-pointer hover:bg-muted transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {buildLogsOpen ? (
                          <ChevronDown className="h-4 w-4 text-foreground" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-foreground" />
                        )}
                        <Terminal className="h-4 w-4 text-foreground" />
                        <div>
                          <h3 className="text-sm font-medium text-foreground">Build Logs</h3>
                          <p className="text-xs text-muted-foreground">
                            Build ID: <code className="bg-muted text-foreground px-1 rounded text-xs">{deployment.buildEnvironment[0].buildId}</code>
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge variant="outline" className="text-xs">
                          {deployment.buildLogs.length} logs
                        </Badge>
                        <div className="flex items-center gap-2">
                          <Input
                            placeholder="Search logs..."
                            value={buildSearchQuery}
                            onChange={(e) => setBuildSearchQuery(e.target.value)}
                            className="h-8 w-48 text-xs"
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="h-80 overflow-y-auto bg-background">
                    <div className="p-0">
                      {deployment.buildLogs
                        .filter(log => 
                          buildSearchQuery === "" || 
                          log.message.toLowerCase().includes(buildSearchQuery.toLowerCase())
                        )
                        .map((log, index) => (
                        <Popover key={index}>
                          <PopoverTrigger asChild>
                            <div 
                              className={`flex items-start gap-4 py-1 px-4 cursor-pointer hover:bg-muted/50 transition-colors ${
                                selectedLogIndex === index ? 'bg-muted' : ''
                              }`}
                              onClick={() => setSelectedLogIndex(selectedLogIndex === index ? null : index)}
                            >
                              <span className="text-muted-foreground text-xs font-mono flex-shrink-0 mt-0.5">
                                {new Date(log.time).toLocaleTimeString('en-US', { 
                                  hour12: false, 
                                  hour: '2-digit', 
                                  minute: '2-digit', 
                                  second: '2-digit',
                                  fractionalSecondDigits: 3
                                })}
                              </span>
                              <span className={`flex-1 font-mono text-sm ${
                                log.level === 'error' ? 'text-red-500 dark:text-red-400' : 
                                log.level === 'success' ? 'text-green-600 dark:text-green-400' : 
                                'text-foreground'
                              }`}>
                                {log.message}
                              </span>
                            </div>
                          </PopoverTrigger>
                          <PopoverContent className="w-80 p-3" align="start">
                            <div className="space-y-2">
                              <h4 className="font-medium text-sm">Log Details</h4>
                              <div className="space-y-1 text-xs">
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Level:</span>
                                  <Badge variant={log.level === 'error' ? 'destructive' : log.level === 'success' ? 'default' : 'secondary'} className="text-xs">
                                    {log.level}
                                  </Badge>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Type:</span>
                                  <span className="font-mono">{log.type}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Time:</span>
                                  <span className="font-mono">{new Date(log.time).toLocaleString()}</span>
                                </div>
                                <div className="pt-2 border-t">
                                  <span className="text-muted-foreground text-xs">Message:</span>
                                  <p className="font-mono text-xs mt-1 break-words">{log.message}</p>
                                </div>
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                      ))}
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>

            {/* Runtime Environment - Only for dynamic projects */}
            {deployment.isDynamic && (
              <div className="bg-background border border-border rounded-lg overflow-hidden">
                <Collapsible open={runtimeLogsOpen} onOpenChange={setRuntimeLogsOpen}>
                  <CollapsibleTrigger asChild>
                    <div className="bg-muted/50 border-b border-border px-4 py-3 cursor-pointer hover:bg-muted transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {runtimeLogsOpen ? (
                            <ChevronDown className="h-4 w-4 text-foreground" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-foreground" />
                          )}
                          <Globe className="h-4 w-4 text-foreground" />
                          <div>
                            <h3 className="text-sm font-medium text-foreground">Runtime Logs</h3>
                            <p className="text-xs text-muted-foreground">
                              Runtime ID: <code className="bg-muted text-foreground px-1 rounded text-xs">runtime_{deployment.id}</code>
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <Badge variant="outline" className="text-xs">
                            {deployment.runtimeLogs.length} logs
                          </Badge>
                          <div className="flex items-center gap-2">
                            <Input
                              placeholder="Search logs..."
                              value={runtimeSearchQuery}
                              onChange={(e) => setRuntimeSearchQuery(e.target.value)}
                              className="h-8 w-48 text-xs"
                              onClick={(e) => e.stopPropagation()}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="h-80 overflow-y-auto bg-background">
                      <div className="p-0">
                        {deployment.runtimeLogs
                          .filter(log => 
                            runtimeSearchQuery === "" || 
                            log.message.toLowerCase().includes(runtimeSearchQuery.toLowerCase())
                          )
                          .map((log, index) => (
                          <Popover key={index}>
                            <PopoverTrigger asChild>
                              <div 
                                className={`flex items-start gap-4 py-1 px-4 cursor-pointer hover:bg-muted/50 transition-colors ${
                                  selectedLogIndex === index ? 'bg-muted' : ''
                                }`}
                                onClick={() => setSelectedLogIndex(selectedLogIndex === index ? null : index)}
                              >
                                <span className="text-muted-foreground text-xs font-mono flex-shrink-0 mt-0.5">
                                  {new Date(log.time).toLocaleTimeString('en-US', { 
                                    hour12: false, 
                                    hour: '2-digit', 
                                    minute: '2-digit', 
                                    second: '2-digit',
                                    fractionalSecondDigits: 3
                                  })}
                                </span>
                                <span className={`flex-1 font-mono text-sm ${
                                  log.level === 'error' ? 'text-red-500 dark:text-red-400' : 
                                  log.level === 'success' ? 'text-green-600 dark:text-green-400' : 
                                  'text-foreground'
                                }`}>
                                  {log.message}
                                </span>
                              </div>
                            </PopoverTrigger>
                            <PopoverContent className="w-80 p-3" align="start">
                              <div className="space-y-2">
                                <h4 className="font-medium text-sm">Log Details</h4>
                                <div className="space-y-1 text-xs">
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Level:</span>
                                    <Badge variant={log.level === 'error' ? 'destructive' : log.level === 'success' ? 'default' : 'secondary'} className="text-xs">
                                      {log.level}
                                    </Badge>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Type:</span>
                                    <span className="font-mono">{log.type}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Time:</span>
                                    <span className="font-mono">{new Date(log.time).toLocaleString()}</span>
                                  </div>
                                  <div className="pt-2 border-t">
                                    <span className="text-muted-foreground text-xs">Message:</span>
                                    <p className="font-mono text-xs mt-1 break-words">{log.message}</p>
                                  </div>
                                </div>
                              </div>
                            </PopoverContent>
                          </Popover>
                        ))}
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            )}
          </div>


          {/* Log Persistence Warning */}
          <div className="bg-[var(--label-alert)] text-[var(--label-alert-foreground)] rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h4 className="text-sm font-medium">Log Persistence Notice</h4>
                <p className="text-sm mt-1">
                  Logs are automatically deleted after 24 hours. To preserve them permanently, export the logs using the button below.
                </p>
                <div className="mt-3">
                  <Button 
                    onClick={handleExportLogs}
                    disabled={isExporting}
                    size="sm"
                    className="bg-[var(--label-alert)] text-[var(--label-alert-foreground)] hover:bg-[var(--label-alert-foreground)] hover:text-[var(--background)] "
                  >
                    Export Logs as ZIP  
                  </Button>
                </div>
              </div>
            </div>
          </div>
    </div>
  )
}
