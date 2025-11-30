import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { InfoIcon, AlertCircle, Clipboard } from "lucide-react"
import { toast } from "sonner"
import { useMemo, useState } from "react"
import { parseEnvVarsFromText } from "@/utils/env-var-parser"

export type EnvVar = { id: string; name: string; value: string }

interface EnvironmentStepProps {
  envVars: EnvVar[]
  onAddEnvVar: () => void
  onAddEnvVarsBatch?: (vars: Array<{ name: string; value: string }>) => void
  onUpdateEnvVar: (id: string, field: "name" | "value", value: string) => void
  onRemoveEnvVar: (id: string) => void
  isDynamic?: boolean
}

export function EnvironmentStep({
  envVars,
  onAddEnvVar,
  onAddEnvVarsBatch,
  onUpdateEnvVar,
  onRemoveEnvVar,
  isDynamic = false,
}: EnvironmentStepProps) {
  const [pasteDialogOpen, setPasteDialogOpen] = useState(false)
  const [pasteText, setPasteText] = useState("")
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

  const handlePasteEnvVars = async () => {
    try {
      // Try to read from clipboard if pasteText is empty
      let textToParse = pasteText
      if (!textToParse.trim()) {
        textToParse = await navigator.clipboard.readText()
      }

      if (!textToParse.trim()) {
        toast.error("No text found in clipboard")
        return
      }

      const parsedVars = parseEnvVarsFromText(textToParse)
      
      if (parsedVars.length === 0) {
        toast.error("No valid environment variables found. Please use KEY=value format.")
        return
      }

      // Use batch add if available, otherwise add one by one
      if (onAddEnvVarsBatch) {
        onAddEnvVarsBatch(parsedVars)
        toast.success(`Added ${parsedVars.length} environment variable${parsedVars.length > 1 ? 's' : ''}`)
      } else {
        // Fallback: add them one by one (shouldn't happen if parent provides batch function)
        parsedVars.forEach((env) => {
          onAddEnvVar()
          // Note: This fallback won't work perfectly as we don't know the new ID
          // But it's better than nothing
        })
        toast.success(`Added ${parsedVars.length} environment variable${parsedVars.length > 1 ? 's' : ''}. Please fill in the values.`)
      }

      setPasteText("")
      setPasteDialogOpen(false)
    } catch (error: any) {
      toast.error(error.message || "Failed to parse environment variables from clipboard")
    }
  }

  const handlePasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText()
      setPasteText(text)
    } catch (error: any) {
      toast.error("Failed to read from clipboard. Please paste manually.")
    }
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
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={onAddEnvVar}>
            Add variable
          </Button>
          <Dialog open={pasteDialogOpen} onOpenChange={setPasteDialogOpen}>
            <DialogTrigger asChild>
              <Button type="button" variant="outline" onClick={handlePasteFromClipboard}>
                <Clipboard className="mr-2 h-4 w-4" />
                Paste from clipboard
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Paste Environment Variables</DialogTitle>
                <DialogDescription>
                  Paste your environment variables in KEY=value format (one per line). 
                  You can paste from a .env file or any text containing environment variables.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <Textarea
                  placeholder={`API_KEY=your_api_key
DATABASE_URL=postgres://...
SECRET_KEY=your_secret
PORT=3000`}
                  value={pasteText}
                  onChange={(e) => setPasteText(e.target.value)}
                  className="font-mono text-sm min-h-[200px]"
                  onPaste={async (e) => {
                    // Auto-populate on paste
                    const pastedText = e.clipboardData.getData('text')
                    if (pastedText) {
                      setPasteText(pastedText)
                    }
                  }}
                />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => {
                  setPasteText("")
                  setPasteDialogOpen(false)
                }}>
                  Cancel
                </Button>
                <Button onClick={handlePasteEnvVars} disabled={!pasteText.trim()}>
                  Import Variables
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  )
}

