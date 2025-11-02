"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Terminal, ChevronDown, ChevronRight, Copy, Download, Filter, Check } from "lucide-react"
import { ExtendLogBodyType, LOGS_WS_EVENTS } from "@shipoff/types"
import { logsService } from "@/services/logs.service"
import { toast } from "sonner"
import { authService } from "@/services/auth.service"
import { Button } from "@/components/ui/button"
import { useIsMobile } from "@/hooks/use-mobile"


interface BuildEnvironmentData {
  buildId: string
  environmentId: string
  projectId: string
  status: string
}

interface BuildEnvironmentProps {
  data?: BuildEnvironmentData
  isLoading?: boolean
}

export function BuildEnvironment({ data, isLoading = false }: BuildEnvironmentProps) {
  const [buildLogsOpen, setBuildLogsOpen] = useState(true)
  const [buildLogs, setBuildLogs] = useState<ExtendLogBodyType[]>([])
  const [selectedLogIndex, setSelectedLogIndex] = useState<number | null>(null)
  const [logsStream, setLogsStream] = useState<WebSocket | null>(null)
  const [wsLogsBuffer, setWsLogsBuffer] = useState<ExtendLogBodyType[]>([])
  const haveStaticLogsReceived = useRef(false)
  const [buildSearchQuery, setBuildSearchQuery] = useState("")
  const [logLevelFilter, setLogLevelFilter] = useState<string>("ALL")
  const [logsCopied, setLogsCopied] = useState(false)
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null)
  const statusesToKeepAlive = ["BUILDING", "PROVISIONING"]
  const isMobile = useIsMobile()
  const logsContainer = useRef<HTMLDivElement | null>(null)
  const userHasScrolledRef = useRef(false)
  const isScrollingRef = useRef(false)

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
        setBuildLogs([])
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
          : setBuildLogs((prev) => [...prev, logData])
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
      setBuildLogs((prev) => [...prev, ...finalLogs])
      setWsLogsBuffer([])
    }
  }, [wsLogsBuffer])

  function scrollLogs(){
    if (isScrollingRef.current) return
    requestAnimationFrame(() => {
     if (logsContainer.current && !userHasScrolledRef.current) {
      isScrollingRef.current = true
      logsContainer.current.scrollTo({
        top: logsContainer.current.scrollHeight,
        behavior: "smooth"
      })
      setTimeout(() => {
        isScrollingRef.current = false
      }, 300)
     }
    })
  }

  const handleLogsScroll = () => {
    if (!logsContainer.current) return
    const { scrollHeight, clientHeight, scrollTop } = logsContainer.current
    const isAtBottom = Math.abs(scrollHeight - clientHeight - scrollTop) <= 5
    userHasScrolledRef.current = !isAtBottom
  }

  useEffect(() => {
    if (!buildLogs.length) return
    scrollLogs()
    const timeout = setTimeout(() => {
      logsStream?.close()
      setLogsStream(null)
    }, 30000)
    setTimeoutId(timeout)

    return () => {
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [buildLogs])
  
  // Reset scroll tracking when new logs start
  useEffect(() => {
    userHasScrolledRef.current = false
  }, [data?.buildId])

  useEffect(() => {
    if (!data) return
    if (!haveStaticLogsReceived.current) return
    if (statusesToKeepAlive.includes(data.status)) return
    clearTimeout(timeoutId!)
    logsStream?.close()
    setLogsStream(null)
  }, [data?.status])

  const copyAllLogs = () => {
    if (buildLogs.length === 0) return
    if(logsCopied) return
    const logsText = buildLogs.map(log => `[${new Date(log.timestamp).toISOString()}] [${log.level}] ${log.message}`).join('\n')
    navigator.clipboard.writeText(logsText)
    setLogsCopied(true)
    setTimeout(() => setLogsCopied(false), 2000)
  }

  const filteredLogs = buildLogs.filter(log => {
    const matchesSearch = buildSearchQuery === "" || log.message.toLowerCase().includes(buildSearchQuery.toLowerCase())
    const matchesLevel = logLevelFilter === "ALL" || log.level === logLevelFilter
    return matchesSearch && matchesLevel
  })

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
            <Terminal className="h-4 w-4 text-muted-foreground" />
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Build Logs</h3>
              <p className="text-xs text-muted-foreground">No build data available</p>
            </div>
          </div>
        </div>
        <div className="p-8 text-center">
          <p className="text-sm text-muted-foreground">Build environment data is not available for this deployment.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-background border border-border rounded-lg overflow-hidden shadow-sm">
      <Collapsible open={buildLogsOpen} onOpenChange={setBuildLogsOpen}>
        <CollapsibleTrigger asChild>
          <div className="bg-muted/30 border-b border-border px-5 py-4 cursor-pointer hover:bg-muted/50 transition-all duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {buildLogsOpen ? (
                  <ChevronDown className="h-5 w-5 text-foreground transition-transform" />
                ) : (
                  <ChevronRight className="h-5 w-5 text-foreground transition-transform" />
                )}
                <div className="flex items-center gap-2 px-2 py-1 rounded-md bg-blue-500/10 border border-blue-500/20">
                  <Terminal className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-base font-semibold text-foreground">Build Logs</h3>
                  <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                    <span className="flex-shrink-0">Build ID:</span>
                    <code className="bg-muted/80 text-foreground px-1.5 py-0.5 rounded text-xs font-mono truncate max-w-[150px] sm:max-w-none inline-block">{data.buildId}</code>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground">
                  {filteredLogs.length} / {buildLogs.length} logs
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
                {!isMobile ? (
                  <Input
                    placeholder="Search logs..."
                    value={buildSearchQuery}
                    onChange={(e) => setBuildSearchQuery(e.target.value)}
                    className="h-9 max-w-xs text-sm"
                  />
                ) :null}
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

          <div className="h-96 overflow-y-auto bg-zinc-50 dark:bg-zinc-950" ref={logsContainer} onScroll={handleLogsScroll}>
            {buildLogs.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-8">
                <div className="p-4 rounded-md bg-muted/50 mb-4">
                  <Terminal className="h-10 w-10 text-muted-foreground/50" />
                </div>
                <p className="text-sm font-medium text-muted-foreground">No logs to show yet</p>
                <p className="text-xs text-muted-foreground/70 mt-1">Build logs will appear here once the build starts</p>
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
                      className={`flex items-start gap-4 py-2 px-5 ${!isMobile ? 'cursor-pointer' : ''} hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors border-l-2 ${
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
                      <div className="w-14">
                        <span 
                        className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded flex-shrink-0 font-medium mt-0.5"
                        style={getLevelStyles(log.level)}
                      >
                        {log.level}
                      </span>
                      </div>
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
