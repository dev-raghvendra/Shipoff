"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { Users, ChevronRight } from "lucide-react"
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
  const count = team._count.teamMembers
  const initials = team.teamName
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()

  return (
    <Card 
      onClick={onClick}  
      aria-label={`Open team ${team.teamName}`} 
      className={cn(
        "group p-5 cursor-pointer hover:shadow-md transition-all duration-200 hover:border-primary/20 animate-in fade-in-0 slide-in-from-bottom-2",
        className
      )}
    >
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start gap-3">
          <Avatar className="size-10">
            <AvatarImage alt={team.teamName} />
            <AvatarFallback className="text-sm font-semibold">{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold leading-tight text-pretty truncate">{team.teamName}</h3>
            {team.description && (
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{team.description}</p>
            )}
          </div>
          <ChevronRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1 flex-shrink-0" />
        </div>

        {/* Footer */}
        {layout === "detailed" && (
          <div className="flex items-center justify-between pt-3 border-t border-border/50">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Users className="size-3.5" />
              <span>{count} member{count === 1 ? "" : "s"}</span>
            </div>
            <Badge variant="outline" className="text-xs">
              View members
            </Badge>
          </div>
        )}
        
        {children}
      </div>
    </Card>
  )
}
