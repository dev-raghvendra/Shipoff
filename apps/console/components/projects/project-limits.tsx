

"use client"

import { useSession } from "@/context/session.context"
import { useEffect, useState } from "react"

export function ProjectLimits({projectCount}:{projectCount:number}) {
    const [limit,setLimit] = useState<number>(0)
    const {data:session,status} = useSession()
    
    useEffect(()=>{
      if(status==="loading") return
      if(!session) window.location.href="/login"
      if(session?.user) {
         setLimit(session.user.subscription.perks.staticProjects + session.user.subscription.perks.dynamicProjects)
      }
    },[session,status])

    const LIMIT_USED = projectCount
    const LIMIT_REMAINING = Math.max(0, limit - LIMIT_USED)
    const PERCENT = Math.min(100, Math.round((LIMIT_USED / limit) * 100))
    return (
       <section aria-label="Project limits" className="rounded-lg border">
        <div className="flex flex-col gap-3 p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Limit: <span className="text-foreground">{limit}</span> projects
            </div>
            <div className="text-sm text-muted-foreground">
              Used: <span className="text-foreground">{LIMIT_USED}</span> • Available:{" "}
              <span className="text-foreground">{LIMIT_REMAINING}</span>
            </div>
          </div>
          <div className="h-2 w-full overflow-hidden rounded bg-muted">
            <div
              className="h-full bg-primary transition-all"
              style={{ width: `${PERCENT}%` }}
              aria-label={`Projects used ${LIMIT_USED} of ${limit}`}
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={limit}
              aria-valuenow={LIMIT_USED}
            />
          </div>
        </div>
      </section>
    )
}