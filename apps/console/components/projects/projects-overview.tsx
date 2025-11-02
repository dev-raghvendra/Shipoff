"use client"

import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  CalendarClock, GitBranch, Globe,
  LinkIcon,
  ServerCog,
  Users,
  Folder,
  Terminal,
  Users2,
  Link2,
  Github,
  Unlink,
  Loader2,
  X,
  Cpu,
  HardDrive
} from "lucide-react"
import { cn } from "@/lib/utils"
import DeploymentCard from "../deployments/deployment-card"
import { FrameworkIcon } from "@/components/ui/framework-icon"
import React from "react"
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogHeader, DialogFooter } from "@/components/ui/dialog"
import { InferResponse } from "@shipoff/types"
import { ProjectResponse } from "@shipoff/proto"
import { Skeleton } from "../ui/skeleton"
import { useLinkedTeams, useInfiniteTeams } from "@/hooks/use-team"
import { teamsService } from "@/services/teams.service"
import { toast } from "sonner"
import { useLoadMore } from "@/hooks/use-load-more"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useSession } from "@/context/session.context"

export interface ProjectOverviewProps {projectOverviewData: InferResponse<ProjectResponse>["res"],isLoading?:boolean}

function RuntimeBadge({ value, className }: { value: ProjectOverviewProps["projectOverviewData"]["framework"]["applicationType"]; className?: string }) {
  
const isStatic = value === "STATIC"

  return (
    <Badge
      variant="outline"
      className={cn(
        "border-transparent",
        isStatic
          ? "bg-emerald-100 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300"
          : "bg-blue-100 text-blue-900 dark:bg-blue-950/40 dark:text-blue-300",
        className,
      )}
    >
      {value}
    </Badge>
  )
}

export function ProjectOverview({ projectOverviewData, isLoading }: ProjectOverviewProps) {
  const { data: session } = useSession()
  // Linked teams state
    const { data: linkedTeams, isLoading: isLoadingLinkedTeams, refetch: refetchLinkedTeams } = useLinkedTeams({ projectId:projectOverviewData?.projectId ,enabled:!isLoading })
  
  const memoryLimitMB = session?.user?.subscription?.perks?.memoryLimitMB || 512
  const cpuLimitPercent = session?.user?.subscription?.perks?.cpuLimitPercent || 10
  
  // Link team dialog state
  const [isLinkTeamDialogOpen, setIsLinkTeamDialogOpen] = React.useState(false)
  const { data: allTeams, isLoading: isLoadingAllTeams, isFetchingNextPage, hasNextPage, fetchNextPage } = useInfiniteTeams({ limit: 10 })
  const { handleLoadMore, canLoadMore, isLoadingMore } = useLoadMore(hasNextPage, isFetchingNextPage, fetchNextPage)
  
  // Unlink team state
  const [isUnlinkDialogOpen, setIsUnlinkDialogOpen] = React.useState(false)
  const [teamToUnlink, setTeamToUnlink] = React.useState<typeof linkedTeams[0] | null>(null)
  const [isUnlinking, setIsUnlinking] = React.useState(false)
  const [isLinking, setIsLinking] = React.useState(false)
  
  const handleUnlinkTeam = async()=>{
     if(!teamToUnlink) return
     setIsUnlinking(true)
     try {
       const res = await teamsService.unlinkTeamFromProject({ projectId:projectOverviewData.projectId, teamId: teamToUnlink.teamId })
       await refetchLinkedTeams()
       toast.success(res.message || "Team unlinked successfully")
       setIsUnlinkDialogOpen(false)
       setTeamToUnlink(null)
     } catch (error: any) {
       toast.error(error.message || "Failed to unlink team, please try again later.")
     } finally {
       setIsUnlinking(false)
     }
  }
  
  const handleLinkTeam = async(teamId: string) => {
    setIsLinking(true)
    try {
      const res = await teamsService.linkTeamToProject({ projectId:projectOverviewData.projectId, teamId })
      await refetchLinkedTeams()
      toast.success(res.message || "Team linked successfully")
      setIsLinkTeamDialogOpen(false)
    } catch (error: any) {
      toast.error(error.message || "Failed to link team, please try again later.")
    } finally {
      setIsLinking(false)
    }
  }

  // Show loading state if data is still loading
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3 flex-1">
            <div className="flex-1 space-y-2">
              <Skeleton className="h-8 w-64" />
              <div className="flex gap-2">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-5 w-16" />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-32" />
            <Skeleton className="h-9 w-32" />
            <Skeleton className="h-9 w-36" />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader className="pb-3">
              <Skeleton className="h-5 w-24" />
            </CardHeader>
            <CardContent className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-32" />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <Skeleton className="h-5 w-40" />
            </CardHeader>
            <CardContent className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-40" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader className="pb-3">
              <Skeleton className="h-5 w-32" />
            </CardHeader>
            <CardContent className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <Skeleton className="h-5 w-32" />
            </CardHeader>
            <CardContent className="space-y-3">
              {Array.from({ length: 2 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Unlink Team Dialog */}
      <Dialog open={isUnlinkDialogOpen} onOpenChange={setIsUnlinkDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Unlink team</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Are you sure you want to unlink "{teamToUnlink?.teamName}" from the project? Team members will no longer have access to this project unless re-linked.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-4">
            <Button variant="secondary" onClick={() => setIsUnlinkDialogOpen(false)} disabled={isUnlinking}>
              Cancel
            </Button>
            <Button onClick={handleUnlinkTeam} disabled={isUnlinking} variant="destructive">
              {isUnlinking ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Unlinking...
                </>
              ) : (
                <>
                  <Unlink className="mr-2 h-4 w-4" />
                  Confirm unlink
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Link Team Dialog */}
      <Dialog open={isLinkTeamDialogOpen} onOpenChange={setIsLinkTeamDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Link Team to Project</DialogTitle>
            <DialogDescription>
              Select a team to link to this project. Team members will gain access based on their role.
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="max-h-[400px] pr-4">
            <div className="space-y-2">
              {isLoadingAllTeams ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))
              ) : allTeams.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No teams available. Create a team first.
                </p>
              ) : (
                allTeams.map((team) => {
                  const isLinked = linkedTeams.some(lt => lt.teamId === team.teamId)
                  return (
                    <div
                      key={team.teamId}
                      className={cn(
                        "flex items-center justify-between p-3 rounded-lg border",
                        isLinked && "bg-muted/50"
                      )}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{team.teamName}</p>
                        <p className="text-xs text-muted-foreground">
                          {team._count?.teamMembers || 0} member{team._count?.teamMembers !== 1 ? 's' : ''}
                        </p>
                      </div>
                      {isLinked ? (
                        <Badge variant="secondary" className="ml-2">Linked</Badge>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => handleLinkTeam(team.teamId)}
                          disabled={isLinking}
                        >
                          {isLinking ? (
                            <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Linking...
                            </>
                          ) : (
                            "Link"
                          )}
                        </Button>
                      )}
                    </div>
                  )
                })
              )}

              {canLoadMore && (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                >
                  {isLoadingMore ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    "Load More"
                  )}
                </Button>
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    <div className="space-y-6">
      {/* Top summary header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div>
            <h1 className="text-xl font-semibold text-balance">{projectOverviewData?.name}</h1>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="flex items-center gap-1">
                <span className="sr-only">Framework:</span>
                <FrameworkIcon src={projectOverviewData?.framework.keywordName} alt="" className="h-4 w-4" />
                {projectOverviewData?.framework.displayName}
              </Badge>
              <RuntimeBadge value={projectOverviewData?.framework.applicationType} />
              {projectOverviewData?.repository?.branch ? (
                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <GitBranch className="h-3 w-3" aria-hidden="true" />
                  {projectOverviewData.repository?.branch}
                </span>
              ) : null}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {projectOverviewData?.repository?.githubRepoURI ? (
            <Button asChild size="sm" variant="outline">
              <Link href={projectOverviewData?.repository?.githubRepoURI} target="_blank" rel="noopener noreferrer">
                <Github className="mr-2 h-4 w-4" aria-hidden="true" />
                Open repo
              </Link>
            </Button>
          ) : null}
          <Button size="sm" variant="outline" onClick={() => setIsLinkTeamDialogOpen(true)}>
            <Link2 className="mr-2 h-4 w-4" />
            Link Team
          </Button>
          <Button size="sm" variant="outline">
            <Users2 className="mr-2 h-4 w-4" />
            Invite Member
          </Button>
        </div>
      </div>

      {/* Info grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Project info card */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Project info</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <ul className="grid gap-3">
              <li className="flex items-start justify-between">
                <span className="text-muted-foreground inline-flex items-center gap-2">
                  <Users className="h-4 w-4" aria-hidden="true" />
                  Name
                </span>
                <span className="max-w-[60%] text-right font-medium">{projectOverviewData?.name}</span>
              </li>
              <li className="flex items-start justify-between">
                <span className="text-muted-foreground inline-flex items-center gap-2">
                  <ServerCog className="h-4 w-4" aria-hidden="true" />
                  Description
                </span>
                <span className="max-w-[60%] text-right text-muted-foreground">{projectOverviewData?.description || "—"}</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground inline-flex items-center gap-2">
                  <CalendarClock className="h-4 w-4" aria-hidden="true" />
                  Created
                </span>
                <span>{new Date(projectOverviewData?.createdAt).toLocaleString() || "—"}</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground inline-flex items-center gap-2">
                  <CalendarClock className="h-4 w-4" aria-hidden="true" />
                  Updated
                </span>
                <span>{new Date(projectOverviewData?.updatedAt).toLocaleString() || "—"}</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Domains */}
        <Card className="">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Domains & Repository</CardTitle>
          </CardHeader>
          <CardContent className="text-sm relative">
            {isLoading && <Skeleton className="absolute inset-0 h-4" />}
            <div className="space-y-3">
              {projectOverviewData?.domain ? (
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-2">
                    <Globe className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                    <span>{projectOverviewData?.domain}</span>
                  </span>
                  <Badge variant="outline">Primary</Badge>
                </div>
              ) : null}

              {(Array.isArray(projectOverviewData.domain) ? projectOverviewData.domain : []).map((d) => (
                <div key={d} className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-2">
                    <LinkIcon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                    <span>{d}</span>
                  </span>
                </div>
              ))}

               
            </div>
            <div className="mt-6">
              <li className="flex items-center  justify-between relative">
                <span className="text-muted-foreground inline-flex items-center gap-2">
                  <GitBranch className="h-4 w-4" aria-hidden="true" />
                  Branch
                </span>
                {isLoading && <Skeleton className="absolute inset-0 h-4" />}
                <span>{projectOverviewData?.repository?.branch || "—"}</span>
              </li>
              <li className="flex items-center mt-2 justify-between sm:col-span-2 relative">
                <span className="text-muted-foreground inline-flex items-center gap-2">
                  <Github className="h-4 w-4" aria-hidden="true" />
                  Repo
                </span>
                {isLoading && <Skeleton className="absolute inset-0 h-4" />}
                {projectOverviewData?.repository?.githubRepoFullName ? (
                  <Link
                    href={projectOverviewData?.repository?.githubRepoURI}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="truncate text-right underline underline-offset-4"
                  >
                    {projectOverviewData?.repository?.githubRepoFullName}
                  </Link>
                ) : (
                  <span>—</span>
                )}
              </li>
            </div>
          </CardContent>
        </Card>


        {/* Framework / Build settings */}
        <Card className="md:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Framework & Build</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <ul className="grid gap-3 sm:grid-cols-2">
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground inline-flex items-center gap-2">
                  <ServerCog className="h-4 w-4" aria-hidden="true" />
                  Framework
                </span>
                <span className="inline-flex items-center gap-2 relative">
                  {isLoading && <Skeleton className="absolute inset-0 h-4" />}
                  <Badge variant="secondary">
                  <FrameworkIcon src={projectOverviewData?.framework?.keywordName} alt={projectOverviewData?.framework?.displayName} className="h-4 w-4" />{projectOverviewData?.framework?.displayName}</Badge>
                  <RuntimeBadge value={projectOverviewData?.framework?.applicationType} />
                </span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground inline-flex items-center gap-2">
                  <Folder className="h-4 w-4" aria-hidden="true" />
                  Output directory
                </span>
                <span className="font-mono relative block">
                  {isLoading && <Skeleton className="absolute inset-0 h-4" />}
                  {projectOverviewData?.outDir || "—"}</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground inline-flex items-center gap-2">
                  <Terminal className="h-4 w-4" aria-hidden="true" />
                  Build command
                </span>
                <span className="font-mono block relative">{isLoading && <Skeleton className="absolute inset-0 h-4" />}
                  {projectOverviewData?.buildCommand || "—"}</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground inline-flex items-center gap-2">
                  <Terminal className="h-4 w-4" aria-hidden="true" />
                  Production command
                </span>
                <span className="font-mono relative block">
                  {isLoading && <Skeleton className="absolute inset-0 h-4" />}
                  {projectOverviewData?.prodCommand || "—"}</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground inline-flex items-center gap-2">
                  <HardDrive className="h-4 w-4" aria-hidden="true" />
                  Memory Limit
                </span>
                <span className="font-mono relative block">
                  {isLoading && <Skeleton className="absolute inset-0 h-4" />}
                  {memoryLimitMB}MB</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground inline-flex items-center gap-2">
                  <Cpu className="h-4 w-4" aria-hidden="true" />
                  CPU Limit
                </span>
                <span className="font-mono relative block">
                  {isLoading && <Skeleton className="absolute inset-0 h-4" />}
                  0.{cpuLimitPercent}</span>
              </li>
            </ul>
          </CardContent>
        </Card>
        
        {/* Linked Teams Section */}
        <Card className="md:col-span-2">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-base">Linked Teams</CardTitle>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsLinkTeamDialogOpen(true)}
            >
              <Link2 className="mr-2 h-4 w-4" />
              Link Team
            </Button>
          </CardHeader>
          <CardContent className="text-sm">
            {isLoadingLinkedTeams ? (
              <div className="space-y-3">
                {Array.from({ length: 2 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : linkedTeams.length === 0 ? (
              <div className="text-center py-8">
                <Users2 className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <p className="mt-2 text-sm text-muted-foreground">
                  No teams linked to this project
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-3"
                  onClick={() => setIsLinkTeamDialogOpen(true)}
                >
                  Link your first team
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {linkedTeams.map((team) => (
                  <div
                    key={team.teamId}
                    className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <Users2 className="h-4 w-4 text-muted-foreground" />
                        <p className="text-sm font-medium truncate">{team.teamName}</p>
                      </div>
                      {team.description && (
                        <p className="text-xs text-muted-foreground mt-1 truncate">
                          {team.description}
                        </p>
                      )}
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setTeamToUnlink(team)
                        setIsUnlinkDialogOpen(true)
                      }}
                      className="ml-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Unlink team</span>
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Latest deployment (single most recent) */}
        <Card className="md:col-span-2 gap-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Latest deployment</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-3 relative">
            {isLoading && <Skeleton className="absolute inset-0 h-4" />}
            {(() => {
              const latest = (projectOverviewData?.deployments || [])[0]
              if (!latest) {
                return <p className="text-muted-foreground">No deployments yet.</p>
              }
              return <DeploymentCard d={{...latest,project:projectOverviewData}} />
            })()}
            <div>
              <Button asChild size="sm" variant="ghost" className="px-0">
                <Link href={`./deployments`}>View all deployments</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

      </div>     
    </div>

    </div>
  )
}
