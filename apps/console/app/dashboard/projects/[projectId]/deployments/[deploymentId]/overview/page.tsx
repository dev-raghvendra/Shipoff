"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { statusBadge } from "@/components/deployments/deployment-card"
import { BuildEnvironment } from "@/components/deployments/build-environment"
import { RuntimeEnvironment } from "@/components/deployments/runtime-environment"
import { Button } from "@/components/ui/button"
import {
  Loader2, GitBranch,
  User,
  Calendar,
  Globe,
  Code,
  Terminal,
  AlertTriangle,
  Cpu,
  HardDrive
} from "lucide-react"
import { useDeployment } from "@/hooks/use-deployment"
import { Skeleton } from "@/components/ui/skeleton"
import projectService from "@/services/projects.service"
import { RotateCw, Trash2 } from "lucide-react"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { redirect } from "next/navigation"
import { toast } from "sonner"
import { FrameworkIcon } from "@/components/ui/framework-icon"
import { useParams } from "next/navigation"
import { logsService } from "@/services/logs.service"
import { downloadFiles } from "@/utils/misc.client.utils"
import { useRouter } from "next/navigation"
import { useSession } from "@/context/session.context"
import Link from "next/link"

export default function DeploymentDetailPage() {
  const {projectId,deploymentId} = useParams()
  const [isExporting, setIsExporting] = useState(false)
  const [isRedeploying, setIsRedeploying] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const {data:deployment,isLoading,error,isError} = useDeployment({projectId:projectId as string,deploymentId:deploymentId as string})
  const statusesToMountRuntimeEnvironment = ["PRODUCTION","FAILED","INACTIVE"]
  const router = useRouter()
  const { data: session } = useSession()
  
  const memoryLimitMB = session?.user?.subscription?.perks?.memoryLimitMB || 512
  const cpuLimitPercent = session?.user?.subscription?.perks?.cpuLimitPercent || 10

  const handleExportLogs = async () => {
    if(isLoading) return
    setIsExporting(true)
    try {
       const res = await logsService.exportLogs({
         projectId: projectId as string,
         deploymentId: deploymentId as string
       })
       if(!res.res.downloadURLs.length) throw {message:"No logs available to export"}
       downloadFiles(res.res.downloadURLs)
       toast.success("Log export initiated. Downloads should begin shortly.")
    } catch (error) {
       toast.error((error as any).message || "Failed to export logs")
    } finally {
      setIsExporting(false)
    }
  }


  useEffect(()=>{
    if(isLoading) return
    if(error){
      if((error as any).code==404){
        redirect(`/not-found?code=404&message=Deployment not found`)
      } else toast.error((error as any).message || "Failed to load deployment details")
    }
  },[isLoading])

  if(isError){
    return null
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Deployment Details</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {isLoading ? (
              <Skeleton className="h-5 w-64" />
            ) : (
              `Deployment ID: ${deploymentId as string}`
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isLoading ? (
            <Skeleton className="h-6 w-24" />
          ) : (
            statusBadge(deployment?.status)
          )}
          {!isLoading && ["PRODUCTION","FAILED","INACTIVE"].includes(deployment?.status) && (
            <Button
              size="sm"
              variant="outline"
              disabled={isRedeploying}
              onClick={async()=>{
                try{
                  window.dispatchEvent(new CustomEvent('reset-deploy-backoff', { detail: { projectId: projectId as string, deploymentId: deploymentId as string } }))
                  setIsRedeploying(true)
                  await projectService.redeployDeployment({projectId: projectId as string, deploymentId: deploymentId as string})
                  toast.success("Redeployment started")
                }catch(e:any){
                  toast.error(e.message||"Failed to redeploy")
                }finally{setIsRedeploying(false)}
              }}
              className="gap-1.5"
            >
              {isRedeploying ? <Loader2 className="h-4 w-4 animate-spin"/> : <RotateCw className="h-4 w-4"/>}
              <span className="hidden sm:inline">Redeploy</span>
            </Button>
          )}
          {!isLoading && ["FAILED","INACTIVE"].includes(deployment?.status) && (
            <Button
              size="sm"
              variant="ghost"
              disabled={isDeleting}
              onClick={()=> setConfirmOpen(true)}
              className="gap-1.5 text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4"/>
              <span className="hidden sm:inline">Delete</span>
            </Button>
          )}
        </div>
      </div>

      {/* Deployment Information Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Deployment Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left Column */}
            <div className="space-y-3">
              {/* Domain */}
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">Domain</p>
                  {isLoading ? (
                    <Skeleton className="h-4 w-48 mt-1" />
                  ) : (
                    <Link href={`https://${deployment?.project.domain}`} className="text-sm text-muted-foreground truncate">
                      {deployment?.project.domain}
                    </Link>
                  )}
                </div>
              </div>
              
              {/* Repository */}
              <div className="flex items-center gap-2">
                <Code className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">Repository</p>
                  {isLoading ? (
                    <Skeleton className="h-4 w-64 mt-1" />
                  ) : (
                    <Link href={`https://github.com/${deployment?.repository?.githubRepoFullName}`} className="text-sm text-muted-foreground truncate">
                      {deployment?.repository?.githubRepoFullName || "Not linked"}
                    </Link>
                  )}
                </div>
              </div>

              {/* Branch */}
              <div className="flex items-center gap-2">
                <GitBranch className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">Branch</p>
                  {isLoading ? (
                    <Skeleton className="h-4 w-32 mt-1" />
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      {deployment?.repository?.branch || "-"}
                    </p>
                  )}
                </div>
              </div>

              {/* CPU Limit */}
              <div className="flex items-center gap-2">
                <Cpu className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">CPU Limit</p>
                  {isLoading ? (
                    <Skeleton className="h-4 w-24 mt-1" />
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      0.{cpuLimitPercent}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-3">
              {/* Framework */}
              <div className="flex items-center gap-2">
                <Terminal className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">Framework</p>
                  {isLoading ? (
                    <Skeleton className="h-4 w-40 mt-1" />
                  ) : (
                    <div className="flex items-center gap-2 mt-1">
                      <FrameworkIcon 
                        src={deployment?.project.framework.keywordName} 
                        alt={deployment?.project.framework.displayName}
                        className="h-4 w-4" 
                      />
                      <p className="text-sm text-muted-foreground">
                        {deployment?.project.framework.displayName}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Commit Hash */}
              <div className="flex items-center gap-2">
                <Code className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">Commit Hash</p>
                  {isLoading ? (
                    <Skeleton className="h-4 w-32 mt-1" />
                  ) : (
                    <p className="text-sm text-muted-foreground font-mono truncate">
                      {deployment?.commitHash}
                    </p>
                  )}
                </div>
              </div>

              {/* Commit Author */}
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">Commit Author</p>
                  {isLoading ? (
                    <Skeleton className="h-4 w-48 mt-1" />
                  ) : (
                    <p className="text-sm text-muted-foreground truncate">
                      {deployment?.author}
                    </p>
                  )}
                </div>
              </div>

              {/* Memory Limit */}
              <div className="flex items-center gap-2">
                <HardDrive className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">Memory Limit</p>
                  {isLoading ? (
                    <Skeleton className="h-4 w-32 mt-1" />
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      {memoryLimitMB}MB
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Deployed At */}
          <div className="pt-4 border-t">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm font-medium">Deployed At</p>
                {isLoading ? (
                  <Skeleton className="h-4 w-48 mt-1" />
                ) : (
                  <p className="text-sm text-muted-foreground">
                    {new Date(deployment?.lastDeployedAt).toLocaleString()}
                  </p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Environment Sections */}
      <div className="space-y-4">
        {/* Build Environment */}
        <BuildEnvironment 
          isLoading={isLoading}
          data={!isLoading && deployment?.buildEnvironment?.[0] ? {
            buildId: deployment.buildEnvironment[0].buildId,
            environmentId: deployment.buildEnvironment[0].buildId,
            projectId: deployment.projectId,
            status: deployment.status
          } : undefined}
        />

        {/* Runtime Environment */}
        <RuntimeEnvironment 
          isLoading={isLoading}
          data={!isLoading && deployment?.runtimeEnvironment?.[0] && statusesToMountRuntimeEnvironment.includes(deployment.status) ? {
            runtimeId: deployment.runtimeEnvironment[0].runtimeId,
            environmentId: deployment.runtimeEnvironment[0].runtimeId,
            projectId: deployment.projectId,
            status: deployment.status
          } : undefined}
        />
      </div>

      {/* Log Persistence Warning */}
      {
        !isLoading && deployment?.buildEnvironment[0] || deployment?.runtimeEnvironment[0] ? (
          <Card className="border-orange-200 dark:border-orange-900 bg-orange-50 dark:bg-orange-950/30">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 mt-0.5 flex-shrink-0 text-orange-600 dark:text-orange-400" />
            <div className="flex-1">
              <h4 className="text-sm font-medium text-orange-900 dark:text-orange-100">
                Log Persistence Notice
              </h4>
              <p className="text-sm mt-1 text-orange-800 dark:text-orange-200">
                Logs are automatically deleted after 24 hours. To preserve them permanently, export the logs using the button below.
              </p>
              <div className="mt-3">
                {isLoading ? (
                  <Skeleton className="h-9 w-40" />
                ) : (
                  <Button 
                    onClick={handleExportLogs}
                    disabled={isExporting}
                    size="sm"
                    variant="outline"
                    className="border-orange-300 dark:border-orange-700 hover:bg-orange-100 dark:hover:bg-orange-900"
                  >
                    {isExporting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Exporting...
                      </>
                    ) : (
                      "Export Logs as JSON"
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
        ) : null
      }

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Deployment?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete deployment <code className="font-mono text-xs bg-muted px-1 py-0.5 rounded">{(deploymentId as string)?.slice(0,9)}</code>. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90"
              disabled={isDeleting}
              onClick={async()=>{
                try{
                  window.dispatchEvent(new CustomEvent('reset-deploy-backoff', { detail: { projectId: projectId as string, deploymentId: deploymentId as string } }))
                  setIsDeleting(true)
                  await projectService.deleteDeployment({projectId: projectId as string, deploymentId: deploymentId as string})
                  toast.success("Deployment deleted")
                  router.push(`/dashboard/projects/${projectId}/deployments`)
                }catch(e:any){
                  toast.error(e.message||"Failed to delete deployment")
                }finally{
                  setIsDeleting(false)
                  setConfirmOpen(false)
                }
              }}
            >
              {isDeleting? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
