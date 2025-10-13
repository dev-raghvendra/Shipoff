"use client"

import { useState } from "react"
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

type Member = {
  id: string
  name: string
  email: string
  role: "Owner" | "Admin" | "Member"
  avatarUrl?: string
}

export type Team = {
  id: string
  name: string
  members: Member[]
  description?: string // added team description
  projects?: { id: string; name: string }[] // include linked projects for dialog display
}

const MOCK_TEAMS: Team[] = [
  {
    id: "team_1",
    name: "Core Platform",
    description: "Owns core infra, deployments, and internal tooling.",
    members: [
      { id: "u1", name: "You", email: "you@company.com", role: "Owner" },
      { id: "u2", name: "Alice Chen", email: "alice@company.com", role: "Admin" },
      { id: "u3", name: "David Park", email: "david@company.com", role: "Member" },
    ],
    projects: [
      { id: "p1", name: "api-gateway" },
      { id: "p2", name: "realtime-service" },
      { id: "p3", name: "dashboard-web" },
    ],
  },
  {
    id: "team_2",
    name: "Growth",
    description: "Responsible for experiments, marketing site, and analytics.",
    members: [
      { id: "u1", name: "You", email: "you@company.com", role: "Owner" },
      { id: "u4", name: "Maria Lopez", email: "maria@company.com", role: "Member" },
    ],
    projects: [
      { id: "p4", name: "marketing-site" },
      { id: "p5", name: "experiments" },
    ],
  },
]

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>(MOCK_TEAMS)
  const [selected, setSelected] = useState<Team | null>(null)
  const [membersOpen, setMembersOpen] = useState(false)

  const [createOpen, setCreateOpen] = useState(false)
  const [newTeamName, setNewTeamName] = useState("")
  const [newTeamDescription, setNewTeamDescription] = useState("") // state for description

  const handleOpenTeam = (team: Team) => {
    setSelected(team)
    setMembersOpen(true)
  }

  const handleInvite = (teamId: string, email: string) => {
    // Hook up to API later. For now, no-op to keep UI consistent with design system.
    // Optionally update local state after successful invite.
  }

  const handleCreateTeam = () => {
    if (!newTeamName.trim()) return
    const newTeam: Team = {
      id: `team_${Date.now()}`,
      name: newTeamName.trim(),
      description: newTeamDescription.trim() || undefined, // include description
      members: [{ id: "u1", name: "You", email: "you@company.com", role: "Owner" }],
    }
    setTeams((prev) => [newTeam, ...prev])
    setNewTeamName("")
    setNewTeamDescription("") // reset description
    setCreateOpen(false)
  }

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
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {teams.map((team) => (
          <TeamCard key={team.id} team={team} onClick={() => handleOpenTeam(team)} />
        ))}
      </div>

      {/* Members dialog */}
      <TeamMembersDialog open={membersOpen} onOpenChange={setMembersOpen} team={selected} onInvite={handleInvite} />

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
