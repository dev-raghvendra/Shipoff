"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { toast } from "sonner"
import { useFrameworks } from "@/hooks/use-project"
import { useGithubRepos } from "@/hooks/use-github-repos"
import { githubService } from "@/services/github.service"
import projectService from "@/services/projects.service"
import { ProjectInfoStep } from "./components/project-info-step"
import { FrameworkStep } from "./components/framework-step"
import { RepositoryStep } from "./components/repository-step"
import { DomainStep } from "./components/domain-step"
import { EnvironmentStep, type EnvVar } from "./components/environment-step"
import { WizardProgress, WizardActions } from "./components/wizard-navigation"

const WIZARD_STEPS = [
  { key: "info", label: "Info" },
  { key: "framework", label: "Framework" },
  { key: "repository", label: "Repository" },
  { key: "domain", label: "Domain" },
  { key: "env", label: "Env Vars" },
]

export default function NewProjectWizardPage() {
  // Hooks
  const { data: frameworks, isLoading: isLoadingFrameworks } = useFrameworks({ fetchNow: true })
  const { data: repos, isLoading: isLoadingRepos, isFetchingNextPage, hasNextPage, fetchNextPage } = useGithubRepos({ enabled: true })
  
  // Refs
  const repoContainerRef = useRef<HTMLDivElement>(null)
  
  // Wizard state
  const [step, setStep] = useState(0)
  const [valid, setValid] = useState({ 
    info: false, 
    framework: false, 
    repository: false, 
    domain: false, 
    env: true 
  })
  const [createInProgress, setCreateInProgress] = useState(false)
  const [invalidAttempt, setInvalidAttempt] = useState<{ step: number } | null>(null)

  // Project Info state
  const [name, setName] = useState("my-paas-app")
  const [description, setDescription] = useState("Web app for managing deployments and environments.")

  // Framework state
  const [framework, setFramework] = useState<string | null>(null)
  const [buildCommand, setBuildCommand] = useState("")
  const [prodCommand, setProdCommand] = useState("")
  const [outDir, setOutDir] = useState("")

  // Repository state
  const [checkingGithub, setCheckingGithub] = useState(true)
  const [githubInstalled, setGithubInstalled] = useState(false)
  const [selectedRepo, setSelectedRepo] = useState<typeof repos[0] | null>(null)
  const [branch, setBranch] = useState("main")
  const [rootDir, setRootDir] = useState("/")

  // Domain state
  const [domainPrefix, setDomainPrefix] = useState("my-paas-app")
  const [domainAvailable, setDomainAvailable] = useState<boolean | null>(null)

  // Environment variables state
  const [envVars, setEnvVars] = useState<EnvVar[]>([])

  // Validation logic
  const infoValid = useMemo(() => name.trim().length > 0, [name])
  const frameworkValid = useMemo(() => 
    !!(framework && buildCommand.trim() && prodCommand.trim() && outDir.trim()), 
    [framework, buildCommand, prodCommand, outDir]
  )
  const repositoryValid = useMemo(() => Boolean(selectedRepo), [selectedRepo])
  const domainValid = useMemo(() => 
    domainPrefix.trim().length > 0 && domainAvailable === true, 
    [domainPrefix, domainAvailable]
  )
  const envValid = useMemo(() => {
    // Check if selected framework is dynamic
    const selectedFramework = frameworks.find(f => f.frameworkId === framework)
    const isDynamic = selectedFramework?.applicationType === "DYNAMIC"
    
    // For dynamic projects, PORT environment variable is required
    if (isDynamic) {
      const hasPort = envVars.some(v => v.name.trim().toUpperCase() === "PORT" && v.value.trim().length > 0)
      if (!hasPort) return false
    }
    
    // If there are env vars, validate them
    if (envVars.length > 0) {
      const allKeys = envVars.every(v => v.name.trim().length > 0)
      const allValues = envVars.every(v => v.value.trim().length > 0)
      const unique = new Set(envVars.map(v => v.name.trim())).size === envVars.length
      return allKeys && allValues && unique
    }
    
    return true
  }, [envVars, framework, frameworks])

  // Sync validation state
  useEffect(() => setValid(v => ({ ...v, info: infoValid })), [infoValid])
  useEffect(() => setValid(v => ({ ...v, framework: frameworkValid })), [frameworkValid])
  useEffect(() => setValid(v => ({ ...v, repository: repositoryValid })), [repositoryValid])
  useEffect(() => setValid(v => ({ ...v, domain: domainValid })), [domainValid])
  useEffect(() => setValid(v => ({ ...v, env: envValid })), [envValid])

  // Show validation error toast
  useEffect(() => {
    if (!invalidAttempt) return
    
    // Only show error if trying to move forward
    if (invalidAttempt.step > step) {
      // Find the first incomplete step between current and target
      const firstIncompleteStep = WIZARD_STEPS.findIndex((s, idx) => {
        if (idx >= step && idx < invalidAttempt.step) {
          const key = s.key as keyof typeof valid
          return !valid[key]
        }
        return false
      })
      
      if (firstIncompleteStep >= 0) {
        toast.error(
          `Please complete the "${WIZARD_STEPS[firstIncompleteStep].label}" step before proceeding to "${WIZARD_STEPS[invalidAttempt.step].label}".`
        )
      }
    }
    
    // Clear the invalid attempt after showing the toast
    setInvalidAttempt(null)
  }, [invalidAttempt, step, valid])

  // Check GitHub installation
  useEffect(() => {
    const checkGithubInstallation = async () => {
      try {
        setCheckingGithub(true)
        await githubService.getGithubInstallation()
        setGithubInstalled(true)
      } catch (error: any) {
        if (error.code !== 404) {
          toast.error(error.message || "Failed to verify GitHub installation.")
        }
        setGithubInstalled(false)
      } finally {
        setCheckingGithub(false)
      }
    }
    checkGithubInstallation()
  }, [])

  // Update branch when repo is selected
  useEffect(() => {
    if (selectedRepo) {
      // Set to default branch or first available branch
      if (selectedRepo.githubRepoDefaultBranch) {
        setBranch(selectedRepo.githubRepoDefaultBranch)
      } else if (selectedRepo.branches.length > 0) {
        setBranch(selectedRepo.branches[0])
      }
    }
  }, [selectedRepo])

  // Handlers
  const applyFrameworkPreset = (frameworkId: string) => {
    setFramework(frameworkId)
    const selected = frameworks.find(f => f.frameworkId === frameworkId)
    if (selected) {
      setBuildCommand(selected.defaultBuildCommand)
      setProdCommand(selected.defaultProdCommand)
      setOutDir(selected.defaultOutDir)
    }
  }

  const addEnvVar = () => {
    setEnvVars(v => [...v, { id: Date.now().toString(), name: "", value: "" }])
  }

  const updateEnvVar = (id: string, field: "name" | "value", val: string) => {
    setEnvVars(v => v.map(e => e.id === id ? { ...e, [field]: val } : e))
  }

  const removeEnvVar = (id: string) => {
    setEnvVars(v => v.filter(e => e.id !== id))
  }

  const handleCreate = async () => {
    if (createInProgress) return
    if (!Object.values(valid).every(Boolean)) {
      toast.error("Please complete all steps before creating the project.")
      return
    }

    try {
      setCreateInProgress(true)
      const res = await projectService.createProject({
        name,
        description,
        frameworkId: framework!,
        buildCommand,
        prodCommand,
        outDir,
        githubRepoId: selectedRepo!.githubRepoId,
        branch,
        rootDir,
        domain: `${domainPrefix}on.shipoff.in`,
        environmentVars: envVars.map(ev => ({ name: ev.name, value: ev.value })),
        githubRepoFullName: selectedRepo!.githubRepoFullName,
        githubRepoURI: selectedRepo!.githubRepoURI
      })
      window.location.href = `/dashboard/projects/${res.res.projectId}/overview`
    } catch (error: any) {
      setCreateInProgress(false)
      toast.error(error.message || "Failed to create project.")
    }
  }

  const handleStepChange = (newStep: number) => setStep(newStep)
  const handleBack = () => setStep(s => Math.max(0, s - 1))
  const handleNext = () => setStep(s => Math.min(WIZARD_STEPS.length - 1, s + 1))
  const handleInvalidStep = (targetStep: number) => setInvalidAttempt({ step: targetStep })

  return (
    <main className="mx-auto max-w-5xl px-4 py-6 space-y-6">
      {/* Header */}
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Create project</h1>
        <p className="text-sm text-muted-foreground">
          Configure your project before the first deployment
        </p>
      </header>

      {/* Wizard Progress Bar (Top) */}
      <WizardProgress
        steps={WIZARD_STEPS}
        currentStep={step}
        valid={valid}
        onStepChange={handleStepChange}
        onInvalidStep={handleInvalidStep}
      />

      {/* Step Content */}
      <section className="space-y-6">
        {step === 0 && (
          <ProjectInfoStep
            name={name}
            description={description}
            onNameChange={setName}
            onDescriptionChange={setDescription}
          />
        )}

        {step === 1 && (
          <FrameworkStep
            frameworks={frameworks}
            isLoadingFrameworks={isLoadingFrameworks}
            framework={framework}
            buildCommand={buildCommand}
            prodCommand={prodCommand}
            outDir={outDir}
            onFrameworkChange={applyFrameworkPreset}
            onBuildCommandChange={setBuildCommand}
            onProdCommandChange={setProdCommand}
            onOutDirChange={setOutDir}
        />
        )}

        {step === 2 && (
          <RepositoryStep
            checkingGithub={checkingGithub}
            githubInstalled={githubInstalled}
            isLoadingRepos={isLoadingRepos}
            isFetchingNextPage={isFetchingNextPage}
            hasNextPage={hasNextPage}
            availableRepos={repos}
            selectedRepo={selectedRepo}
            branch={branch}
            rootDir={rootDir}
            repoContainerRef={repoContainerRef}
            onSelectRepo={setSelectedRepo}
            onBranchChange={setBranch}
            onRootDirChange={setRootDir}
            onLoadMore={() => fetchNextPage()}
          />
        )}

        {step === 3 && (
          <DomainStep
            domainPrefix={domainPrefix}
            onDomainPrefixChange={setDomainPrefix}
            onAvailabilityChange={setDomainAvailable}
          />
        )}

        {step === 4 && (
          <EnvironmentStep
            envVars={envVars}
            onAddEnvVar={addEnvVar}
            onUpdateEnvVar={updateEnvVar}
            onRemoveEnvVar={removeEnvVar}
            isDynamic={frameworks.find(f => f.frameworkId === framework)?.applicationType === "DYNAMIC"}
          />
        )}
      </section>

      {/* Wizard Actions (Bottom) */}
      <WizardActions
        steps={WIZARD_STEPS}
        currentStep={step}
        valid={valid}
        isCreating={createInProgress}
        onBack={handleBack}
        onNext={handleNext}
        onCreate={handleCreate}
      />
    </main>
  )
}


