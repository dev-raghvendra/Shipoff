"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { GitBranch, Unlink, LinkIcon, AlertCircle, Loader2, Github } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { InferResponse } from "@/types/response"
import { GithubRepoResponse } from "@shipoff/proto"
import { useGithubRepos } from "@/hooks/use-github-repos"
import { githubService } from "@/services/github.service"
import projectService from "@/services/projects.service"
import { toast } from "sonner"
import RepoCard from "../repo-card"
import { Skeleton } from "@/components/ui/skeleton"
import { GITHUB_API_ROUTES } from "@/config/service-route-config"
import { useSession } from "@/context/session.context"
import Link from "next/link"

interface RepositorySettingsProps {
  projectId: string
  initialGithubRepoBranch?: string
  initialGithubRepoRootDir?: string
  intialGithubRepoURI?:string
  initialGithubRepoFullName?: string
  refetchProject: () => Promise<any>
  isLoading?: boolean
}

export type GithubRepo = InferResponse<GithubRepoResponse>["res"]

export function RepositorySettings({ projectId,intialGithubRepoURI, initialGithubRepoFullName, initialGithubRepoBranch, initialGithubRepoRootDir ,refetchProject, isLoading}: RepositorySettingsProps) {
  const [linkedRepo, setLinkedRepo] = useState<{
    name: string
    url: string
    branch: string
    rootDir: string
  } | null>(null)
  const [isUnlinking, setIsUnlinking] = useState(false)
  const [isLinking, setIsLinking] = useState(false)
  const [showLinkDialog, setShowLinkDialog] = useState(false)
  const [showUnlinkConfirm, setShowUnlinkConfirm] = useState(false)
  const [showChangeRepoConfirm, setShowChangeRepoConfirm] = useState(false)
  const [githubInstalled, setGithubInstalled] = useState(false)
  const [checkingGithub, setCheckingGithub] = useState(true)

  const [selectedRepo, setSelectedRepo] = useState<GithubRepo | null>(null)
  const [selectedBranch, setSelectedBranch] = useState("")
  const [rootDir, setRootDir] = useState("/")
  const [repoSearch, setRepoSearch] = useState("")
  const repoContainerRef = useRef<HTMLDivElement>(null)
  const dialogRepoContainerRef = useRef<HTMLDivElement>(null)

  const {data:repos,isLoading:isReposLoading, isFetchingNextPage:isFetchingNextRepos, fetchNextPage, hasNextPage} = useGithubRepos({enabled:githubInstalled})
  const {data:session,status} = useSession()
  // Sync linked repo when initial props change
  useEffect(() => {
    if (intialGithubRepoURI && initialGithubRepoFullName && initialGithubRepoBranch && initialGithubRepoRootDir) {
      setLinkedRepo({
        name: initialGithubRepoFullName,
        url: intialGithubRepoURI,
        branch: initialGithubRepoBranch,
        rootDir: initialGithubRepoRootDir,
      })
    }
  }, [intialGithubRepoURI, initialGithubRepoFullName, initialGithubRepoBranch, initialGithubRepoRootDir])

  useEffect(() => {
    if (isLoading) return
    
    const checkGithubInstallation = async () => {
      try {
        setCheckingGithub(true)
        await githubService.getGithubInstallation()
        setGithubInstalled(true)
      } catch (error) {
        setGithubInstalled(false)
      } finally {
        setCheckingGithub(false)
      }
    }
    checkGithubInstallation()
  }, [isLoading])


  useEffect(() => {
    if (isReposLoading) return
    if (repos.length > 0) {
      repoContainerRef.current?.scrollTo({ top: repoContainerRef.current.scrollHeight, behavior: 'smooth' })
      dialogRepoContainerRef.current?.scrollTo({ top: dialogRepoContainerRef.current.scrollHeight, behavior: 'smooth' })
    }
  }, [repos.length, isReposLoading, isFetchingNextRepos])

  // Set default branch when a repo is selected
  useEffect(() => {
    if (selectedRepo && !selectedBranch) {
      setSelectedBranch(selectedRepo.githubRepoDefaultBranch)
    }
  }, [selectedRepo])

  const handleUnlink = () => {
    setShowUnlinkConfirm(true)
  }

  const confirmUnlink = async () => {
    if (isLoading) return
    setIsUnlinking(true)
    setShowUnlinkConfirm(false)
    try {
    await projectService.unlinkRepository({ projectId }) 
    setLinkedRepo(null)
    setIsUnlinking(false)
    setShowLinkDialog(true)
    await refetchProject()
    toast.success("Repository unlinked successfully!");
    } catch (error:any) {
      toast.error(error.message || "Failed to unlink repository, please try again later.")
    } finally {
      setIsUnlinking(false)
    }
  }

  const handleChangeRepo = () => {
    setShowChangeRepoConfirm(true)
  }

  const confirmChangeRepo = () => {
    setShowChangeRepoConfirm(false)
    setShowLinkDialog(true)
  }

  const handleLinkRepo = async () => {
    if (!selectedRepo || isLoading) return
    setIsLinking(true)
    
    try {
      await projectService.linkRepository({
        projectId,
        githubRepoId: selectedRepo.githubRepoId,
        branch: selectedBranch,
        githubRepoFullName: selectedRepo.githubRepoFullName,
        githubRepoURI: selectedRepo.githubRepoURI,
        rootDir
      })
      setLinkedRepo({
        name: selectedRepo.githubRepoName,
        url: selectedRepo.githubRepoFullName,
        branch: selectedBranch,
        rootDir,
      })
      await refetchProject()
      setSelectedRepo(null)
    setSelectedBranch("")
    setRootDir("/")
    setShowLinkDialog(false)
    toast.success("Repository linked successfully!");
    } catch (error:any) {
      toast.error(error.message || "Failed to link repository, please try again later.")
    } finally {
      setIsLinking(false)
    }
  }

  const handleLinkGithub = () => {
    if (status === "loading") return
    if (status === "unauthenticated") window.location.href = "/signin"
    if (!session) return
    window.location.href = GITHUB_API_ROUTES.GITHUB_APP_INSTALLATION({state:session.accessToken})
  }

  return (
    <div className="space-y-6">
        {(checkingGithub || isLoading) ? (
          <>
            <Skeleton className="h-32 w-full" />
            <div className="space-y-3">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full max-w-md" />
            </div>
            <div className="space-y-3">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-10 w-full max-w-md" />
            </div>
          </>
        ) : (
          <>
        {!githubInstalled && (
          <Alert className="border-amber-500/50 bg-amber-500/10">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="space-y-3">
              <div>
                <p className="font-medium text-foreground mb-1">GitHub account not connected</p>
                <p className="text-sm text-muted-foreground">
                  Connect your GitHub account to link repositories and enable automatic deployments from your codebase.
                </p>
              </div>
              <Button size="sm" onClick={handleLinkGithub} className="gap-2">
                <Github className="h-4 w-4" />
                Connect GitHub
              </Button>
            </AlertDescription>
          </Alert>
        )}

        { linkedRepo ? (
          <div className="space-y-4">
            <div className="rounded-lg border bg-muted/30 p-5">
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-3 flex-1">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5">Connected Repository</p>
                      <p className="font-semibold text-base">{linkedRepo.name}</p>
                    </div>
                    <Link href={linkedRepo.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm hover:underline underline-offset-4 text-muted-foreground font-mono">
                      <Github className="h-4 w-4" />
                      {linkedRepo.url}
                    </Link>
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-3 border-t">
                  <div className="flex items-center gap-2">
                    <GitBranch className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Branch:</span>
                    <Badge variant="secondary" className="font-mono text-xs">
                      {linkedRepo.branch}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Root:</span>
                    <code className="text-xs font-mono bg-muted px-2 py-1 rounded">
                      {linkedRepo.rootDir}
                    </code>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleChangeRepo}
                className="gap-2"
              >
                <LinkIcon className="h-4 w-4" />
                Change Repository
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleUnlink}
                disabled={isUnlinking}
                className="gap-2 text-destructive hover:bg-destructive/10 hover:text-destructive"
              >
                <Unlink className="h-4 w-4" />
                {isUnlinking ? <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Unlinking...
                </> : "Disconnect"}
              </Button>
            </div>

            {/* Dialog for changing linked repo */}
            <Dialog open={showLinkDialog} onOpenChange={setShowLinkDialog}>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Link a repository</DialogTitle>
                </DialogHeader>
                <div className="space-y-5">
                  <div>
                    <label className="text-sm font-medium">Search repositories</label>
                    <Input
                      placeholder="Type to filter by name..."
                      className="mt-2"
                      value={repoSearch}
                      onChange={(e) => setRepoSearch(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Select repository</label>
                    <div className="mt-2 border rounded-lg">
                      <div className="space-y-2 p-3 max-h-64 overflow-y-auto" ref={dialogRepoContainerRef}>
                        {isReposLoading ? (
                          // Show skeleton only on initial load
                          Array.from({length:5}).map((_,i) => (
                            <RepoCard key={i} repo={{
                              githubRepoId: `loading-${i}`,
                              githubRepoName: "Loading...",
                              githubRepoFullName: "Loading...",
                              githubRepoDefaultBranch: "main",
                              githubRepoURI: "Loading...",
                              githubRepoPrivate: false,
                              branches: []
                            }} selectedRepo={selectedRepo} setSelectedRepo={setSelectedRepo} isLoading={true} />
                          ))
                        ) : (
                          repos.filter(r => r.githubRepoFullName.toLowerCase().includes(repoSearch.toLowerCase().trim())).map((repo) => (
                            <RepoCard key={repo.githubRepoId} isLoading={false} repo={repo} selectedRepo={selectedRepo} setSelectedRepo={setSelectedRepo} />
                          ))
                        )}
                      </div>
                      {/* Load More button in Dialog */}
                      {!isReposLoading && hasNextPage && (
                        <div className="border-t p-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => fetchNextPage()}
                            disabled={isFetchingNextRepos}
                            className="w-full"
                          >
                            {isFetchingNextRepos ? (
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
                  </div>

                  {selectedRepo && (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="text-sm font-medium">Branch</label>
                          <Select value={selectedBranch || selectedRepo.githubRepoDefaultBranch}  onValueChange={(v)=>setSelectedBranch(v)}>
                            <SelectTrigger className="mt-2">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {selectedRepo.branches.map((branch) => (
                                <SelectItem key={branch} value={branch}>
                                  {branch}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="sm:col-span-2">
                          <label className="text-sm font-medium">Root directory</label>
                          <Input
                            value={rootDir}
                            onChange={(e) => setRootDir(e.target.value)}
                            placeholder="/"
                            className="mt-2 font-mono text-sm"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-2">
                        <Button variant="outline" onClick={() => setShowLinkDialog(false)}>Cancel</Button>
                        <Button onClick={handleLinkRepo} disabled={isLinking || !selectedRepo}>
                          {isLinking ? <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Linking...
                          </> : "Link repository"}
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </DialogContent>
            </Dialog>

            {/* Confirmation dialog for disconnecting repository */}
            <AlertDialog open={showUnlinkConfirm} onOpenChange={setShowUnlinkConfirm}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Disconnect repository?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will disconnect <strong>{linkedRepo?.name}</strong> from this project. You can reconnect it or link a different repository later.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={confirmUnlink} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Disconnect
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            {/* Confirmation dialog for changing repository */}
            <AlertDialog open={showChangeRepoConfirm} onOpenChange={setShowChangeRepoConfirm}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Change repository?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will disconnect <strong>{linkedRepo?.name}</strong> and allow you to link a different repository. Your current deployment configuration will be removed.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={confirmChangeRepo}>
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        ) : githubInstalled ? (
          <div className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Repository</label>
              <p className="text-[13px] text-muted-foreground">
                Choose a repository from your GitHub account to connect to this project
              </p>
            </div>
            <div className="border rounded-lg">
              <div className="space-y-2 p-4 max-h-80 overflow-y-auto" ref={repoContainerRef}>
                {(isReposLoading) ? (
                  // Show skeleton only on initial load
                  Array.from({length:5}).map((_,i) => (
                    <RepoCard key={i} repo={{
                      githubRepoId: `loading-${i}`,
                      githubRepoName: "Loading...",
                      githubRepoFullName: "Loading...",
                      githubRepoDefaultBranch: "main",
                      githubRepoURI: "Loading...",
                      githubRepoPrivate: false,
                      branches: []
                    }} selectedRepo={selectedRepo} setSelectedRepo={setSelectedRepo} isLoading={true} />
                  ))
                ) : (
                  repos.map((repo) => (
                    <RepoCard key={repo.githubRepoId} repo={repo} selectedRepo={selectedRepo} setSelectedRepo={setSelectedRepo} />
                  ))
                )}
              </div>
              {/* Load More button - outside scrollable container */}
              {!isReposLoading && hasNextPage && (
                <div className="border-t p-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextRepos}
                    className="w-full"
                  >
                    {isFetchingNextRepos ? (
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

            {selectedRepo && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-4">
                  <div className="space-y-2">
                    <label htmlFor="branch-select" className="text-sm font-medium">Branch</label>
                    <Select value={selectedBranch || selectedRepo.githubRepoDefaultBranch}  onValueChange={(v)=>setSelectedBranch(v)}>
                      <SelectTrigger id="branch-select">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedRepo?.branches.map((branch) => (
                          <SelectItem key={branch} value={branch}>
                            <div className="flex items-center gap-2">
                              <GitBranch className="h-3.5 w-3.5" />
                              {branch}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      Deploy from this branch
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="root-dir" className="text-sm font-medium">Root Directory</label>
                    <Input
                      id="root-dir"
                      value={rootDir}
                      onChange={(e) => setRootDir(e.target.value)}
                      placeholder="/"
                      className="font-mono text-sm"
                    />
                    <p className="text-xs text-muted-foreground">
                      The directory containing your project files
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button onClick={handleLinkRepo} disabled={isLinking || !selectedRepo}>
                     <span className="inline-flex items-center gap-2">
                     {isLinking ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                     {isLinking ? "Linking" : "Link repository"}
                     </span>
                  </Button>
                </div>
              </div>
            )}
          </div>
        ) : null}
          </>
        )}
    </div>
  )
}


