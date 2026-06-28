import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { InfoIcon, AlertCircle, UploadIcon } from "lucide-react"
import { toast } from "sonner"
import { useMemo, useState, useRef, useCallback } from "react"

export type EnvVar = { id: string; name: string; value: string }

interface EnvironmentStepProps {
  envVars: EnvVar[]
  onAddEnvVar: (preset?: { name: string; value: string }) => void
  onUpdateEnvVar: (id: string, field: "name" | "value", value: string) => void
  onRemoveEnvVar: (id: string) => void
  isDynamic?: boolean
}

function parseEnvFile(content: string): Array<{ name: string; value: string }> {
  return content
    .split("\n")
    .map(line => line.trim())
    .filter(line => line && !line.startsWith("#"))
    .reduce<Array<{ name: string; value: string }>>((acc, line) => {
      const eqIdx = line.indexOf("=")
      if (eqIdx <= 0) return acc
      const name = line.slice(0, eqIdx).trim()
      const value = line.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, "")
      if (name) acc.push({ name, value })
      return acc
    }, [])
}

export function EnvironmentStep({
  envVars,
  onAddEnvVar,
  onUpdateEnvVar,
  onRemoveEnvVar,
  isDynamic = false,
}: EnvironmentStepProps) {
  const [isDraggingOver, setIsDraggingOver] = useState(false)
  const [envFileLoaded, setEnvFileLoaded] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const duplicateKeys = useMemo(() => {
    const keyCounts = new Map<string, number>()
    const duplicates = new Set<string>()
    envVars.forEach(env => {
      const k = env.name.trim().toUpperCase()
      if (k) keyCounts.set(k, (keyCounts.get(k) || 0) + 1)
    })
    keyCounts.forEach((count, key) => { if (count > 1) duplicates.add(key) })
    return duplicates
  }, [envVars])

  const processFile = useCallback((file: File) => {
    const isEnvFile = file.name === ".env" || /^\.env(\..+)?$/.test(file.name)
    if (!isEnvFile && file.type !== "text/plain") {
      toast.error("Please drop a .env file.")
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      const parsed = parseEnvFile(content)

      if (parsed.length === 0) {
        toast.error("No valid KEY=VALUE pairs found in the file.")
        return
      }

      const existingKeys = new Set(envVars.map(v => v.name.trim().toUpperCase()))
      const fresh = parsed.filter(v => !existingKeys.has(v.name.trim().toUpperCase()))

      fresh.forEach(v => onAddEnvVar(v))

      setEnvFileLoaded(true)
      toast.success(`Imported ${fresh.length} variable${fresh.length !== 1 ? "s" : ""} from ${file.name}`)
    }
    reader.readAsText(file)
  }, [envVars, onAddEnvVar])

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDraggingOver(false)
    const file = e.dataTransfer.files[0]
    if (file) processFile(file)
  }, [processFile])

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) processFile(file)
    e.target.value = ""
  }

  const handleRemove = (id: string, key: string) => {
    if (isDynamic && key.trim().toUpperCase() === "PORT") {
      toast.error("Cannot remove PORT environment variable for dynamic projects")
      return
    }
    onRemoveEnvVar(id)
  }

  return (
    <div className="space-y-4">
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

      {!envFileLoaded && (
        <>
          <input
            ref={fileInputRef}
            type="file"
            accept=".env,.env.*,text/plain"
            className="hidden"
            onChange={handleFileInput}
          />
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDraggingOver(true) }}
            onDragLeave={() => setIsDraggingOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={[
              "flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-6 py-8 text-center cursor-pointer transition-colors",
              isDraggingOver
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/25 hover:border-muted-foreground/50 hover:bg-muted/30",
            ].join(" ")}
          >
            <UploadIcon className={`h-6 w-6 ${isDraggingOver ? "text-primary" : "text-muted-foreground"}`} />
            <div>
              <p className="text-sm font-medium">
                {isDraggingOver ? "Release to import" : "Drop your .env file here"}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">or click to browse — parses KEY=VALUE pairs</p>
            </div>
          </div>
        </>
      )}

      <div className="space-y-2">
        {envVars.length === 0 ? (
          <div className="text-sm text-muted-foreground text-center py-8">
            <p>No environment variables yet.</p>
            <p className="text-xs mt-1">
              {isDynamic
                ? "Add PORT and other variables for your application."
                : "Add variables to configure your application (optional)."}
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
                      className={`font-mono text-xs ${isDuplicate ? "ring-1 ring-destructive focus-visible:ring-destructive" : ""}`}
                      placeholder="KEY"
                      value={env.name}
                      onChange={(e) => onUpdateEnvVar(env.id, "name", e.target.value)}
                    />
                    {isDuplicate && <p className="text-xs text-destructive">Duplicate key</p>}
                  </div>
                  <Input
                    className="sm:col-span-3 font-mono text-xs"
                    placeholder="VALUE"
                    value={env.value}
                    onChange={(e) => onUpdateEnvVar(env.id, "value", e.target.value)}
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

        <Button type="button" variant="outline" onClick={() => onAddEnvVar()}>
          Add variable
        </Button>
      </div>
    </div>
  )
}