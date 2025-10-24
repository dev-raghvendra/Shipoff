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
  Unlink
} from "lucide-react"
import { cn } from "@/lib/utils"
import DeploymentCard from "../deployments/deployment-card"
import { TeamCard } from "../teams/team-card"
import { Team } from "@/app/dashboard/teams/page"
import React from "react"
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogHeader, DialogFooter } from "@/components/ui/dialog"
import { InferResponse } from "@/types/response"
import { ProjectResponse } from "@shipoff/proto"

export type ProjectOverviewData = InferResponse<ProjectResponse>["res"]

function RuntimeBadge({ value, className }: { value: ProjectOverviewData["framework"]["applicationType"]; className?: string }) {
  
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

export function ProjectOverview({ data }: { data: ProjectOverviewData }) {
  const repoName =
    data.repository.githubRepoURI && data.repository.githubRepoURI.includes("://")
      ? data.repository.githubRepoURI.split("://")[1]?.split("/").slice(1).join("/")
      : data.repository.githubRepoURI

  const [isUnlinkDialogOpen, setIsUnlinkDialogOpen] = React.useState(false)
  const handleUnlinkTeam = async()=>{
     if(!isUnlinkDialogOpen) return
  }

  return (
    <div>
      <Dialog open={isUnlinkDialogOpen} onOpenChange={setIsUnlinkDialogOpen}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>Unlink team</DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                Are you sure you want to unlink this team from the project? Team members will no longer have access to this project unless re-linked.
              </DialogDescription>
            </DialogHeader>

          
            <DialogFooter className="mt-4">
              <Button variant="secondary" onClick={() => setIsUnlinkDialogOpen(false)}>
                Cancel
              </Button>
              <Button
              
              >
                <Unlink className="mr-2 size-4" aria-hidden />
                Confirm unlink
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
    <div className="space-y-6">
      {/* Top summary header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div>
            <h1 className="text-xl font-semibold text-balance">{data.name}</h1>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="flex items-center gap-1">
                <span className="sr-only">Framework:</span>
                <img src={data.framework.icon} alt="" className="h-4 w-4" />
                {data.framework.displayName}
              </Badge>
              <RuntimeBadge value={data.framework.applicationType} />
              {data.repository.branch ? (
                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <GitBranch className="h-3 w-3" aria-hidden="true" />
                  {data.repository.branch}
                </span>
              ) : null}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {data.repository.githubRepoURI ? (
            <Button asChild size="sm" variant="outline">
              <Link href={data.repository.githubRepoURI} target="_blank" rel="noopener noreferrer">
                <Github className="mr-2 h-4 w-4" aria-hidden="true" />
                Open repo
              </Link>
            </Button>
          ) : null}
          <Button size="sm" variant="outline"><Link2 />Link Team</Button>
          <Button size="sm" variant="outline"><Users2 />Invite Member</Button>
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
                <span className="max-w-[60%] text-right font-medium">{data.name}</span>
              </li>
              <li className="flex items-start justify-between">
                <span className="text-muted-foreground inline-flex items-center gap-2">
                  <ServerCog className="h-4 w-4" aria-hidden="true" />
                  Description
                </span>
                <span className="max-w-[60%] text-right text-muted-foreground">{data.description || "—"}</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground inline-flex items-center gap-2">
                  <CalendarClock className="h-4 w-4" aria-hidden="true" />
                  Created
                </span>
                <span>{data.createdAt || "—"}</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground inline-flex items-center gap-2">
                  <CalendarClock className="h-4 w-4" aria-hidden="true" />
                  Updated
                </span>
                <span>{data.updatedAt || "—"}</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Domains */}
        <Card className="">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Domains & Repository</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <div className="space-y-3">
              {data.domain ? (
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-2">
                    <Globe className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                    <span>{data.domain}</span>
                  </span>
                  <Badge variant="outline">Primary</Badge>
                </div>
              ) : null}

              {(Array.isArray(data.domain) ? data.domain : []).map((d) => (
                <div key={d} className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-2">
                    <LinkIcon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                    <span>{d}</span>
                  </span>
                </div>
              ))}

               
            </div>
            <div className="mt-6">
              <li className="flex items-center  justify-between">
                <span className="text-muted-foreground inline-flex items-center gap-2">
                  <GitBranch className="h-4 w-4" aria-hidden="true" />
                  Branch
                </span>
                <span>{data.repository.branch || "—"}</span>
              </li>
              <li className="flex items-center mt-2 justify-between sm:col-span-2">
                <span className="text-muted-foreground inline-flex items-center gap-2">
                  <Github className="h-4 w-4" aria-hidden="true" />
                  Repo
                </span>
                {data.repository.githubRepoFullName ? (
                  <Link
                    href={data.repository.githubRepoURI}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="truncate text-right underline underline-offset-4"
                  >
                    {repoName}
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
                <span className="inline-flex items-center gap-2">
                  <Badge variant="secondary">
                  <img src={data.framework.icon} alt="" className="h-4 w-4" />{data.framework.displayName}</Badge>
                  <RuntimeBadge value={data.framework.applicationType} />
                </span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground inline-flex items-center gap-2">
                  <Folder className="h-4 w-4" aria-hidden="true" />
                  Output directory
                </span>
                <span className="font-mono">{data.outDir || "—"}</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground inline-flex items-center gap-2">
                  <Terminal className="h-4 w-4" aria-hidden="true" />
                  Build command
                </span>
                <span className="font-mono">{data.buildCommand || "—"}</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground inline-flex items-center gap-2">
                  <Terminal className="h-4 w-4" aria-hidden="true" />
                  Production command
                </span>
                <span className="font-mono">{data.prodCommand || "—"}</span>
              </li>
            </ul>
          </CardContent>
        </Card>
        
       
        
        
        {/* Latest deployment (single most recent) */}
        <Card className="md:col-span-2 gap-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Latest deployment</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-3">
            {(() => {
              const latest = (data.deployments || [])[0]
              if (!latest) {
                return <p className="text-muted-foreground">No deployments yet.</p>
              }
              return <DeploymentCard d={latest} />
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

function TeamLinkCard({projectId}:{projectId:string}) {
  

 return (
  <Card className="md:col-span-2 gap-0">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Teams Linked</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            {data.team.map((team) => (
              <TeamCard key={team.id} team={team} layout="minimal" className="hover:bg-card self-start">
                <Button onClick={() => setIsUnlinkDialogOpen(true)} variant="outline" size="sm" className="ml-auto my-auto text-destructive hover:bg-destructive/10 hover:text-destructive">
                  <Unlink className="h-4 w-4" />
                  Unlink
                </Button>
              </TeamCard>
            ))}
          </CardContent>
        </Card>
 )
}