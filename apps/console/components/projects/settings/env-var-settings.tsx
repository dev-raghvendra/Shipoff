"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Trash2, Edit2 } from "lucide-react"

interface EnvVariable {
    id: string
  key: string
  value: string
}

interface EnvVariablesSettingsProps {
  projectId: string
  hideActions?: boolean
  onValidityChange?: (isValid: boolean) => void
}

export function EnvVariablesSettings({ projectId, hideActions, onValidityChange }: EnvVariablesSettingsProps) {
  const [envVars, setEnvVars] = useState<EnvVariable[]>([
    { id:Date.now().toString()+Math.random().toString(36).substring(2, 15), key: "serguehguegh", value: "gerogioegjioegjijg4" },
    { id:Date.now().toString()+Math.random().toString(36).substring(2, 15), key: "CLIENT_KEY_", value: "CLIENT" },
  ])
  const [originalEnvVars, setOriginalEnvVars] = useState<EnvVariable[]>([
    { id:Date.now().toString()+Math.random().toString(36).substring(2, 15), key: "serguehguegh", value: "gerogioegjioegjijg4" },
    { id:Date.now().toString()+Math.random().toString(36).substring(2, 15), key: "CLIENT_KEY_", value: "CLIENT" },
  ])

  const [deletionVarsKey, setDeletionVarsKey] = useState<string[]>([])
  const [isEdited, setIsEdited] = useState(false)
  const [isSaving, setIsSaving] = useState(false)




  const handleAddAnother = () => {
    const newEnv: EnvVariable = {
      key: "ENV_KEY",
      id: Date.now().toString(),
      value: "ENV_VALUE",
    }
    setEnvVars([...envVars, newEnv])
  }

  const handleDeleteEnv = (key: string) => {
     setEnvVars(envVars.filter(env=>env.key!==key));
  }


  const handleSave = () => {
    if(isSaving) return;
    setIsSaving(true);
    const envToDelete = originalEnvVars.filter(oEnv=>!envVars.find(env=>env.key===oEnv.key));
    setDeletionVarsKey(envToDelete.map(env=>env.key));
    // Mock API call to save env vars
    // Mock API call to delete env vars
  }

  const handleOnChangeEnvContent = (e: React.ChangeEvent<HTMLInputElement>,key:string,type:"key"|"value") => {
      const value = e.target.value;
      const env = envVars.find(env => env.key === key)!;
      if(type==="key") env.key = value;
      else env.value = value;
      setEnvVars([...envVars]);
  }



  useEffect(()=>{
    if(!envVars.length) return;
    let isEditedLocal = false;
    if(envVars.length !== originalEnvVars.length) isEditedLocal = true;
    else {
      envVars.forEach((env)=>{
        const originalEnv = originalEnvVars.find(oEnv=>oEnv.key===env.key);
        if(!originalEnv || originalEnv.value !== env.value) isEditedLocal = true;
      })
    }
    setIsEdited(isEditedLocal);
  },[envVars])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center justify-between">Environment Variables<Button variant="outline" size="sm" onClick={handleAddAnother}>
          <Plus className="mr-2 h-4 w-4" />
          Add Another
        </Button></CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {/* Column headers */}
          <div className="grid grid-cols-2 gap-4 px-4 py-2 text-sm font-medium text-muted-foreground">
            <div>Key</div>
            <div>Value</div>
          </div>

          {/* Environment variables rows */}
          {envVars.map((env) => (
              <div key={env.id} className="flex gap-4 items-center px-4 py-3 rounded-lg border bg-muted/30">
                <Input
                  defaultValue={env.key}
                  onChange={(e) => handleOnChangeEnvContent(e, env.key, "key")}
                  placeholder="Key"
                  type="text"
                  className="font-mono text-sm"
                />
                <Input
                  defaultValue={env.value}
                  onChange={(e) => handleOnChangeEnvContent(e, env.key, "value")}
                  placeholder="Value"
                  type="text"
                  className="font-mono text-sm"
                />

                <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeleteEnv(env.key)}
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
              </div>
            ) 
            )}
        </div>

        

        <div className="space-y-2 pt-4 border-t">
         
        </div>

       
      </CardContent>
      { !hideActions && (
        <CardFooter>
          <Button disabled={!isEdited} onClick={handleSave}>
            Save
          </Button>
        </CardFooter>
      ) }
    </Card>
  )
}


