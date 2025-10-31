import { Github, Globe, Lock } from "lucide-react"
import { Skeleton } from "../ui/skeleton"
import { GithubRepo } from "./settings/repository-settings"

export default function RepoCard({repo, selectedRepo, setSelectedRepo, isLoading}:{
  repo:GithubRepo,
  selectedRepo:GithubRepo | null,
  setSelectedRepo: (repo:GithubRepo) => void,
  isLoading?:boolean
}) {
  return (<button
                    key={isLoading ? "loading" : repo.githubRepoId}
                    onClick={() => setSelectedRepo(repo)}
                    className={`w-full text-left p-3 rounded-lg border-2 transition-colors flex items-center justify-between ${
                      selectedRepo?.githubRepoId === repo.githubRepoId ? "border-primary bg-primary/5" : "border-border hover:bg-muted"
                    }`}
                  >
                    <div className="relative">
                      <p className="font-medium text-sm flex items-center gap-2"><Github size="14" /> {isLoading ? "Loading..." : repo.githubRepoName}</p>
                      <p className="text-xs text-muted-foreground">{isLoading ? "Loading..." : repo.githubRepoFullName}</p>
                      {isLoading && <Skeleton className="absolute inset-0"/>}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground relative">
                      {isLoading ? "Loading" :repo.githubRepoPrivate ? <Lock className="h-3 w-3" /> : <Globe className="h-3 w-3" />}
                      <span>{isLoading ? "Loading..." : repo.githubRepoPrivate ? "Private" : "Public"}</span>
                      {isLoading && <Skeleton className="absolute inset-0"/>}
                    </div>
                  </button>)
}