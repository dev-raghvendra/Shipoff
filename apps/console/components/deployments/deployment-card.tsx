import * as React from "react"
import { GitBranch, GitCommit, ArrowUpFromLine, ListEnd, CircleX, CircleStop, Trash2, RotateCw } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Spinner } from "../ui/spinner";
import { InferResponse } from "@shipoff/types";
import { DeploymentResponse } from "@shipoff/proto";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import projectService from "@/services/projects.service";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export type Deployment = InferResponse<DeploymentResponse>["res"]

export function statusBadge(status: Deployment["status"]) {
  switch (status) {
    case "PRODUCTION":
      return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-800"><ArrowUpFromLine className="h-3 w-3" />PRODUCTION</Badge>
    case "BUILDING":
      return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800" ><Spinner className="animate-spin h-3 w-3" />BUILDING</Badge>
    case "PROVISIONING":
      return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 border-blue-200 dark:border-blue-800"><Spinner className="animate-spin h-3 w-3" />PROVISIONING</Badge>
    case "FAILED":
      return <Badge className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400 border-red-200 dark:border-red-800"><CircleX className="h-3 w-3" />FAILED</Badge>
    case "QUEUED":
      return <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400 border-gray-200 dark:border-gray-800"><ListEnd className="h-3 w-3" />QUEUED</Badge>
    case "INACTIVE":
      return <Badge className="bg-muted text-muted-foreground border border-border"><CircleStop className="h-3 w-3" />INACTIVE</Badge>
  }
}

export default function DeploymentCard({ d, onUpdate }: { d: Deployment; onUpdate?: () => void }) {
  const [imageError, setImageError] = React.useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false)
  const [isDeleting, setIsDeleting] = React.useState(false)
  const [isRedeploying, setIsRedeploying] = React.useState(false)

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return formatDistanceToNow(date, { addSuffix: true })
    } catch {
      return dateString
    }
  }

  const calculateTimeTook = () => {
    if (!d.completedAt || !d.lastDeployedAt) return null
    try {
      const completed = new Date(d.completedAt)
      const started = new Date(d.lastDeployedAt)
      const diffMs = completed.getTime() - started.getTime()
      const diffMins = Math.floor(diffMs / 60000)
      const diffSecs = Math.floor((diffMs % 60000) / 1000)
      
      if (diffMins > 0) {
        return `${diffMins}m ${diffSecs}s`
      }
      return `${diffSecs}s`
    } catch {
      return null
    }
  }

  const timeTook = calculateTimeTook()

  const handleDelete = async (e: React.MouseEvent) => {
    setShowDeleteDialog(true)
  }

  const confirmDelete = async () => {
    setIsDeleting(true)
    try {
      // Reset polling backoff immediately for this deployment list/detail
      window.dispatchEvent(new CustomEvent('reset-deploy-backoff', { detail: { projectId: d.projectId, deploymentId: d.deploymentId } }))
      await projectService.deleteDeployment({
        projectId: d.projectId,
        deploymentId: d.deploymentId
      })
      toast.success("Deployment deleted successfully")
      onUpdate?.()
    } catch (error: any) {
      toast.error(error.message || "Failed to delete deployment")
    } finally {
      setIsDeleting(false)
      setShowDeleteDialog(false)
    }
  }

  const handleRedeploy = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsRedeploying(true)
    try {
      // Reset polling backoff immediately for this deployment list/detail
      window.dispatchEvent(new CustomEvent('reset-deploy-backoff', { detail: { projectId: d.projectId, deploymentId: d.deploymentId } }))
      await projectService.redeployDeployment({
        projectId: d.projectId,
        deploymentId: d.deploymentId
      })
      toast.success("Redeployment started successfully")
      onUpdate?.()
    } catch (error: any) {
      toast.error(error.message || "Failed to redeploy")
    } finally {
      setIsRedeploying(false)
    }
  }

  const canRedeploy = ["PRODUCTION", "FAILED", "INACTIVE"].includes(d.status)
  const canDelete = ["FAILED", "INACTIVE"].includes(d.status)

  const FrameworkIcon = () => (
    <div className="w-5 h-5 rounded flex items-center justify-center shrink-0">
      {imageError ? (
        <div className="w-full h-full rounded bg-primary/10 flex items-center justify-center">
          <span className="text-xs font-bold text-primary">{d.project.name.charAt(0).toUpperCase()}</span>
        </div>
      ) : (
        <Image
          src={`/framework/${d.project.framework.keywordName}-dark.svg`}
          alt={d.project.framework.displayName}
          width={20}
          height={20}
          className="object-contain"
          onError={() => setImageError(true)}
        />
      )}
    </div>
  )

  return (
    <Card onClick={(e:any)=>{
    }} className="group hover:border-primary/50 hover:shadow-sm transition-all duration-200 relative overflow-hidden animate-in fade-in-0 slide-in-from-bottom-2">
      <CardContent className="p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
          {/* Left Section - Fixed Width */}
          <div className="flex items-start gap-3 md:w-48 shrink-0">
            {/* Deployment ID & Status */}
            <div className="space-y-2 min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <code className="text-sm font-semibold truncate">{d.deploymentId.substring(0, 9)}</code>
                {statusBadge(d.status)}
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                {timeTook && (
                  <>
                    <span className="font-medium">{timeTook}</span>
                    <span className="hidden sm:inline">({formatDate(d.lastDeployedAt)})</span>
                  </>
                )}
                {!timeTook && <span>{formatDate(d.lastDeployedAt)}</span>}
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4 min-w-0 flex-1">
            {/* Project Name - Mobile */}
            <div className="flex items-center gap-2 md:hidden">
            <FrameworkIcon />
              <span className="text-sm font-medium truncate">{d.project.name}</span>
            </div>

            {/* Branch & Commit - Mobile */}
            <div className="flex items-center gap-3 text-sm min-w-0">
              <div className="flex items-center gap-1.5">
                <GitBranch className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <span className="font-medium truncate">{d.repository.branch}</span>
              </div>
              <div className="flex items-center gap-1.5 min-w-0">
                <GitCommit className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <code className="font-mono text-xs">{d.commitHash.substring(0, 7)}</code>
                <span className="truncate text-muted-foreground text-xs">{d.commitMessage}</span>
              </div>
            </div>

            {/* Desktop Only - Full Layout */}
            <div className="hidden md:flex md:items-center md:gap-4 min-w-0 flex-1">
              {/* Project Name - Fixed Width */}
              <div className="flex items-center gap-2 w-32 shrink-0">
                <FrameworkIcon />
                <span className="text-sm font-medium truncate">{d.project.name}</span>
              </div>

              {/* Branch - Fixed Width */}
              <div className="flex items-center gap-1.5 text-sm w-24 shrink-0">
                <GitBranch className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <span className="font-medium truncate">{d.repository.branch}</span>
              </div>

              {/* Commit Info - Flexible */}
              <div className="flex items-center gap-1.5 text-sm min-w-0 flex-1">
                <GitCommit className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <code className="font-mono text-xs shrink-0">{d.commitHash.substring(0, 7)}</code>
                <span className="truncate text-muted-foreground">{d.commitMessage}</span>
              </div>

              {/* Author & Date - Fixed Width */}
              <div className="flex items-center gap-2 text-xs text-muted-foreground w-44 shrink-0">
                <span className="truncate">{formatDate(d.lastDeployedAt)} by {d.author}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>

      {/* Actions Overlay for eligible deployments */}
      {(canRedeploy || canDelete) && (
        <div
          className="absolute inset-0 bg-gradient-to-l from-black/80 via-black/50 via-50% to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-end px-6 pointer-events-none group-hover:pointer-events-auto"
        >
          <div className="flex items-center  gap-2">
            {canRedeploy && (
              <Button
                size="sm"
                variant="outline"
                onClick={handleRedeploy}
                disabled={isRedeploying}
                className="gap-1.5 deployment-action-button shadow-sm"
              >
                {isRedeploying ? (
                  <Spinner className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <RotateCw className="h-3.5 w-3.5" />
                )}
                <span className="hidden sm:inline">Redeploy</span>
              </Button>
            )}
            {canDelete && (
              <Button
                size="sm"
                variant="ghost"
                onClick={handleDelete}
                disabled={isDeleting}
                className="gap-1.5 text-destructive deployment-action-button hover:text-destructive hover:bg-destructive/10 shadow-sm"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Delete</span>
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Deployment?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete deployment <code className="font-mono text-xs bg-muted px-1 py-0.5 rounded">{d.deploymentId.substring(0, 9)}</code>.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={isDeleting}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}