"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { GitBranch, Unlink, LinkIcon, AlertCircle, Loader2, Github, Lock, Globe } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface RepositorySettingsProps {
  projectId: string
  hideActions?: boolean
  onValidityChange?: (isValid: boolean) => void
}

const MOCK_GITHUB_REPOS = [
  { id: "repo_1", name: "my-paas-app", url: "https://github.com/example/my-paas-app", private: false },
  { id: "repo_2", name: "another-project", url: "https://github.com/example/another-project", private: true },
  { id: "repo_3", name: "web-app", url: "https://github.com/example/web-app", private: false },
]

const MOCK_BRANCHES = ["main", "develop", "staging", "production"]

export function RepositorySettings({ projectId, hideActions, onValidityChange }: RepositorySettingsProps) {
  const [linkedRepo, setLinkedRepo] = useState<{
    name: string
    url: string
    branch: string
    rootDir: string
  } | null>({
    name: "my-paas-app",
    url: "example/my-paas-app",
    branch: "main",
    rootDir: "/",
  })
  const [isUnlinking, setIsUnlinking] = useState(false)
  const [isLinking, setIsLinking] = useState(false)
  const [showLinkDialog, setShowLinkDialog] = useState(false)
  const [githubInstalled, setGithubInstalled] = useState(false)
  const [checkingGithub, setCheckingGithub] = useState(true)

  const [selectedRepo, setSelectedRepo] = useState<(typeof MOCK_GITHUB_REPOS)[0] | null>(null)
  const [selectedBranch, setSelectedBranch] = useState("main")
  const [rootDir, setRootDir] = useState("/")
  const [repoSearch, setRepoSearch] = useState("")

  useEffect(() => {
    const checkGithubInstallation = async () => {
      try {
        setCheckingGithub(true)
        // Mock API call to check GitHub app installation
        const response = await fetch("/api/github/check-installation", {
          method: "GET",
        })
        const data = await response.json()
        setGithubInstalled(data.installed || false)
      } catch (error) {
        console.log("[v0] GitHub installation check failed:", error)
        setGithubInstalled(false)
      } finally {
        setCheckingGithub(false)
      }
    }
    checkGithubInstallation()
  }, [])

  useEffect(() => {
    if (!onValidityChange) return
    const isValid = Boolean(linkedRepo || selectedRepo)
    onValidityChange(isValid)
  }, [linkedRepo, selectedRepo])

  const handleUnlink = async () => {
    setIsUnlinking(true)
    console.log("[v0] Unlinking repository:", { projectId })
    await new Promise((resolve) => setTimeout(resolve, 500))
    setLinkedRepo(null)
    setIsUnlinking(false)
    setShowLinkDialog(true)
  }

  const handleLinkRepo = async () => {
    if (!selectedRepo) return
    setIsLinking(true)
    console.log("[v0] Linking repository:", { projectId, repo: selectedRepo, branch: selectedBranch, rootDir })
    await new Promise((resolve) => setTimeout(resolve, 500))
    setLinkedRepo({
      name: selectedRepo.name,
      url: selectedRepo.url,
      branch: selectedBranch,
      rootDir,
    })
    setIsLinking(false)
    setShowLinkDialog(false)
    setSelectedRepo(null)
    setSelectedBranch("main")
    setRootDir("/")
  }

  const handleLinkGithub = () => {
    console.log("[v0] Redirecting to GitHub OAuth")
    // In production, this would redirect to your OAuth flow
    window.location.href = "/api/auth/github"
  }

  if (checkingGithub) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Repository</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-6">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Repository</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!githubInstalled && (
          <Alert>
            <AlertCircle className="h-4 w-4 " />
            <AlertDescription>
              <p className="font-medium mb-2">GitHub account not linked</p>
              <p className="text-sm mb-3">Link Shipoff to your GitHub account to link repositories and enable deployments.</p>
              <Button size="sm" onClick={handleLinkGithub} variant="outline">
                Link GitHub account
              </Button>
            </AlertDescription>
          </Alert>
        )}

        { linkedRepo ? (
          <div className="space-y-3">
            <div className="rounded-lg border p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-sm">{linkedRepo.name}</p>
                  <p className="text-xs text-muted-foreground mt-4 flex justify-center items-center gap-1">
                    <Github size="14" />
                    {linkedRepo.url}
                    </p>
                  <div className="flex items-center gap-2 mt-2">
                    <GitBranch className="h-3 w-3 text-muted-foreground" />
                    <Badge variant="outline" className="text-xs">
                      {linkedRepo.branch}
                    </Badge>
                    <span className="text-xs text-muted-foreground">Root: {linkedRepo.rootDir}</span>
                  </div>
                </div>
              </div>
            </div>

            {!hideActions && (
              <div className="flex gap-2">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleUnlink}
                  disabled={isUnlinking}
                  className="flex-1 sm:flex-none"
                >
                  <Unlink className="mr-2 h-4 w-4" />
                  {isUnlinking ? "Unlinking..." : "Unlink repository"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowLinkDialog(true)}
                  className="flex-1 sm:flex-none bg-transparent"
                >
                  <LinkIcon className="mr-2 h-4 w-4" />
                  Link different repo
                </Button>
              </div>
            )}
          </div>
        ) : githubInstalled ? (
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Select a repository to link</p>
              <div className="space-y-2">
                {MOCK_GITHUB_REPOS.map((repo) => (
                  <button
                    key={repo.id}
                    onClick={() => setSelectedRepo(repo)}
                    className={`w-full text-left p-3 rounded-lg border transition-colors flex items-center justify-between ${
                      selectedRepo?.id === repo.id ? "border-primary bg-primary/5" : "hover:bg-muted"
                    }`}
                  >
                    <div>
                      <p className="font-medium text-sm flex items-center gap-2"><Github size="14" /> {repo.name}</p>
                      <p className="text-xs text-muted-foreground">{repo.url}</p>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      {repo.private ? <Lock className="h-3 w-3" /> : <Globe className="h-3 w-3" />}
                      <span>{repo.private ? "Private" : "Public"}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-sm font-medium">Branch</label>
                <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {MOCK_BRANCHES.map((branch) => (
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

            {!hideActions && (
              <Button onClick={handleLinkRepo} disabled={isLinking || !selectedRepo} className="w-full sm:w-auto">
                {isLinking ? "Linking..." : "Link repository"}
              </Button>
            )}
          </div>
        ) : null}

        {!hideActions && (
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
                <div className="mt-2 space-y-2">
                  {MOCK_GITHUB_REPOS.filter(r => r.name.toLowerCase().includes(repoSearch.toLowerCase().trim())).map((repo) => (
                    <button
                      key={repo.id}
                      onClick={() => setSelectedRepo(repo)}
                      className={`w-full text-left p-3 rounded-lg border transition-colors flex items-center justify-between ${
                        selectedRepo?.id === repo.id ? "border-primary bg-primary/5" : "hover:bg-muted"
                      }`}
                    >
                      <div>
                        <p className="font-medium text-sm flex items-center gap-2"><Github size="14" /> {repo.name}</p>
                        <p className="text-xs text-muted-foreground">{repo.url}</p>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        {repo.private ? <Lock className="h-3 w-3" /> : <Globe className="h-3 w-3" />}
                        <span>{repo.private ? "Private" : "Public"}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {selectedRepo && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-sm font-medium">Branch</label>
                      <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {MOCK_BRANCHES.map((branch) => (
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
                      {isLinking ? "Linking..." : "Link repository"}
                    </Button>
                  </div>
                </>
              )}
            </div>
          </DialogContent>
        </Dialog>
        )}
      </CardContent>
    </Card>
  )
}
