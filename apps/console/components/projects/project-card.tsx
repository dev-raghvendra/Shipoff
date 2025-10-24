"use client"

import { Card } from "@/components/ui/card"
import { InferResponse } from "@/types/response"
import {  ProjectResponse } from "@shipoff/proto"
import { ChevronRight } from "lucide-react"
import { useTheme } from "next-themes"

export type ProjectItem = InferResponse<ProjectResponse>["res"]

export default function ProjectCard({ item }: { item: ProjectItem }) {
  const runtimeVariant =
    item.framework.applicationType === "STATIC"
      ? "bg-yellow-600/10 text-yellow-700 dark:text-yellow-400"
      : "bg-blue-600/10 text-blue-700 dark:text-blue-400"

  const theme = useTheme()

 function getIcon(frameworkKeyword:string){
    return theme.resolvedTheme === "dark" 
    ? `/framework/${frameworkKeyword}-dark.svg`
    : `/framework/${frameworkKeyword}-light.svg`
}

 function fallbackIcon(keywordName:string){
  return `/framework/${keywordName}.svg`
}
  return (
    <Card className="group relative flex flex-col gap-3 p-4 hover:shadow-sm transition-shadow">
      {/* Title */}
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-medium leading-none text-pretty">{item.name}</h3>
        <ChevronRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
      </div>

      {/* Description (optional) */}
      {item.description ? <p className="text-sm text-muted-foreground h-14 line-clamp-3">{item.description}</p> : null}

      {/* Footer: Framework + Runtime on the left, Updated time on the right */}
      <div className="mt-2 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="h-4 overflow-hidden flex items-center">
            <img src={getIcon(item.framework.keywordName)} onError={(e) => { e.currentTarget.src = fallbackIcon(item.framework.keywordName) }} alt={item.framework.name} className="h-4 mr-1 inline" />
          </div>
          <span
            className={`inline-flex items-center rounded border px-2 py-0.5 text-xs ${runtimeVariant}`}
            aria-label={`Runtime ${item.framework.runtime}`}
          >
            {item.framework.runtime}
          </span>
        </div>
        <span className="text-xs text-muted-foreground">{item.updatedAt}</span>
      </div>
    </Card>
  )
}
