"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Combobox, ComboboxOption } from "@/components/ui/combobox"
import {  Loader2 } from "lucide-react"
import { useFrameworks } from "@/hooks/use-project"
import projectService from "@/services/projects.service"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"
import { FrameworkIcon } from "@/components/ui/framework-icon"

interface FrameworkSettingsProps {
  projectId: string
  initialFrameworkId?: string
  initialBuildCommand?: string
  initialProdCommand?: string
  initialFrameworkIcon?: string
  initialOutDir?: string
  isLoading?:boolean
  refetchProject: () => Promise<any>
}

export function FrameworkSettings({ projectId, initialFrameworkId, initialBuildCommand, initialProdCommand, initialOutDir, refetchProject, isLoading  }: FrameworkSettingsProps) {

  const [originalFrameworkId, setOriginalFrameworkId] = useState(initialFrameworkId || "")
  const [originalProdCommand, setOriginalProdCommand] = useState(initialProdCommand || "")
  const [originalOutDir, setOriginalOutDir] = useState(initialOutDir || "")
  const [originalBuildCommand, setOriginalBuildCommand] = useState(initialBuildCommand || "")
  const [fetchNow, setFetchNow] = useState(false)


  const [selectedFrameworkId, setSelectedFrameworkId] = useState(initialFrameworkId || "")
  const [editedBuildCommand, setEditedBuildCommand] = useState(initialBuildCommand || "")
  const [editedProdCommand, setEditedProdCommand] = useState(initialProdCommand || "")
  const [editedOutDir, setEditedOutDir] = useState(initialOutDir || "")
  const [isSaving, setIsSaving] = useState(false)

  // Sync state when initial props change
  useEffect(() => {
    if (initialFrameworkId !== undefined) {
      setOriginalFrameworkId(initialFrameworkId)
      setSelectedFrameworkId(initialFrameworkId)
    }
  }, [initialFrameworkId])

  useEffect(() => {
    if (initialBuildCommand !== undefined) {
      setOriginalBuildCommand(initialBuildCommand)
      setEditedBuildCommand(initialBuildCommand)
    }
  }, [initialBuildCommand])

  useEffect(() => {
    if (initialProdCommand !== undefined) {
      setOriginalProdCommand(initialProdCommand)
      setEditedProdCommand(initialProdCommand)
    }
  }, [initialProdCommand])

  useEffect(() => {
    if (initialOutDir !== undefined) {
      setOriginalOutDir(initialOutDir)
      setEditedOutDir(initialOutDir)
    }
  }, [initialOutDir])

  const isDirty =
    originalFrameworkId !== selectedFrameworkId ||
    editedBuildCommand !== originalBuildCommand ||
    editedProdCommand !== originalProdCommand ||
    editedOutDir !== originalOutDir

  const {data:FRAMEWORKS,isLoading:isFrameworkLoading} = useFrameworks({fetchNow}) 

  const selectedFramework = FRAMEWORKS.find((f) => f.frameworkId === selectedFrameworkId)
  const isStaticFramework = selectedFramework?.applicationType?.toLowerCase() === "static"

  const handleFrameworkChange = (frameworkId: string) => {
    const framework = FRAMEWORKS.find((f) => f.frameworkId === frameworkId)
    if (framework) {
      setSelectedFrameworkId(frameworkId)
      setEditedBuildCommand(framework.defaultBuildCommand)
      setEditedProdCommand(framework.defaultProdCommand)
      setEditedOutDir(framework.defaultOutDir)
    }
  }
  
  const handleSave = async () => {
    setIsSaving(true)
    try {
       await projectService.updateProject({projectId,updates:{
      ...(isDirty && checkIsFrameworkEdited() ? {framework:{
        frameworkId:selectedFrameworkId,
        buildCommand:editedBuildCommand,
        prodCommand:editedProdCommand
      }}:{
         ...(checkIsBuildCommandEdited() && {buildCommand:editedBuildCommand}),
         ...(!isStaticFramework && checkIsProdCommandEdited() && {prodCommand:editedProdCommand}),
      }),
      ...(checkIsOutDirEdited() && {outDir:editedOutDir})
    }})
      setOriginalFrameworkId(selectedFrameworkId)
      setOriginalBuildCommand(editedBuildCommand)
      setOriginalProdCommand(editedProdCommand)
      setOriginalOutDir(editedOutDir)
      toast.success("Framework settings saved successfully!")
      await refetchProject()
    } catch (error:any) {
      console.log(error)
      toast.error(error.message || "Failed to save framework settings, please try again later.")
    } finally {
      setIsSaving(false)
    } 
  }

  function checkIsFrameworkEdited(){
     return originalFrameworkId !== selectedFrameworkId
  }

  function checkIsProdCommandEdited(){
    return editedProdCommand !== originalProdCommand
  }

  function checkIsBuildCommandEdited(){
    return editedBuildCommand !== originalBuildCommand
  }

  function checkIsOutDirEdited(){
    return editedOutDir !== originalOutDir
  }

  useEffect(()=>{
    if(!isLoading){
      setFetchNow(true)
    }
  },[isLoading])

  return (
    <div className="space-y-6">
      <div className="grid gap-6 max-w-2xl">
        <div className="space-y-3">
          <label htmlFor="framework" className="text-sm font-medium">
            Framework
          </label>
          {isLoading || isFrameworkLoading ? (
            <Skeleton className="h-10 w-56" />
          ) : (
            <Combobox
              options={FRAMEWORKS.map((framework):ComboboxOption=>({
                value:framework.frameworkId,
                label:framework.displayName,
                icon:<FrameworkIcon src={framework.keywordName} alt={framework.displayName} className="h-4 w-4" />
              }))}
              value={selectedFrameworkId}
              onValueChange={handleFrameworkChange}
              placeholder="Select framework..."
              searchPlaceholder="Search frameworks..."
              emptyText="No framework found."
              className="w-56"
            />
          )}
          <p className="text-sm text-muted-foreground">
            Select your framework. This will set recommended build settings automatically.
          </p>
        </div>

        <div className="space-y-3">
          <label htmlFor="build-command" className="text-sm font-medium">
            Build Command
          </label>
          {isLoading || isFrameworkLoading ? (
            <Skeleton className="h-10 w-full" />
          ) : (
            <Input
              id="build-command"
              value={editedBuildCommand}
              onChange={(e) => setEditedBuildCommand(e.target.value)}
              placeholder="npm run build"
              className="font-mono text-sm"
            />
          )}
          <p className="text-sm text-muted-foreground">
            Command to build your project for production.
          </p>
        </div>

        {!isStaticFramework && (
          <div className="space-y-3">
            <label htmlFor="prod-command" className="text-sm font-medium">
              Start Command
            </label>
            {isLoading || isFrameworkLoading ? (
              <Skeleton className="h-10 w-full" />
            ) : (
              <Input
                id="prod-command"
                value={editedProdCommand}
                onChange={(e) => setEditedProdCommand(e.target.value)}
                placeholder="npm start"
                className="font-mono text-sm"
              />
            )}
            <p className="text-sm text-muted-foreground">
              Command to start your server after build.
            </p>
          </div>
        )}

        <div className="space-y-3">
          <label htmlFor="output-dir" className="text-sm font-medium">
            Output Directory
          </label>
          {isLoading || isFrameworkLoading ? (
            <Skeleton className="h-10 w-full" />
          ) : (
            <Input
              id="output-dir"
              value={editedOutDir}
              onChange={(e) => setEditedOutDir(e.target.value)}
              placeholder=".next"
              className="font-mono text-sm"
            />
          )}
          <p className="text-sm text-muted-foreground">
            Directory where build artifacts are generated.
          </p>
        </div>
      </div>

      {isDirty && !isLoading && !isFrameworkLoading && (
        <div className="flex items-center gap-3">
          <Button onClick={handleSave} disabled={isSaving}>
            { isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : "Save Changes"}
          </Button>
        </div>
      )}
    </div>
  )
}
