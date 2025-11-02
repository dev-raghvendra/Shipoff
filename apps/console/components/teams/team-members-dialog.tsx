"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { UserPlus, Folder, Crown, MoreVertical, Trash2, LogOutIcon, Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge" // role badge styling
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Team } from "@/app/dashboard/teams/page"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { AvatarImage } from "@radix-ui/react-avatar"
import { InferResponse } from "@shipoff/types"
import { ProjectsLinkedToTeamResponse } from "@shipoff/proto"
import React, { useEffect } from "react"
import { useSession } from "@/context/session.context"
import { useInfiniteTeamMembers } from "@/hooks/use-team"
import projectService from "@/services/projects.service"
import { toast } from "sonner"
import { teamsService } from "@/services/teams.service"
import { useLoadMore } from "@/hooks/use-load-more"
import { Skeleton } from "@/components/ui/skeleton"
import { useQueryClient } from "@tanstack/react-query"

type LinkedProject = InferResponse<ProjectsLinkedToTeamResponse>["res"][0]

export function TeamMembersDialog({
  open,
  onOpenChange,
  team,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  team: Team
}) {
  const [role, setRole] = React.useState<"TEAM_ADMIN" | "TEAM_DEVELOPER" | "TEAM_VIEWER">("TEAM_DEVELOPER")
  const [copied, setCopied] = React.useState(false)
  const [transferOpen, setTransferOpen] = React.useState(false)
  const [transferMemberId, setTransferMemberId] = React.useState<string | null>(null)
  const [generatingInvite, setGeneratingInvite] = React.useState(false)
  const [inviteLink, setInviteLink] = React.useState("")
  const [deletingTeam, setDeletingTeam] = React.useState(false)
  const queryClient = useQueryClient()
  const {data:session,status} = useSession()
  const {data:teamMembers, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage, error} = useInfiniteTeamMembers({teamId:team.teamId, limit:10,fetchNow:Boolean(open) && Boolean(team) && Boolean(session)})
  const { handleLoadMore, canLoadMore, isLoadingMore } = useLoadMore(hasNextPage, isFetchingNextPage, fetchNextPage)
  const [linkedProjects, setLinkedProjects] = React.useState<LinkedProject[]>([])

  // Error handling for team members
  useEffect(() => {
    if (error) {
      toast.error((error as any)?.message || "Failed to load team members")
    }
  }, [error])

  async function fetchLinkedProjects(){
    try {
      const res = await projectService.getProjectsLinkedToTeam({teamId:team.teamId})
      setLinkedProjects(res.res)
    } catch (error:any) {
       toast.error(error.message || "Failed to fetch linked projects")
    }
  }

  useEffect(()=>{
    if(status==="loading") return
    if(!session) window.location.href="/login"
    fetchLinkedProjects()
  },[session,status, team.teamId])

  const handleInvite = async()=>{
      setGeneratingInvite(true)
      try {
       const res =  await teamsService.inviteTeamMember({teamId:team.teamId,role})
       const base = window.location.origin
       const link = `${base}dashboard/teams/invite/${res.res.inviteId}`
       setInviteLink(link)
      } catch (error:any) {
          toast.error(error.message || "Failed to generate invite link")
      } finally{
        setGeneratingInvite(false)
      }
  }

  const handleLeaveTeam = async() => {
    const currentUserMember = teamMembers.find((m) => m.userId === session?.user.userId)
    
    // Check if current user is team owner
    if (currentUserMember?.role === "TEAM_OWNER") {
      // If owner is the only member, tell them to delete the team instead
      if (teamMembers.length === 1) {
        toast.error("You are the only member. Please delete the team instead of leaving.")
        return
      }
      // If there are other members, tell them to transfer ownership first
      toast.error("As team owner, you must transfer ownership before leaving the team.")
      return
    }

    // Non-owners can leave freely
    try {
      await teamsService.deleteTeamMember({
        teamId: team.teamId,
        targetUserId: session?.user.userId!
      })
      toast.success("You have left the team successfully")
      // Reset and refetch all teams queries to force immediate update
      await queryClient.resetQueries({ 
        queryKey: ['teams', 'infinite'],
        exact: false
      })
      onOpenChange(false)
    } catch (error: any) {
      toast.error(error.message || "Failed to leave team")
    }
  }

  const handleDeleteTeam = async() => {
    if (deletingTeam) return // Prevent duplicate requests
    
    setDeletingTeam(true)
    try {
      await teamsService.deleteTeam({teamId: team.teamId})
      toast.success(`Team "${team.teamName}" has been deleted successfully`)
      // Reset and refetch all teams queries to force immediate update
      await queryClient.resetQueries({ 
        queryKey: ['teams', 'infinite'],
        exact: false
      })
      onOpenChange(false)
    } catch (error: any) {
      toast.error(error.message || "Failed to delete team")
    } finally {
      setDeletingTeam(false)
    }
  }

  // Clear invite link when dialog closes
  useEffect(() => {
    if (!open) {
      setInviteLink("")
      setCopied(false)
    }
  }, [open])

  // Clear invite link when role changes
  useEffect(() => {
    setInviteLink("")
    setCopied(false)
  }, [role])





  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Members — {team.teamName}</DialogTitle>
          {team.description ? <DialogDescription>{team.description}</DialogDescription> : null}
        </DialogHeader>

        <div className="space-y-4">
          {linkedProjects && linkedProjects.length > 0 ? (
            <div className="rounded-md border p-3">
              <div className="mb-2 flex items-center gap-2">
                <Folder className="size-4" aria-hidden />
                <span className="text-sm font-medium">Projects</span>
              </div>
              <ul className="grid gap-2">
                {linkedProjects.map((p) => (
                  <li key={p.projectId} className="flex items-center justify-between text-sm">
                    <span className="truncate">{p.name}</span>
                    {/* optional subtle badge placeholder */}
                    <span className="text-xs text-muted-foreground">linked</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {/* Members list */}
          <div className="space-y-2">
            {isLoading && (
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, idx) => (
                  <Skeleton key={idx} className="h-16 w-full rounded-md" />
                ))}
              </div>
            )}
            {teamMembers.map((m) => (
              <div key={m.userId} className="flex items-center justify-between rounded-md border p-3">
                <div className="flex items-center gap-3">
                  <Avatar className="size-8">
                    <AvatarImage alt={m.member.fullName || "User avatar"} src={m.member.avatarUri} />
                    <AvatarFallback className="text-xs">
                      {m.member.fullName
                        ?.split(" ")
                        .map((s) => s[0])
                        .slice(0, 2)
                        .join("")
                        .toUpperCase() || "??"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-0.5">
                    <div className="text-sm font-medium leading-none">{m.member.fullName || "Unknown User"}</div>
                    <div className="text-xs text-muted-foreground">{m.member.email}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-[10px]">
                    {m.role}
                  </Badge>
                  {m.userId === session?.user.userId ? 
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={handleLeaveTeam}
                    aria-label="Leave team"
                  >
                    <LogOutIcon className="size-4" />
                  </Button>
                  : m.role !== "TEAM_OWNER" && 
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" aria-label="Member actions">
                        <MoreVertical className="size-4" aria-hidden />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => {
                          setTransferMemberId(m.userId)
                          setTransferOpen(true)
                        }}
                        disabled={m.role === "TEAM_OWNER"}
                      >
                        <Crown className="mr-2 size-4" aria-hidden />
                        Transfer ownership
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu> 
                  }
                  
                </div>
              </div>
            ))}
            
            {isLoadingMore && (
              <div className="space-y-2">
                {Array.from({ length: 2 }).map((_, idx) => (
                  <Skeleton key={idx} className="h-16 w-full rounded-md" />
                ))}
              </div>
            )}

            {canLoadMore && (
              <div className="flex justify-center pt-2">
                <Button 
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  {isLoadingMore ? "Loading..." : "Load More Members"}
                </Button>
              </div>
            )}
          </div>

          {/* Invite section */}
          {["TEAM_OWNER", "TEAM_ADMIN"].includes(teamMembers.find((m) => m.userId === session?.user.userId)?.role || "") && (
            <>
            <div className="rounded-md border p-3">
             <div className="mb-4 space-y-2">
            <div className="flex items-center gap-2">
              <UserPlus className="size-4" aria-hidden />
              <span className="text-sm font-medium">Invite member</span>
            </div>
          </div>

            <div className="grid gap-2">
              <div className="grid gap-1.5">
                <label className="text-xs text-muted-foreground">Select role</label>
                <Select value={role} onValueChange={(v) => setRole(v as any)}>
                  <SelectTrigger className="h-8">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TEAM_DEVELOPER">Developer</SelectItem>
                    <SelectItem value="TEAM_ADMIN">Admin</SelectItem>
                    <SelectItem value="TEAM_VIEWER">Viewer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-1.5 sm:grid-cols-[1fr_auto]">
                <Input value={inviteLink || "Click generate to create invite link"} readOnly aria-label="Shareable invite link" />
                <Button
                  variant="outline"
                  onClick={async()=>{
                    if(!inviteLink) {
                      await handleInvite()
                      return
                    }
                    try {
                      await navigator.clipboard.writeText(inviteLink)
                      setCopied(true)
                      setTimeout(() => setCopied(false), 2000)
                    } catch (error) {
                      toast.error("Failed to copy link to clipboard")
                    }
                  }}
                  disabled={generatingInvite}
                >
                  {generatingInvite ? (
                    <>
                      Generating
                      <Loader2 className="ml-2 size-4 animate-spin" />
                    </>
                  ) : inviteLink ? (
                    copied ? "Copied!" : "Copy"
                  ) : (
                    "Generate"
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Anyone with this link can join <span className="font-medium">{team.teamName}</span> as a {role.replace('TEAM_', '').toLowerCase()}.
              </p>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
              <Button
                variant="destructive"
                className="hover:bg-red-600"
                onClick={handleDeleteTeam}
                disabled={deletingTeam}
              >
                {deletingTeam ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" aria-hidden />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="mr-2 size-4" aria-hidden />
                    Delete team
                  </>
                )}
              </Button>
          </div>
            </>
          )}
        </div>

        {/* Transfer Ownership dialog */}
        {teamMembers.find((m) => m.userId === session?.user.userId)?.role === "TEAM_OWNER" && (
          <Dialog open={transferOpen} onOpenChange={setTransferOpen}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>Transfer ownership</DialogTitle>
              <DialogDescription>
                Select a member to become the new owner of <span className="font-medium">{team.teamName}</span>.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-2">
              <label className="text-xs text-muted-foreground">Member</label>
              <Select value={transferMemberId ?? undefined} onValueChange={(v) => setTransferMemberId(v)}>
                <SelectTrigger className="h-8">
                  <SelectValue placeholder="Select a member" />
                </SelectTrigger>
                <SelectContent>
                  {teamMembers
                    .filter((m) => m.role !== "TEAM_OWNER")
                    .map((m) => (
                      <SelectItem key={m.userId} value={m.userId}>
                        {m.member.fullName} ({m.member.email})
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <DialogFooter>
              <Button variant="secondary" onClick={() => setTransferOpen(false)}>
                Cancel
              </Button>
              <Button
                disabled={!transferMemberId}
                onClick={() => {
                  setTransferOpen(false)
                  onOpenChange(false)
                }}
              >
                <Crown className="mr-2 size-4" aria-hidden />
                Confirm transfer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        )}
      </DialogContent>
    </Dialog>
  )
}

