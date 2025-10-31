import { RefObject, useState, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Github, Lock, Globe, Search } from "lucide-react"
import RepoCard from "@/components/projects/repo-card"
import { GITHUB_API_ROUTES } from "@/config/service-route-config"
import { useSession } from "@/context/session.context"

interface GithubRepo {
  githubRepoId: string
  githubRepoName: string
  branches: string[]
  githubRepoFullName: string
  githubRepoURI: string
  githubRepoPrivate: boolean
  githubRepoDefaultBranch: string
}

interface RepositoryStepProps {
  checkingGithub: boolean
  githubInstalled: boolean
  isLoadingRepos: boolean
  isFetchingNextPage: boolean
  hasNextPage?: boolean
  availableRepos: GithubRepo[]
  selectedRepo: GithubRepo | null
  branch: string
  rootDir: string
  repoContainerRef: RefObject<HTMLDivElement | null>
  onSelectRepo: (repo: GithubRepo) => void
  onBranchChange: (branch: string) => void
  onRootDirChange: (rootDir: string) => void
  onLoadMore: () => void
}

export function RepositoryStep({
  checkingGithub,
  githubInstalled,
  isLoadingRepos,
  isFetchingNextPage,
  hasNextPage,
  availableRepos,
  selectedRepo,
  branch,
  rootDir,
  repoContainerRef,
  onSelectRepo,
  onBranchChange,
  onRootDirChange,
  onLoadMore,
}: RepositoryStepProps) {

  const {data:session} = useSession()
  const [searchQuery, setSearchQuery] = useState("")

  // Filter repositories based on search query
  const filteredRepos = useMemo(() => {
    if (!searchQuery.trim()) return availableRepos
    const query = searchQuery.toLowerCase()
    return availableRepos.filter(repo => 
      repo.githubRepoName.toLowerCase().includes(query) ||
      repo.githubRepoFullName.toLowerCase().includes(query)
    )
  }, [availableRepos, searchQuery])


  if (checkingGithub) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" /> Checking GitHub connection...
      </div>
    )
  }

  useEffect(() => {
    if (isLoadingRepos || isFetchingNextPage) return
    if (availableRepos.length > 0) {
      repoContainerRef.current?.scrollTo({ top: repoContainerRef.current.scrollHeight, behavior: 'smooth' })
    }
  }, [availableRepos.length, isLoadingRepos, isFetchingNextPage])

  if (!githubInstalled) {
    return (
      <Alert>
        <AlertDescription>
          <p className="font-medium mb-2">GitHub account not linked</p>
          <p className="text-sm mb-3">
            Link your GitHub account to select a repository for automatic deployments.
          </p>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => { window.location.href = GITHUB_API_ROUTES.GITHUB_APP_INSTALLATION({state:session!.accessToken}) }}
          >
            Link GitHub account
          </Button>
        </AlertDescription>
      </Alert>
    )
  }

  const emptyRepo = {
    githubRepoId: "",
    githubRepoName: "",
    branches: [],
    githubRepoFullName: "",
    githubRepoURI: "",
    githubRepoPrivate: false,
    githubRepoDefaultBranch: ""
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs text-muted-foreground">Select repository</label>
        
        {/* Search Input */}
        <div className="relative mt-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search repositories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="border rounded-lg">
          <div className="mt-2 space-y-2 max-h-96 overflow-y-auto pr-2 p-3" ref={repoContainerRef}>
            {isLoadingRepos ? (
              // Show skeleton only on initial load
              Array.from({ length: 5 }).map((_, i) => (
                <RepoCard 
                  key={i} 
                  isLoading={true} 
                  repo={emptyRepo}
                  setSelectedRepo={onSelectRepo} 
                  selectedRepo={selectedRepo} 
                />
              ))
            ) : filteredRepos.length === 0 ? (
              <div className="text-center py-8 text-sm text-muted-foreground">
                {searchQuery ? `No repositories found matching "${searchQuery}"` : "No repositories available"}
              </div>
            ) : (
              filteredRepos.map((repo) => (
                <button
                  key={repo.githubRepoId}
                  onClick={() => onSelectRepo(repo)}
                  className={`w-full text-left p-3 rounded-lg border transition-colors flex items-center justify-between ${
                    selectedRepo?.githubRepoId === repo.githubRepoId 
                      ? "border-primary bg-primary/5" 
                      : "hover:bg-muted"
                  }`}
                >
                  <div>
                    <p className="font-medium text-sm flex items-center gap-2">
                      <Github size={14} /> {repo.githubRepoName}
                    </p>
                    <p className="text-xs text-muted-foreground">{repo.githubRepoFullName}</p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    {repo.githubRepoPrivate ? <Lock className="h-3 w-3" /> : <Globe className="h-3 w-3" />}
                    <span>{repo.githubRepoPrivate ? "Private" : "Public"}</span>
                  </div>
                </button>
              ))
            )}
          </div>
          
          {/* Load More Button - Outside scrollable container */}
          {hasNextPage && !searchQuery && !isLoadingRepos && (
            <div className="border-t p-3">
              <Button 
                variant="outline" 
                onClick={onLoadMore}
                disabled={isFetchingNextPage}
                className="w-full"
                size="sm"
              >
                {isFetchingNextPage ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Loading...
                  </>
                ) : (
                  'Load More'
                )}
              </Button>
            </div>
          )}
        </div>
        
        {/* Message when searching with more repos available */}
        {searchQuery && hasNextPage && (
          <p className="text-xs text-muted-foreground text-center mt-2">
            Showing results from loaded repositories. Clear search or load more to see additional repos.
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="text-xs text-muted-foreground">Branch</label>
          <Select value={branch} onValueChange={onBranchChange}>
            <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
            <SelectContent>
              {selectedRepo && selectedRepo.branches.length > 0 ? (
                selectedRepo.branches.map(b => (
                  <SelectItem key={b} value={b}>{b}</SelectItem>
                ))
              ) : (
                ['main', 'develop', 'staging', 'production'].map(b => (
                  <SelectItem key={b} value={b}>{b}</SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>
        <div className="sm:col-span-2">
          <label className="text-xs text-muted-foreground">Root directory</label>
          <Input 
            className="mt-1 font-mono text-xs" 
            value={rootDir} 
            onChange={(e) => onRootDirChange(e.target.value)}
            placeholder="/"
          />
        </div>
      </div>
    </div>
  )
}

