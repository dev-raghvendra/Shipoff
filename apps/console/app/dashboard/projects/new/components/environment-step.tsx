import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { InfoIcon, AlertCircle } from "lucide-react"
import { toast } from "sonner"
import { useMemo } from "react"

export type EnvVar = { id: string; name: string; value: string }

interface EnvironmentStepProps {
  envVars: EnvVar[]
  onAddEnvVar: () => void
  onUpdateEnvVar: (id: string, field: "name" | "value", value: string) => void
  onRemoveEnvVar: (id: string) => void
  isDynamic?: boolean
}

export function EnvironmentStep({
  envVars,
  onAddEnvVar,
  onUpdateEnvVar,
  onRemoveEnvVar,
  isDynamic = false,
}: EnvironmentStepProps) {
  const hasPortVar = envVars.some(v => v.name.trim().toUpperCase() === "PORT")
  
  // Detect duplicate keys
  const duplicateKeys = useMemo(() => {
    const keyCounts = new Map<string, number>()
    const duplicates = new Set<string>()

    envVars.forEach(env => {
      const normalizedKey = env.name.trim().toUpperCase()
      if (normalizedKey) {
        keyCounts.set(normalizedKey, (keyCounts.get(normalizedKey) || 0) + 1)
      }
    })

    keyCounts.forEach((count, key) => {
      if (count > 1) {
        duplicates.add(key)
      }
    })

    return duplicates
  }, [envVars])

  const handleRemove = (id: string, key: string) => {
    const normalizedKey = key.trim().toUpperCase()
    
    // Prevent deletion of PORT for dynamic projects
    if (isDynamic && normalizedKey === "PORT") {
      toast.error("Cannot remove PORT environment variable for dynamic projects")
      return
    }
    
    onRemoveEnvVar(id)
  }
  
  return (
    <div className="space-y-4">
      {/* Info Alert for Dynamic Projects */}
      {isDynamic && (
        <Alert>
          <InfoIcon className="h-4 w-4" />
          <AlertDescription>
            <p className="font-medium text-sm">PORT environment variable required</p>
            <p className="text-xs mt-1">
              Dynamic projects must specify a PORT environment variable to define which port your application listens on. This variable cannot be removed.
            </p>
          </AlertDescription>
        </Alert>
      )}

      {/* Alert for duplicate keys */}
      {duplicateKeys.size > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <p className="font-medium text-sm">Duplicate environment variable keys detected</p>
            <p className="text-xs mt-1">
              Each environment variable key must be unique. Please rename or remove duplicate keys.
            </p>
          </AlertDescription>
        </Alert>
      )}
      
      <div className="space-y-2">
        {envVars.length === 0 ? (
          <div className="text-sm text-muted-foreground text-center py-8">
            <p>No environment variables yet.</p>
            <p className="text-xs mt-1">
              {isDynamic ? "Add PORT and other variables for your application." : "Add variables to configure your application (optional)."}
            </p>
          </div>
        ) : (
        envVars.map((env) => {
          const normalizedKey = env.name.trim().toUpperCase()
          const isDuplicate = duplicateKeys.has(normalizedKey)
          const isPortVar = isDynamic && normalizedKey === "PORT"
          
          return (
            <div key={env.id} className="space-y-1">
              <div className="grid grid-cols-1 sm:grid-cols-6 gap-2">
                <div className="sm:col-span-2 space-y-1">
                  <Input 
                    className={`font-mono text-xs ${isDuplicate ? 'ring-1 ring-destructive focus-visible:ring-destructive' : ''}`}
                    placeholder="KEY" 
                    value={env.name} 
                  onChange={(e) => onUpdateEnvVar(env.id, 'name', e.target.value)} 
                  />
                  {isDuplicate && (
                    <p className="text-xs text-destructive">Duplicate key</p>
                  )}
                </div>
                <Input 
                  className="sm:col-span-3 font-mono text-xs" 
                  placeholder="VALUE" 
                  value={env.value} 
                  onChange={(e) => onUpdateEnvVar(env.id, 'value', e.target.value)} 
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  className="sm:col-span-1 disabled:opacity-50 disabled:cursor-not-allowed" 
                  onClick={() => handleRemove(env.id, env.name)}
                  disabled={isPortVar}
                  title={isPortVar ? "PORT cannot be removed for dynamic projects" : "Remove variable"}
                >
                  Remove
                </Button>
              </div>
            </div>
          )
        })
        )}
        <Button type="button" variant="outline" onClick={onAddEnvVar}>
          Add variable
        </Button>
      </div>
    </div>
  )
}

