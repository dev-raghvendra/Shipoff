"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea" // allow entering team description
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { TeamCard } from "@/components/teams/team-card"
import { TeamMembersDialog } from "@/components/teams/team-members-dialog"
import { useInfiniteTeams } from "@/hooks/use-team"
import { InferResponse } from "@shipoff/types"
import { GetTeamResponse } from "@shipoff/proto"
import { Skeleton } from "@/components/ui/skeleton"
import { teamsService } from "@/services/teams.service"
import { toast } from "sonner"
import { useLoadMore } from "@/hooks/use-load-more"
import { useQueryClient } from "@tanstack/react-query"
import { QUERY_KEYS } from "@/lib/tanstack"

export type Team = InferResponse<GetTeamResponse>["res"]

export default function TeamsPage() {
  const [selected, setSelected] = useState<Team | null>(null)
  const [membersOpen, setMembersOpen] = useState(false)
  const [createOpen, setCreateOpen] = useState(false)
  const [newTeamName, setNewTeamName] = useState("")
  const [newTeamDescription, setNewTeamDescription] = useState<string | undefined>(undefined)

  const queryClient = useQueryClient()
  const {data: teams, isLoading, isFetchingNextPage, error, hasNextPage, fetchNextPage} = useInfiniteTeams({limit: 10})
  const { handleLoadMore, canLoadMore, isLoadingMore } = useLoadMore(hasNextPage, isFetchingNextPage, fetchNextPage)

  const handleOpenTeam = (team: Team) => {
    setSelected(team)
    setMembersOpen(true)
  }

  const handleCreateTeam = async() => {
    if(isLoading) return
    if (!newTeamName.trim()) return
    try {
       const res = await teamsService.createTeam({
          teamName:newTeamName,
          description:newTeamDescription
       })
       toast.success(`Team "${res.res.teamName}" created successfully!`)
       // Reset and refetch all teams queries to force immediate update
       await queryClient.resetQueries({ 
         queryKey: ['teams', 'infinite'],
         exact: false
       })
    } catch (error:any) {
       toast.error(error.message || "Failed to create team. Please try again.")
    } finally{
      setNewTeamName("")
      setNewTeamDescription("")
      setCreateOpen(false)
    }
  }

  // Error handling
  useEffect(() => {
    if (error) {
      toast.error((error as any)?.message || "Failed to load teams")
    }
  }, [error])

  return (
    <div className="flex flex-col gap-6">
      {/* Header actions */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold tracking-tight">Your teams</h2>
          <p className="text-sm text-muted-foreground">Teams you&apos;re a member of.</p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>Create team</Button>
      </div>

      {/* Teams grid */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, idx) => (
              <Skeleton key={idx} className="h-24 w-full rounded-md" />
            ))}
          </div>
        ) : teams.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
            <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-10 w-10 text-muted-foreground"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
                  />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-semibold">No teams found</h3>
              <p className="mb-4 mt-2 text-sm text-muted-foreground">
                You haven&apos;t joined or created any teams yet. Create your first team to start collaborating.
              </p>
              <Button onClick={() => setCreateOpen(true)}>Create your first team</Button>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {teams.map((team) => (
                <TeamCard layout="detailed" key={team.teamId} team={team} onClick={() => handleOpenTeam(team)} />
              ))}
              {isLoadingMore && Array.from({ length: 3 }).map((_, idx) => (
                <Skeleton key={idx} className="h-24 w-full rounded-md" />
              ))}
            </div>

            {canLoadMore && (
              <div className="flex justify-center pt-4">
                <Button 
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                  variant="outline"
                  className="gap-2"
                >
                  {isLoadingMore ? "Loading..." : "Load More Teams"}
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Members dialog */}
      {selected && (
        <TeamMembersDialog
          open={membersOpen}
          onOpenChange={setMembersOpen}
          team={selected}
        />
      )}

      {/* Create team dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create a new team</DialogTitle>
            <DialogDescription>Give your team a clear, recognizable name.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 py-2">
            <div className="grid gap-1.5">
              <Label htmlFor="team-name">Team name</Label>
              <Input
                id="team-name"
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
                placeholder="e.g. Core Platform"
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="team-description">Description (optional)</Label>
              <Textarea
                id="team-description"
                value={newTeamDescription}
                onChange={(e) => setNewTeamDescription(e.target.value)}
                placeholder="Describe the team's scope or responsibilities"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateTeam}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
