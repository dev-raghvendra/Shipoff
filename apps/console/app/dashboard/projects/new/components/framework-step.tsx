import { Input } from "@/components/ui/input"
import { Combobox } from "@/components/ui/combobox"
import { Skeleton } from "@/components/ui/skeleton"
import { FrameworkIcon } from "@/components/ui/framework-icon"
import { useSession } from "@/context/session.context"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"

interface Framework {
  frameworkId: string
  displayName: string
  keywordName: string
  icon: string
  defaultBuildCommand: string
  defaultProdCommand: string
  defaultOutDir: string
}

interface FrameworkStepProps {
  frameworks: Framework[]
  isLoadingFrameworks: boolean
  framework: string | null
  buildCommand: string
  prodCommand: string
  outDir: string
  onFrameworkChange: (frameworkId: string) => void
  onBuildCommandChange: (value: string) => void
  onProdCommandChange: (value: string) => void
  onOutDirChange: (value: string) => void
}

export function FrameworkStep({
  frameworks,
  isLoadingFrameworks,
  framework,
  buildCommand,
  prodCommand,
  outDir,
  onFrameworkChange,
  onBuildCommandChange,
  onProdCommandChange,
  onOutDirChange,
}: FrameworkStepProps) {

  const {data} = useSession()
  const isFreeTier = data?.user?.subscription?.type === "FREE"

  return (
    <div className="space-y-3">
      {isFreeTier && (
        <Alert variant="default" className="border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/30">
          <AlertTriangle className="text-amber-600 dark:text-amber-400" />
          <AlertTitle className="text-amber-900 dark:text-amber-100">Free Tier Limits</AlertTitle>
          <AlertDescription className="text-amber-800 dark:text-amber-200">
            For heavy projects on the free tier, build your artifacts locally and commit them to avoid memory limit errors during build or runtime. Free tier projects get 512MB memory and 0.1 CPU per deployment.
          </AlertDescription>
        </Alert>
      )}
      <div> 
        <label className="text-xs text-muted-foreground">
          Framework
        </label>
        {isLoadingFrameworks && <Skeleton className="mt-1 h-10 w-44" />}
        <Combobox
          options={frameworks.map(fw => ({
            label: fw.displayName,
            value: fw.frameworkId,
            icon: <FrameworkIcon src={fw.keywordName} alt={fw.displayName} className="h-4 w-4" />
          }))}
          value={framework || undefined}
          onValueChange={onFrameworkChange}
          placeholder="Select framework..."
          searchPlaceholder="Search frameworks..."
          emptyText="No framework found."
          className="mt-1 w-44 ml-2"
          isLoading={isLoadingFrameworks}
        />
        {!framework && (
          <p className="text-xs text-muted-foreground mt-1">
            Please select a framework to continue
          </p>
        )}
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="text-xs text-muted-foreground">
            Build command <span className="text-red-500">*</span>
          </label>
          {isLoadingFrameworks ? (
            <Skeleton className="mt-1 h-8 w-full" />
          ) : (
            <Input 
              className="mt-1 font-mono text-xs" 
              value={buildCommand} 
              onChange={(e) => onBuildCommandChange(e.target.value)}
              placeholder="npm run build"
            />
          )}
        </div>
        <div>
          <label className="text-xs text-muted-foreground">
            Production command <span className="text-red-500">*</span>
          </label>
          {isLoadingFrameworks ? (
            <Skeleton className="mt-1 h-8 w-full" />
          ) : (
            <Input 
              className="mt-1 font-mono text-xs" 
              value={prodCommand} 
              onChange={(e) => onProdCommandChange(e.target.value)}
              placeholder="npm start"
            />
          )}
        </div>
        <div>
          <label className="text-xs text-muted-foreground">
            Output dir <span className="text-red-500">*</span>
          </label>
          {isLoadingFrameworks ? (
            <Skeleton className="mt-1 h-8 w-full" />
          ) : (
            <Input 
              className="mt-1 font-mono text-xs" 
              value={outDir} 
              onChange={(e) => onOutDirChange(e.target.value)}
              placeholder=".next"
            />
          )}
        </div>
      </div>
    </div>
  )
}



