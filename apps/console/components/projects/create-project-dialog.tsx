"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ProjectNameSettings } from "@/components/projects/settings/project-info-settings"
import { FrameworkSettings } from "@/components/projects/settings/framework-settings"
import { RepositorySettings } from "@/components/projects/settings/repository-settings"
import { DomainSettings } from "@/components/projects/settings/domain-settings"
import { EnvVariablesSettings } from "@/components/projects/settings/env-var-settings"

interface CreateProjectDialogProps {
  children: React.ReactNode
}

export function CreateProjectDialog({ children }: CreateProjectDialogProps) {
  const [open, setOpen] = useState(false)
  const projectId = "new"

  // Compact form state
  const [name, setName] = useState("my-paas-app")
  const [description, setDescription] = useState("Web app for managing deployments and environments.")

  const [framework, setFramework] = useState("nextjs")
  const [buildCommand, setBuildCommand] = useState("next build")
  const [prodCommand, setProdCommand] = useState("next start -p 3000")
  const [outDir, setOutDir] = useState(".next")

  const [repoName, setRepoName] = useState("")
  const [branch, setBranch] = useState("main")
  const [rootDir, setRootDir] = useState("/")

  const [domainPrefix, setDomainPrefix] = useState("my-paas-app")

  type EnvVar = { id: string; key: string; value: string }
  const [envVars, setEnvVars] = useState<EnvVar[]>([
    { id: Date.now().toString(), key: "ENV_KEY", value: "ENV_VALUE" },
  ])

  const handleAddEnv = () => {
    if (envVars.length >= 3) return
    setEnvVars([...envVars, { id: Date.now().toString(), key: "ENV_KEY", value: "ENV_VALUE" }])
  }
  const handleUpdateEnv = (id: string, field: "key" | "value", val: string) => {
    setEnvVars(envVars.map(e => (e.id === id ? { ...e, [field]: val } : e)))
  }
  const handleRemoveEnv = (id: string) => {
    setEnvVars(envVars.filter(e => e.id !== id))
  }

  const applyFrameworkPreset = (fw: string) => {
    setFramework(fw)
    if (fw === "nextjs") {
      setBuildCommand("next build"); setProdCommand("next start -p 3000"); setOutDir(".next")
    } else if (fw === "vite") {
      setBuildCommand("vite build"); setProdCommand("vite preview"); setOutDir("dist")
    } else if (fw === "react") {
      setBuildCommand("npm run build"); setProdCommand("npm start"); setOutDir("build")
    } else if (fw === "vue") {
      setBuildCommand("npm run build"); setProdCommand("npm run preview"); setOutDir("dist")
    } else if (fw === "svelte") {
      setBuildCommand("npm run build"); setProdCommand("npm run preview"); setOutDir("build")
    }
  }

  const handleCreate = async () => {
    console.log("[v0] Create project:", {
      projectId,
      info: { name, description },
      framework: { framework, buildCommand, prodCommand, outDir },
      repository: { repoName, branch, rootDir },
      domain: { domainPrefix },
      env: envVars,
    })
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-6xl w-[95vw]">
        <DialogHeader>
          <DialogTitle>Create project</DialogTitle>
          <p className="text-sm text-muted-foreground">Configure your project before the first deployment</p>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <section className="space-y-3">
              <h3 className="text-sm font-medium">Info</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-muted-foreground">Project name</label>
                  <Input className="mt-1" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Description</label>
                  <Textarea className="mt-1" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
                </div>
              </div>
            </section>

            <section className="space-y-3">
              <h3 className="text-sm font-medium">Framework</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-muted-foreground">Framework</label>
                  <Select value={framework} onValueChange={applyFrameworkPreset}>
                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="nextjs">Next.js</SelectItem>
                      <SelectItem value="vite">Vite</SelectItem>
                      <SelectItem value="react">React</SelectItem>
                      <SelectItem value="vue">Vue</SelectItem>
                      <SelectItem value="svelte">Svelte</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs text-muted-foreground">Build command</label>
                    <Input className="mt-1 font-mono text-xs" value={buildCommand} onChange={(e) => setBuildCommand(e.target.value)} />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">Production command</label>
                    <Input className="mt-1 font-mono text-xs" value={prodCommand} onChange={(e) => setProdCommand(e.target.value)} />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">Output dir</label>
                    <Input className="mt-1 font-mono text-xs" value={outDir} onChange={(e) => setOutDir(e.target.value)} />
                  </div>
                </div>
              </div>
            </section>

            <section className="space-y-3">
              <h3 className="text-sm font-medium">Repository</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="text-xs text-muted-foreground">Repository</label>
                  <Input className="mt-1" placeholder="user/repo" value={repoName} onChange={(e) => setRepoName(e.target.value)} />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Branch</label>
                  <Select value={branch} onValueChange={setBranch}>
                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {['main','develop','staging','production'].map(b => (
                        <SelectItem key={b} value={b}>{b}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Root directory</label>
                  <Input className="mt-1 font-mono text-xs" value={rootDir} onChange={(e) => setRootDir(e.target.value)} />
                </div>
              </div>
            </section>

            <section className="space-y-3">
              <h3 className="text-sm font-medium">Domain</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
                <div className="sm:col-span-2">
                  <label className="text-xs text-muted-foreground">Domain prefix</label>
                  <Input className="mt-1 font-mono text-xs" value={domainPrefix} onChange={(e) => setDomainPrefix(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))} />
                </div>
                <div className="text-xs text-muted-foreground">
                  <div>Preview</div>
                  <div className="mt-1 font-mono text-foreground">{domainPrefix}.on.shipoff.in</div>
                </div>
              </div>
            </section>

            <section className="space-y-3 md:col-span-2">
              <h3 className="text-sm font-medium">Environment variables</h3>
              <div className="grid grid-cols-1 sm:grid-cols-6 gap-2">
                {envVars.map((env) => (
                  <div key={env.id} className="contents">
                    <Input className="sm:col-span-2 font-mono text-xs" value={env.key} onChange={(e) => handleUpdateEnv(env.id, 'key', e.target.value)} placeholder="KEY" />
                    <Input className="sm:col-span-3 font-mono text-xs" value={env.value} onChange={(e) => handleUpdateEnv(env.id, 'value', e.target.value)} placeholder="VALUE" />
                    <Button type="button" variant="outline" className="sm:col-span-1" onClick={() => handleRemoveEnv(env.id)}>Remove</Button>
                  </div>
                ))}
                <div className="sm:col-span-6">
                  <Button type="button" variant="outline" onClick={handleAddEnv} disabled={envVars.length >= 3}>Add variable</Button>
                </div>
              </div>
            </section>
          </div>

          <div className="flex justify-end gap-2 border-t pt-3">
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate}>Create project</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}


