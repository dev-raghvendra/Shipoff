"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Globe, ChevronDown, ChevronRight, Copy, Download, Filter, Check } from "lucide-react"
import { ExtendLogBodyType, LOGS_WS_EVENTS } from "@shipoff/types"
import { logsService } from "@/services/logs.service"
import { toast } from "sonner"
import { authService } from "@/services/auth.service"
import { Button } from "@/components/ui/button"
import { useIsMobile } from "@/hooks/use-mobile"


interface RuntimeEnvironmentData {
  runtimeId: string
  environmentId: string
  projectId: string
  status: string
}

interface RuntimeEnvironmentProps {
  data?: RuntimeEnvironmentData
  isLoading?: boolean
}

export function RuntimeEnvironment({ data, isLoading = false }: RuntimeEnvironmentProps) {
  const [runtimeLogsOpen, setRuntimeLogsOpen] = useState(true)
  const [runtimeLogs, setRuntimeLogs] = useState<ExtendLogBodyType[]>([])
  const [selectedLogIndex, setSelectedLogIndex] = useState<number | null>(null)
  const [logsStream, setLogsStream] = useState<WebSocket | null>(null)
  const [wsLogsBuffer, setWsLogsBuffer] = useState<ExtendLogBodyType[]>([])
  const haveStaticLogsReceived = useRef(false)
  const [logsCopied, setLogsCopied] = useState(false)
  const [runtimeSearchQuery, setRuntimeSearchQuery] = useState("")
  const [logLevelFilter, setLogLevelFilter] = useState<string>("ALL")
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null)
  const statusesToKeepAlive = ["PRODUCTION"]
  const isMobile = useIsMobile()

  const getLogsStream = useCallback(async () => {
    try {
      const res = await authService.getWSAuthToken()
      const stream = logsService.streamLogs({
        projectId: data!.projectId,
        environmentId: data!.environmentId,
        accessToken: res.res.wsAuthToken
      })
      return stream
    } catch (error: any) {
      toast.error(error.message || "Failed to get WS auth token for logs streaming")
      return null
    }
  }, [data])

  useEffect(() => {
    if (!data) return
    getLogsStream().then((stream) => setLogsStream(stream))

    return () => {
      if (logsStream) {
        logsStream.close()
        setLogsStream(null)
        setWsLogsBuffer([])
        haveStaticLogsReceived.current = false
        setRuntimeLogs([])
      }
    }
  }, [isLoading, data?.environmentId])

  useEffect(() => {
    if (logsStream) {
      logsStream.onmessage = (event) => {
        const logData: ExtendLogBodyType = JSON.parse(event.data)
        if (logData.message === LOGS_WS_EVENTS.STATIC_LOGS_COMPLETE) return haveStaticLogsReceived.current = true
        haveStaticLogsReceived.current
          ? setWsLogsBuffer((prev) => [...prev, logData])
          : setRuntimeLogs((prev) => [...prev, logData])
      }
    }
  }, [logsStream])

  useEffect(() => {
    if (haveStaticLogsReceived.current && wsLogsBuffer.length > 0) {
      const finalLogs = Object.values(
        wsLogsBuffer.reduce((acc, log) => {
          acc[log.logId] = log
          return acc
        }, {} as Record<string, ExtendLogBodyType>))
      setRuntimeLogs((prev) => [...prev, ...finalLogs])
      setWsLogsBuffer([])
    }
  }, [wsLogsBuffer])

  useEffect(() => {
    if (!runtimeLogs.length) return
    const timeout = setTimeout(() => {
      logsStream?.close()
      setLogsStream(null)
    }, 30000)
    setTimeoutId(timeout)

    return () => {
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [runtimeLogs.length])

  useEffect(() => {
    if (!data) return
    if (!haveStaticLogsReceived.current) return
    if (statusesToKeepAlive.includes(data.status)) return
    clearTimeout(timeoutId!)
    logsStream?.close()
    setLogsStream(null)
  }, [data?.status])

  const copyAllLogs = () => {
    if (runtimeLogs.length === 0) return
    if (logsCopied) return
    const logsText = runtimeLogs.map(log => `[${new Date(log.timestamp).toISOString()}] [${log.level}] ${log.message}`).join('\n')
    navigator.clipboard.writeText(logsText)
    setLogsCopied(true)
    setTimeout(() => setLogsCopied(false), 2000)
  }


  const filteredLogs = runtimeLogs.filter(log => {
    const matchesSearch = runtimeSearchQuery === "" || log.message.toLowerCase().includes(runtimeSearchQuery.toLowerCase())
    const matchesLevel = logLevelFilter === "ALL" || log.level === logLevelFilter
    return matchesSearch && matchesLevel
  })
  


  if (isLoading) {
    return (
      <div className="bg-background border border-border rounded-lg overflow-hidden">
        <div className="bg-muted/50 border-b border-border px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-4" />
              <div className="space-y-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-40" />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-8 w-48" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="bg-background border border-border rounded-lg overflow-hidden">
        <div className="bg-muted/50 border-b border-border px-4 py-3">
          <div className="flex items-center gap-3">
            <Globe className="h-4 w-4 text-muted-foreground" />
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Runtime Logs</h3>
              <p className="text-xs text-muted-foreground">No runtime data available</p>
            </div>
          </div>
        </div>
        <div className="p-8 text-center">
          <p className="text-sm text-muted-foreground">Runtime environment data is not available for this deployment.</p>
        </div>
      </div>
    )
  }


 

  const getLevelStyles = (level: string) => {
    switch (level) {
      case 'ERROR':
        return {
          color: 'var(--label-fg-destructive)',
          backgroundColor: 'var(--label-bg-destructive)'
        }
      case 'SUCCESS':
        return {
          color: 'var(--label-fg-success)',
          backgroundColor: 'var(--label-bg-success)'
        }
      default: // INFO
        return {
          color: '#3b82f6',
          backgroundColor: 'rgb(59 130 246 / 0.1)'
        }
    }
  }

  return (
    <div className="bg-background border border-border rounded-lg overflow-hidden shadow-sm">
      <Collapsible open={runtimeLogsOpen} onOpenChange={setRuntimeLogsOpen}>
        <CollapsibleTrigger asChild>
          <div className="bg-muted/30 border-b border-border px-5 py-4 cursor-pointer hover:bg-muted/50 transition-all duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {runtimeLogsOpen ? (
                  <ChevronDown className="h-5 w-5 text-foreground transition-transform" />
                ) : (
                  <ChevronRight className="h-5 w-5 text-foreground transition-transform" />
                )}
                <div className="flex items-center gap-2 px-2 py-1 rounded-md bg-green-500/10 border border-green-500/20">
                  <Globe className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-base font-semibold text-foreground">Runtime Logs</h3>
                  <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                    <span className="flex-shrink-0">Runtime ID:</span>
                    <code className="bg-muted/80 text-foreground px-1.5 py-0.5 rounded text-xs font-mono truncate max-w-[150px] sm:max-w-none inline-block">{data.runtimeId}</code>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground">
                  {filteredLogs.length} / {runtimeLogs.length} logs
                </span>
              </div>
            </div>
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          {/* Filter and Actions Bar */}
          <div className="border-b border-border bg-muted/20 px-5 py-3">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-1">
                <Input
                  placeholder="Search logs..."
                  value={runtimeSearchQuery}
                  onChange={(e) => setRuntimeSearchQuery(e.target.value)}
                  className="h-9 max-w-xs text-sm"
                />
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <select 
                    value={logLevelFilter} 
                    onChange={(e) => setLogLevelFilter(e.target.value)}
                    className="h-9 px-3 text-sm border border-border rounded-md bg-background"
                  >
                    <option value="ALL">All</option>
                    <option value="INFO">Info</option>
                    <option value="SUCCESS">Success</option>
                    <option value="ERROR">Error</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={copyAllLogs}
                  className="h-9"
                >
                  {logsCopied 
                  ? <><Check className="h-3.5 w-3.5 mr-1.5" />
                  Copied</>
                  :<><Copy className="h-3.5 w-3.5 mr-1.5" />
                  Copy</>}
                </Button>
              </div>
            </div>
          </div>

          <div className="h-96 overflow-y-auto bg-zinc-50 dark:bg-zinc-950">
            {runtimeLogs.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-8">
                <div className="p-4 rounded-full bg-muted/50 mb-4">
                  <Globe className="h-10 w-10 text-muted-foreground/50" />
                </div>
                <p className="text-sm font-medium text-muted-foreground">No logs to display</p>
                <p className="text-xs text-muted-foreground/70 mt-1">Runtime logs will appear here once the application starts</p>
              </div>
            ) : filteredLogs.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-8">
                <p className="text-sm text-muted-foreground">No logs match your filters</p>
                <p className="text-xs text-muted-foreground/70 mt-1">Try adjusting your search or filter criteria</p>
              </div>
            ) : (
              <div className="p-0 font-mono text-sm">
                {filteredLogs.map((log, index) => {
                  const logContent = (
                    <div 
                      className={`flex items-start gap-4 py-2 px-5 ${!isMobile ? 'cursor-pointer' : ''} hover:bg-zinc-100 dark:hover:bg-zinc-900/50 transition-colors border-l-2 ${
                        log.level === 'ERROR' ? 'border-l-red-500/50' : 
                        log.level === 'SUCCESS' ? 'border-l-green-500/50' : 
                        'border-l-transparent'
                      } ${selectedLogIndex === index ? 'bg-zinc-100 dark:bg-zinc-900/70' : ''}`}
                      onClick={() => !isMobile && setSelectedLogIndex(selectedLogIndex === index ? null : index)}
                    >
                      <span className="text-zinc-400 dark:text-zinc-500 text-xs font-mono flex-shrink-0 mt-0.5 select-none w-[85px]">
                        {new Date(log.timestamp).toLocaleTimeString('en-US', { 
                          hour12: false, 
                          hour: '2-digit', 
                          minute: '2-digit', 
                          second: '2-digit',
                          fractionalSecondDigits: 3
                        })}
                      </span>
                      <span 
                        className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded flex-shrink-0 font-medium mt-0.5"
                        style={getLevelStyles(log.level)}
                      >
                        {log.level}
                      </span>
                      <span className="flex-1 text-sm leading-relaxed text-zinc-900 dark:text-zinc-100">
                        {log.message}
                      </span>
                    </div>
                  )

                  return isMobile ? (
                    <div key={log.logId}>{logContent}</div>
                  ) : (
                    <Popover key={log.logId}>
                      <PopoverTrigger asChild>
                        {logContent}
                      </PopoverTrigger>
                      <PopoverContent className="w-72 p-2.5 shadow-sm" align="start" side="right">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between pb-1.5 border-b border-border/50">
                            <h4 className="font-medium text-[10px] text-muted-foreground uppercase tracking-wider">Details</h4>
                            <span 
                              className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded font-medium"
                              style={getLevelStyles(log.level)}
                            >
                              {log.level}
                            </span>
                          </div>
                          <div className="space-y-1.5 text-[11px]">
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">Type</span>
                              <span className="font-mono text-foreground">{log.type}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">Time</span>
                              <span className="font-mono text-foreground text-[10px]">{new Date(log.timestamp).toLocaleString()}</span>
                            </div>
                            <div className="pt-1 border-t border-border/50">
                              <p className="font-mono text-foreground/80 leading-relaxed break-words text-[11px]">
                                {log.message}
                              </p>
                            </div>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  )
                })}
              </div>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}

