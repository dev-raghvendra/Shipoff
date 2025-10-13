import { GitBranch, User, GitCommit, ArrowUpFromLine, List, ListEnd, CircleX } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "../ui/spinner";

type Deployment = {
  id: string
  project: string
  env: "production" | "preview" | "staging"
  status: "PRODUCTION" | "BUILDING" | "FAILED" | "QUEUED" | "PROVISIONING"
  duration: string
  createdAt: string
  commitMessage: string
  commitAuthor: string
  commitHash: string
  branch: string
}

function statusBadge(status: Deployment["status"]) {
  switch (status) {
    case "PRODUCTION":
      return <Badge className="bg-[var(--label-bg-success)] text-[var(--label-fg-success)]"><ArrowUpFromLine />PRODUCTION</Badge>
    case "BUILDING":
      return <Badge className="bg-[var(--label-bg-alert)] text-[var(--label-fg-alert)]"><Spinner />BUILDING</Badge>
    case "PROVISIONING":
      return <Badge className="bg-[var(--label-bg-warning)] text-[var(--label-fg-warning)]"><Spinner />PROVISIONING</Badge>
    case "FAILED":
      return <Badge className="bg-[var(--label-bg-destructive)] text-[var(--label-fg-destructive)]"><CircleX />FAILED</Badge>
    case "QUEUED":
      return <Badge className="bg-[var(--label-bg-quiet)] text-[var(--label-fg-quiet)]"><ListEnd />QUEUED</Badge>
  }
}

export default function DeploymentCard({ d }: { d: Deployment }) {
  return (
    <Card className="group transition-colors hover:bg-muted/50">
      <CardHeader className="pb-1">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <CardTitle className="text-base">{d.project}</CardTitle>
            <Badge variant="secondary" className="flex items-center gap-1">
              <GitBranch aria-hidden="true" className="h-3.5 w-3.5" />
              <span className="leading-none">{d.branch}</span>
            </Badge>
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <User aria-hidden="true" className="h-4 w-4" />
            <span className="font-medium text-foreground">{d.commitAuthor}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0 pb-2">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <GitCommit aria-hidden="true" className="h-4 w-4 text-muted-foreground" />
            <p className="truncate text-sm">{d.commitMessage}</p>
          </div>
          <code
            aria-label={`Commit hash ${d.commitHash}`}
            className="shrink-0 rounded bg-muted px-2 py-0.5 font-mono text-xs"
          >
            {d.commitHash}
          </code>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center gap-2">{statusBadge(d.status)}</div>
          <div className="text-xs text-muted-foreground">
            {d.duration} • {d.createdAt}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}