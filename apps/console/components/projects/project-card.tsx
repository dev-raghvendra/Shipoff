"use client"

import { Card } from "@/components/ui/card"
import { InferResponse } from "@shipoff/types"
import {  ProjectResponse } from "@shipoff/proto"
import { ChevronRight, Calendar, Globe } from "lucide-react"
import { useTheme } from "next-themes"
import { formatDistanceToNow } from "date-fns"
import { FrameworkIcon } from "../ui/framework-icon"
import { enUS } from "date-fns/locale"

export type ProjectItem = InferResponse<ProjectResponse>["res"]

export default function ProjectCard({ item }: { item: ProjectItem }) {
  const runtimeVariant =
    item.framework.applicationType === "STATIC"
      ? "bg-yellow-600/10 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800"
      : "bg-blue-600/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800"

  const theme = useTheme()


  // Format the updated date
  const customLocale = {
  ...enUS,
  formatDistance: (token: string, count: number, options?: any) => {
    const suffix = options?.addSuffix ? (options.comparison > 0 ? ' from now' : ' ago') : ''

    const formatMap: Record<string, string> = {
      lessThanXMinutes: `less than ${count} min`,
      xMinutes: `${count} min`,
      aboutXHours: `about ${count} hrs`,
      xHours: `${count} hrs`,
      xDays: `${count} days`,
      aboutXWeeks: `about ${count} weeks`,
      xWeeks: `${count} weeks`,
      aboutXMonths: `about ${count} months`,
      xMonths: `${count} months`,
      aboutXYears: `about ${count} yrs`,
      xYears: `${count} yrs`,
      overXYears: `over ${count} yrs`,
      almostXYears: `almost ${count} yrs`,
      lessThanXSeconds: `less than ${count} sec`,
      xSeconds: `${count} sec`,
    }

    return (formatMap[token] || '') + suffix
  },
}

const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString)
    return formatDistanceToNow(date, { addSuffix: true, locale: customLocale })
  } catch {
    return dateString
  }
}

  return (
    <Card className="group relative flex flex-col gap-4 p-5 hover:shadow-md transition-all duration-200 hover:border-primary/20 cursor-pointer animate-in fade-in-0 slide-in-from-bottom-2">
      {/* Header with title and chevron */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold leading-tight text-pretty truncate">{item.name}</h3>
          {item.description && (
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{item.description}</p>
          )}
        </div>
        <ChevronRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1 flex-shrink-0" />
      </div>

      {/* Framework and Runtime */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="h-5 w-5 overflow-hidden flex items-center justify-center">
          <FrameworkIcon alt={item.framework.displayName} src={item.framework.keywordName} />
          </div>
          <span className="text-sm font-medium text-foreground">{item.framework.displayName}</span>
        </div>
        <span
          className={`inline-flex items-center rounded-md border px-2 py-1 text-xs font-medium ${runtimeVariant}`}
          aria-label={`Runtime ${item.framework.runtime}`}
        >
          {item.framework.runtime}
        </span>
      </div>

      {/* Footer with updated time */}
      <div className="flex items-center justify-between pt-2 border-t border-border/50">
        <div className="flex items-center gap-1.5  text-xs text-muted-foreground">
          <Calendar className="h-3 w-3" />
          <span className="min-w-20">Updated {formatDate(item.updatedAt)}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Globe className="h-3 w-3" />
          <span className="capitalize">{item.framework.applicationType.toLowerCase()}</span>
        </div>
      </div>
    </Card>
  )
}
