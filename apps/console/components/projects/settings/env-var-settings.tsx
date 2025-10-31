"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Trash2, Lock, AlertCircle, Info, Loader2 } from "lucide-react"
import projectService from "@/services/projects.service"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface EnvVariable {
  id:string
  name: string
  value: string
}

interface EnvVariablesSettingsProps {
  projectId: string,
  initialEnvVars?: Omit<EnvVariable,"id">[],
  isLoading?:boolean,
  applicationType?: "STATIC" | "DYNAMIC",
  refetchProject: () => Promise<any>
}

export function EnvVariablesSettings({ projectId, initialEnvVars, isLoading, applicationType, refetchProject }: EnvVariablesSettingsProps) {
  const [envVars, setEnvVars] = useState<EnvVariable[]>([])
  const [originalEnvVars, setOriginalEnvVars] = useState<EnvVariable[]>([])
  const [duplicateKeys, setDuplicateKeys] = useState<Set<string>>(new Set())

  const [isEdited, setIsEdited] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const isDynamic = applicationType === "DYNAMIC"

  // Sync state when initial props change
  useEffect(() => {
    if (initialEnvVars !== undefined) {
      const mappedVars = initialEnvVars.map(ev => ({ 
        ...ev, 
        id: Date.now().toString() + Math.random().toString(36).substring(2, 15)
      }))
      setEnvVars(mappedVars)
      setOriginalEnvVars(mappedVars.map(ev => ({ ...ev })))
    }
  }, [initialEnvVars])




  const handleAddAnother = () => {
    const newEnv: EnvVariable = {
      name: "ENV_KEY",
      id: Date.now().toString(),
      value: "ENV_VALUE",
    }
    setEnvVars([...envVars, newEnv])
  }

  const handleDeleteEnv = (key: string) => {
    // Prevent deletion of PORT for dynamic projects
    if (isDynamic && key.trim().toUpperCase() === "PORT") {
      toast.error("Cannot delete PORT environment variable for dynamic projects")
      return
    }
    setEnvVars(envVars.filter(env=>env.name!==key));
  }


  const handleSave = async() => {
    if(isSaving || !isEdited) return;

    // Check for duplicate keys before saving
    if (duplicateKeys.size > 0) {
      toast.error("Cannot save: Duplicate environment variable keys detected")
      return
    }

    // Check for PORT requirement in dynamic projects
    if (isDynamic && !envVars.some(env => env.name.trim().toUpperCase() === "PORT")) {
      toast.error("Cannot save: PORT environment variable is required for dynamic projects")
      return
    }

    setIsSaving(true);
    const envToDelete = originalEnvVars.filter(oEnv=>!envVars.find(env=>env.name===oEnv.name));
    const envToCreateOrUpdate = envVars.filter(env=>!originalEnvVars.find(oEnv=>oEnv.name===env.name && oEnv.value===env.value));
    try {
    await Promise.all([
      envToCreateOrUpdate.length ? projectService.createOrUpdateEnvVars({projectId,envs:envToCreateOrUpdate.map(env=>({name:env.name,value:env.value}))}) : Promise.resolve(),
      envToDelete.length ? projectService.deleteEnvVars({projectId,envVarKeys:envToDelete.map(env=>env.name)}) : Promise.resolve()
    ])
    setOriginalEnvVars(envVars.map(ev=>({ ...ev })));
    await refetchProject()
    setIsEdited(false);
    toast.success("Environment variables saved successfully!");
    } catch (error : any) {
      toast.error(error.message || "Failed to save environment variables, please try again later.");
    } finally {
      setIsSaving(false);
    }
  }

  const handleOnChangeEnvContent = (e: React.ChangeEvent<HTMLInputElement>,key:string,type:"key"|"value") => {
      const value = e.target.value;
      const env = envVars.find(env => env.name === key)!;
      if(type==="key") env.name = value;
      else env.value = value;
      setEnvVars([...envVars]);
  }

  // Check for duplicate keys
  useEffect(() => {
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

    setDuplicateKeys(duplicates)
  }, [envVars])



  useEffect(()=>{
    let isEditedLocal = false;
    if(envVars.length !== originalEnvVars.length) isEditedLocal = true;
    else {
      envVars.forEach((env)=>{
        const originalEnv = originalEnvVars.find(oEnv=>oEnv.name===env.name);
        if(!originalEnv || originalEnv.value !== env.value) isEditedLocal = true;
      })
    }
    setIsEdited(isEditedLocal);
  },[envVars])

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-muted p-2 mt-0.5">
            <Lock className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">
              Environment variables are encrypted and injected at runtime.
              Perfect for API keys, secrets, and configuration.
            </p>
          </div>
        </div>
        {!isLoading && (
          <Button variant="outline" size="sm" onClick={handleAddAnother} className="shrink-0">
            <Plus className="mr-2 h-4 w-4" />
            Add
          </Button>
        )}
      </div>

      {/* Alert for duplicate keys */}
      {!isLoading && duplicateKeys.size > 0 && (
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

      {/* Info alert for dynamic projects */}
      {!isLoading && isDynamic && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            <p className="font-medium text-sm">PORT environment variable required</p>
            <p className="text-xs mt-1">
              Dynamic projects must have a PORT environment variable. This variable cannot be deleted.
            </p>
          </AlertDescription>
        </Alert>
      )}

        {isLoading ? (
          <div className="space-y-3 border rounded-lg p-4">
            <div className="grid grid-cols-[1fr_1fr_auto] gap-4">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-8" />
            </div>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="grid grid-cols-[1fr_1fr_auto] gap-3 items-center">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-10" />
              </div>
            ))}
          </div>
        ) : envVars.length === 0 ? (
          <div className="border rounded-lg p-8 text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
              <Plus className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="font-medium mb-1">No environment variables</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Add your first environment variable to get started
            </p>
            <Button variant="outline" size="sm" onClick={handleAddAnother}>
              <Plus className="mr-2 h-4 w-4" />
              Add Variable
            </Button>
          </div>
        ) : (
          <div className="border rounded-lg">
            {/* Column headers */}
            <div className="grid grid-cols-[1fr_1fr_auto] gap-4 px-4 py-3 border-b bg-muted/30">
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Key</div>
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Value</div>
              <div className="w-10"></div>
            </div>

            {/* Environment variables rows */}
            <div className="divide-y">
              {envVars.map((env, index) => {
                const normalizedKey = env.name.trim().toUpperCase()
                const isDuplicate = duplicateKeys.has(normalizedKey)
                const isPortVar = isDynamic && normalizedKey === "PORT"
                
                return (
                  <div key={env.id} className={`grid grid-cols-[1fr_1fr_auto] gap-3 items-center px-4 py-3 hover:bg-muted/30 transition-colors ${index % 2 === 0 ? 'bg-muted/10' : ''}`}>
                    <div className="space-y-1">
                      <Input
                        defaultValue={env.name}
                        onChange={(e) => handleOnChangeEnvContent(e, env.name, "key")}
                        placeholder="API_KEY"
                        type="text"
                        className={`font-mono text-sm h-9 border-0 bg-transparent focus-visible:ring-1 ${isDuplicate ? 'ring-1 ring-destructive focus-visible:ring-destructive' : ''}`}
                      />
                      {isDuplicate && (
                        <p className="text-xs text-destructive">Duplicate key</p>
                      )}
                    </div>
                    <Input
                      defaultValue={env.value}
                      onChange={(e) => handleOnChangeEnvContent(e, env.name, "value")}
                      placeholder="your_secret_value"
                      type="text"
                      className="font-mono text-sm h-9 border-0 bg-transparent focus-visible:ring-1"
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDeleteEnv(env.name)}
                      disabled={isPortVar}
                      className="h-9 w-9 text-muted-foreground hover:text-destructive hover:bg-destructive/10 disabled:opacity-50 disabled:cursor-not-allowed"
                      title={isPortVar ? "PORT cannot be deleted for dynamic projects" : "Delete variable"}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )
              })}
            </div>
          </div>
        )}

      {isEdited && !isLoading && (
        <div className="flex items-center gap-3">
         <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
              </>
            ) : "Save Changes"}
          </Button>
          <span className="text-sm text-muted-foreground">
            {envVars.length} {envVars.length === 1 ? 'variable' : 'variables'}
          </span>
          {duplicateKeys.size > 0 && (
            <span className="text-sm text-destructive">
              Fix duplicate keys to save
            </span>
          )}
        </div>
      )}
    </div>
  )
}


