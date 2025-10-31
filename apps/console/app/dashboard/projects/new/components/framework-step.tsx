import { Input } from "@/components/ui/input"
import { Combobox } from "@/components/ui/combobox"
import { Skeleton } from "@/components/ui/skeleton"
import { FrameworkIcon } from "@/components/ui/framework-icon"

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
  return (
    <div className="space-y-3">
      <div>
        <label className="text-xs text-muted-foreground">
          Framework <span className="text-red-500">*</span>
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



