"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { Users } from "lucide-react"
import type { Team } from "@/app/dashboard/teams/page"

export function TeamCard({
  team,
  onClick,
  className,
  layout="detailed",
  children
}: {
  team: Team
  onClick?: () => void
  className?: string,
  layout:"minimal" | "detailed"
  children?: React.ReactNode
}) {
  const count = team.members.length
  const initials = team.name
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()

  return (
      <Card  onClick={onClick}  aria-label={`Open team ${team.name}`} className={`p-4 gap-6 cursor-pointer  hover:bg-muted ${className}`}>
        {/* <div className="flex items-center justify-between"> */}
          <div className="flex items-start gap-3">
          <Avatar className="size-8">
            <AvatarImage alt={team.name} />
            <AvatarFallback className="text-xs">{initials}</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <div className="text-sm font-medium leading-none">{team.name}</div>
            {team.description ? <div className="text-xs text-muted-foreground whitespace-wrap line-clamp-2 h-8">{team.description}</div> : null}
          </div>
          {children}
        </div>
        {layout==="detailed" && <div className="flex items-start w-full gap-3">
          <div className="text-xs text-muted-foreground flex items-center gap-1">
            <Users className="size-3.5" aria-hidden />
            {count} member{count === 1 ? "" : "s"}
          </div>
          <Badge variant="outline" className="text-xs">
            View members
          </Badge>
        </div>}
        
        {/* </div> */}
      </Card>
  )
}
