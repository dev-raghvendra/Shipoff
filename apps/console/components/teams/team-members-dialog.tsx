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
import { UserPlus, Folder, Crown, MoreVertical, Trash2, LogOutIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge" // role badge styling
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Team } from "@/app/dashboard/teams/page"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"

export function TeamMembersDialog({
  open,
  onOpenChange,
  team,
  onInvite,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  team: Team | null
  onInvite: (teamId: string, email: string) => void
}) {
  const [email, setEmail] = React.useState("")
  const [role, setRole] = React.useState<"Owner" | "Admin" | "Member">("Member")
  const [copied, setCopied] = React.useState(false)
  const [transferOpen, setTransferOpen] = React.useState(false)
  const [transferMemberId, setTransferMemberId] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (!open) setEmail("")
  }, [open])

  const inviteLink = React.useMemo(() => {
    if (!team) return ""
    // Stateless shareable link encoding team and role; backend can validate when redeeming
    const base = typeof window !== "undefined" ? window.location.origin : ""
    return `${base}/invite/${team.id}?role=${encodeURIComponent(role)}`
  }, [team, role])

  if (!team) return null

  const handleInvite = () => {
    if (!email.trim()) return
    onInvite(team.id, email.trim())
    setEmail("")
    onOpenChange(false)
  }

    const userId="u1"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Members — {team.name}</DialogTitle>
          {team.description ? <DialogDescription>{team.description}</DialogDescription> : null}
        </DialogHeader>

        <div className="space-y-4">
          {team.projects && team.projects.length > 0 ? (
            <div className="rounded-md border p-3">
              <div className="mb-2 flex items-center gap-2">
                <Folder className="size-4" aria-hidden />
                <span className="text-sm font-medium">Projects</span>
              </div>
              <ul className="grid gap-2">
                {team.projects.map((p) => (
                  <li key={p.id} className="flex items-center justify-between text-sm">
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
            {team.members.map((m) => (
              <div key={m.id} className="flex items-center justify-between rounded-md border p-3">
                <div className="flex items-center gap-3">
                  <Avatar className="size-8">
                    <AvatarFallback className="text-xs">
                      {m.name
                        .split(" ")
                        .map((s) => s[0])
                        .slice(0, 2)
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-0.5">
                    <div className="text-sm font-medium leading-none">{m.name}</div>
                    <div className="text-xs text-muted-foreground">{m.email}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-[10px]">
                    {m.role}
                  </Badge>
                  {m.id === userId ? 
                  <LogOutIcon className="size-4 mr-2 ml-3" />
                  :<DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" aria-label="Member actions">
                        <MoreVertical className="size-4" aria-hidden />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => {
                          setTransferMemberId(m.id)
                          setTransferOpen(true)
                        }}
                        disabled={m.role === "Owner"}
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
          </div>

          <div className="rounded-md border p-3">
            <div className="mb-2 flex items-center gap-2">
              <UserPlus className="size-4" aria-hidden />
              <span className="text-sm font-medium">Invite via link</span>
            </div>

            <div className="grid gap-2">
              <div className="grid gap-1.5">
                <label className="text-xs text-muted-foreground">Select role</label>
                <Select value={role} onValueChange={(v) => setRole(v as any)}>
                  <SelectTrigger className="h-8">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Member">Member</SelectItem>
                    <SelectItem value="Admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-1.5 sm:grid-cols-[1fr_auto]">
                <Input value={inviteLink} readOnly aria-label="Shareable invite link" />
                <Button
                    variant="outline"
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(inviteLink)
                      setCopied(true)
                      setTimeout(() => setCopied(false), 1500)
                    } catch {}
                  }}
                >
                  {copied ? "Copied" : "Copy"}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Anyone with this link can join <span className="font-medium">{team.name}</span> as a {role}.
              </p>
            </div>
          </div>
            <div className="mt-4 flex justify-end">
              <Button
                variant="destructive"
                className="hover:bg-red-600"
              >
                <Trash2 className="mr-2 size-4" aria-hidden />
                Delete team
              </Button>
            </div>
        </div>

        {/* Transfer Ownership dialog */}
        <Dialog open={transferOpen} onOpenChange={setTransferOpen}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>Transfer ownership</DialogTitle>
              <DialogDescription>
                Select a member to become the new owner of <span className="font-medium">{team.name}</span>.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-2">
              <label className="text-xs text-muted-foreground">Member</label>
              <Select value={transferMemberId ?? undefined} onValueChange={(v) => setTransferMemberId(v)}>
                <SelectTrigger className="h-8">
                  <SelectValue placeholder="Select a member" />
                </SelectTrigger>
                <SelectContent>
                  {team.members
                    .filter((m) => m.role !== "Owner")
                    .map((m) => (
                      <SelectItem key={m.id} value={m.id}>
                        {m.name}
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
                  console.log("[v0] Transfer ownership", { teamId: team.id, memberId: transferMemberId })
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
      </DialogContent>
    </Dialog>
  )
}

// Local React import to satisfy hooks usage
import * as React from "react"
