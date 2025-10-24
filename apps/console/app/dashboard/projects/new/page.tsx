"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Combobox, ComboboxOption } from "@/components/ui/combobox"
import { Loader2, Github, Lock, Globe } from "lucide-react"
import { toast } from "sonner"

export default function NewProjectWizardPage() {
  const [step, setStep] = useState(0)
  const [valid, setValid] = useState({ info: false, framework: false, repository: false, domain: false, env: true })

  // Local create-form state (decoupled from settings components)
  const [name, setName] = useState("my-paas-app")
  const [description, setDescription] = useState("Web app for managing deployments and environments.")

  const [framework, setFramework] = useState<string | null>(null)
  const [buildCommand, setBuildCommand] = useState("next build")
  const [prodCommand, setProdCommand] = useState("next start -p 3000")
  const [outDir, setOutDir] = useState(".next")

  // Repository step state
  const [githubInstalled, setGithubInstalled] = useState(false)
  const [checkingGithub, setCheckingGithub] = useState(true)
  const [invalidAttempt, setInvalidAttempt] = useState<{
    step: number
  } | null>(null)
  const [availableRepos, setAvailableRepos] = useState<Array<{id:string; name:string; url:string; private?: boolean}>>([])
  const [selectedRepo, setSelectedRepo] = useState<{id:string; name:string; url:string; private?: boolean} | null>(null)
  const [branch, setBranch] = useState("main")
  const [rootDir, setRootDir] = useState("/")

  const [domainPrefix, setDomainPrefix] = useState("my-paas-app")

  type EnvVar = { id: string; key: string; value: string }
  const [envVars, setEnvVars] = useState<EnvVar[]>([])

  // Framework options for combobox
  const frameworkOptions: ComboboxOption[] = [
    { value: "nextjs", label: "Next.js" },
    { value: "vite", label: "Vite" },
    { value: "react", label: "React" },
    { value: "vue", label: "Vue" },
    { value: "svelte", label: "Svelte" },
  ]

  // Framework presets
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

  // Env var helpers
  const addEnv = () => setEnvVars(v => [...v, { id: Date.now().toString(), key: "", value: "" }])
  const updateEnv = (id: string, field: "key"|"value", val: string) => setEnvVars(v => v.map(e => e.id === id ? { ...e, [field]: val } : e))
  const removeEnv = (id: string) => setEnvVars(v => v.filter(e => e.id !== id))
  const steps = [
    { key: "info", label: "Info" },
    { key: "framework", label: "Framework" },
    { key: "repository", label: "Repository" },
    { key: "domain", label: "Domain" },
    { key: "env", label: "Env Vars" },
  ]
  const isFirst = step === 0
  const isLast = step === steps.length - 1
  const percent = Math.round(((step + 1) / steps.length) * 100)

  // Per-step validity (derived + synced)
  const infoValid = useMemo(() => name.trim().length > 0, [name])
  const frameworkValid = useMemo(() => !!(buildCommand.trim() && prodCommand.trim() && outDir.trim()), [buildCommand, prodCommand, outDir])
  const repositoryValid = useMemo(() => Boolean(selectedRepo), [selectedRepo])
  const domainValid = useMemo(() => domainPrefix.trim().length > 0, [domainPrefix])
  const envValid = useMemo(() => {
    if (!envVars.length) return true
    const allKeys = envVars.every(v => v.key.trim().length > 0)
    const unique = new Set(envVars.map(v => v.key.trim())).size === envVars.length
    return allKeys && unique
  }, [envVars])

  useEffect(() => setValid(v => ({ ...v, info: infoValid })), [infoValid])
  useEffect(() => setValid(v => ({ ...v, framework: frameworkValid })), [frameworkValid])
  useEffect(() => setValid(v => ({ ...v, repository: repositoryValid })), [repositoryValid])
  useEffect(() => setValid(v => ({ ...v, domain: domainValid })), [domainValid])
  useEffect(() => setValid(v => ({ ...v, env: envValid })), [envValid])
  useEffect(()=>{
    if(!invalidAttempt) return
    toast.error(`Please complete the ${steps[step].label} configuration before moving to ${steps[invalidAttempt?.step || 0].label} configuration`)
  },[invalidAttempt])

  // Github installation and repos fetch (mock-friendly)
  useEffect(() => {
    const run = async () => {
      try {
        setCheckingGithub(true)
        const res = await fetch("/api/github/check-installation")
        const data = await res.json().catch(() => ({}))
        const installed = Boolean(true)
        setGithubInstalled(installed)
        if (installed) {
          try {
            const r = await fetch("/api/github/repos")
            const repos = await r.json().catch(() => [])
            if (Array.isArray(repos) && repos.length) {
              setAvailableRepos(repos)
            } else {
              setAvailableRepos([
                { id: "repo_1", name: "my-paas-app", url: "https://github.com/example/my-paas-app", private: false },
                { id: "repo_2", name: "another-project", url: "https://github.com/example/another-project", private: true },
                { id: "repo_3", name: "web-app", url: "https://github.com/example/web-app", private: false },
              ])
            }
          } catch {
            setAvailableRepos([
              { id: "repo_1", name: "my-paas-app", url: "https://github.com/example/my-paas-app", private: false },
              { id: "repo_2", name: "another-project", url: "https://github.com/example/another-project", private: true },
              { id: "repo_3", name: "web-app", url: "https://github.com/example/web-app", private: false },
            ])
          }
        }
      } catch {
        setGithubInstalled(false)
      } finally {
        setCheckingGithub(false)
      }
    }
    run()
  }, [])

  const handleCreate = async () => {
    console.log("[v0] Create project submitted from wizard page")
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-6 space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Create project</h1>
        <p className="text-sm text-muted-foreground">Configure your project before the first deployment</p>
      </header>

      <nav className="flex items-center gap-2 overflow-x-auto">
        {steps.map((s, idx) => (
          <div key={s.key} className="flex items-center shrink-0">
            <button
              className={`text-xs flex cursor-pointer justify-center items-center gap-2 sm:text-sm ${idx === step ? "text-foreground font-medium" : "text-muted-foreground"}`}
              onClick={() => {
                // Only allow clicking to a step if all previous are valid
                const canGo = idx <= step || (idx > step && Array.from({length: idx}).every((_,i)=>{
                  const key = steps[i].key as keyof typeof valid
                  return valid[key]
                }))
                if (canGo) setStep(idx)
                else setInvalidAttempt({ step: idx}) 
                }}
            >
                <div className={`h-2 w-2 rounded-full ${idx <= step ? "bg-primary" : "bg-muted-foreground/30"}`} />
              {s.label}
            </button>
            {idx < steps.length - 1 && <div className={`mx-2 h-px w-6 ${idx <= step ? "bg-primary" : "bg-muted-foreground/30"}`} />}
          </div>
        ))}
      </nav>

      <section className="space-y-6">
        {step === 0 && (
          <div className="space-y-3">
            <div>
              <label className="text-xs text-muted-foreground">Project name</label>
              <Input className="mt-1" value={name} onChange={(e)=>setName(e.target.value)} />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Description</label>
              <Textarea className="mt-1" rows={3} value={description} onChange={(e)=>setDescription(e.target.value)} />
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-3">
            <div>
              <label className="text-xs text-muted-foreground">Framework</label>
              <Combobox
                options={frameworkOptions}
                value={framework || undefined}
                onValueChange={applyFrameworkPreset}
                placeholder="Select framework..."
                searchPlaceholder="Search frameworks..."
                emptyText="No framework found."
                className="mt-1 w-44 ml-2"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs text-muted-foreground">Build command</label>
                <Input className="mt-1 font-mono text-xs" value={buildCommand} onChange={(e)=>setBuildCommand(e.target.value)} />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Production command</label>
                <Input className="mt-1 font-mono text-xs" value={prodCommand} onChange={(e)=>setProdCommand(e.target.value)} />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Output dir</label>
                <Input className="mt-1 font-mono text-xs" value={outDir} onChange={(e)=>setOutDir(e.target.value)} />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            {checkingGithub ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" /> Checking GitHub connection...
              </div>
            ) : !githubInstalled ? (
              <Alert>
                <AlertDescription>
                  <p className="font-medium mb-2">GitHub account not linked</p>
                  <p className="text-sm mb-3">Link your GitHub account to select a repository for automatic deployments.</p>
                  <Button size="sm" variant="outline" onClick={()=>{ window.location.href = "/api/auth/github" }}>Link GitHub account</Button>
                </AlertDescription>
              </Alert>
            ) : (
              <>
                <div>
                  <label className="text-xs text-muted-foreground">Select repository</label>
                  <div className="mt-2 space-y-2">
                    {availableRepos.map((repo) => (
                      <button
                        key={repo.id}
                        onClick={()=>setSelectedRepo(repo)}
                        className={`w-full text-left p-3 rounded-lg border transition-colors flex items-center justify-between ${selectedRepo?.id===repo.id ? "border-primary bg-primary/5" : "hover:bg-muted"}`}
                      >
                        <div>
                          <p className="font-medium text-sm flex items-center gap-2"><Github size={14} /> {repo.name}</p>
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
                  <div className="sm:col-span-2">
                    <label className="text-xs text-muted-foreground">Root directory</label>
                    <Input className="mt-1 font-mono text-xs" value={rootDir} onChange={(e)=>setRootDir(e.target.value)} />
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {step === 3 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
            <div className="sm:col-span-2">
              <label className="text-xs text-muted-foreground">Domain prefix</label>
              <Input className="mt-1 font-mono text-xs" value={domainPrefix} onChange={(e)=>setDomainPrefix(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))} />
            </div>
            <div className="text-xs text-muted-foreground">
              <div>Preview</div>
              <div className="mt-1 font-mono text-foreground">{domainPrefix}.on.shipoff.in</div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-2">
            {envVars.map((env) => (
              <div key={env.id} className="grid grid-cols-1 sm:grid-cols-6 gap-2">
                <Input className="sm:col-span-2 font-mono text-xs" placeholder="KEY" value={env.key} onChange={(e)=>updateEnv(env.id, 'key', e.target.value)} />
                <Input className="sm:col-span-3 font-mono text-xs" placeholder="VALUE" value={env.value} onChange={(e)=>updateEnv(env.id, 'value', e.target.value)} />
                <Button type="button" variant="outline" className="sm:col-span-1" onClick={()=>removeEnv(env.id)}>Remove</Button>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addEnv}>Add variable</Button>
          </div>
        )}
      </section>

      <footer className="flex justify-between gap-2 border-t pt-3">
        <div className="text-xs text-muted-foreground self-center">Step {step + 1} of {steps.length}</div>
        <div className="flex gap-2">
          {!isFirst && (
            <Button variant="outline" onClick={() => setStep((s) => Math.max(0, s - 1))}>Back</Button>
          )}
          {!isLast && (
            <Button onClick={() => setStep((s) => Math.min(steps.length - 1, s + 1))} disabled={(()=>{ const key=steps[step].key as keyof typeof valid; return !valid[key] })()}>Next</Button>
          )}
          {isLast && (
            <Button onClick={handleCreate} disabled={!Object.values(valid).every(Boolean)}>Create project</Button>
          )}
        </div>
      </footer>
    </main>
  )
}


