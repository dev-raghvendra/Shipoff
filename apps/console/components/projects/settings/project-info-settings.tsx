"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Check, Loader2 } from "lucide-react"
import projectService from "@/services/projects.service"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"

interface ProjectNameSettingsProps {
  projectId: string
  initialName?: string
  initialDescription?: string
  isLoading?: boolean
  refetchProject: () => Promise<any>
}

export function ProjectNameSettings({ projectId, initialName, initialDescription, isLoading, refetchProject }: ProjectNameSettingsProps) {
  const [originalName, setOriginalName] = useState(initialName || "")
  const [originalDescription, setOriginalDescription] = useState(initialDescription || "")

  const [editedName, setEditedName] = useState(initialName || "")
  const [editedDescription, setEditedDescription] = useState(initialDescription || "")
  const [isSaving, setIsSaving] = useState(false)

  // Sync state when initial props change
  useEffect(() => {
    if (initialName !== undefined) {
      setOriginalName(initialName)
      setEditedName(initialName)
    }
  }, [initialName])

  useEffect(() => {
    if (initialDescription !== undefined) {
      setOriginalDescription(initialDescription)
      setEditedDescription(initialDescription)
    }
  }, [initialDescription])

  const isDirty = editedName !== originalName || editedDescription !== originalDescription

  const handleSave = async () => {
    setIsSaving(true)
    try {
       await projectService.updateProject({projectId,updates:{
          ...(isDirty && {name:editedName}),
          ...(isDirty && {description:editedDescription}),
       }})
       await refetchProject()
       setOriginalName(editedName)
       setOriginalDescription(editedDescription)
       toast.success("Project info saved successfully!");
    } catch (error:any) {
      toast.error(error.message || "Failed to save project info, please try again later.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 max-w-2xl">
        <div className="space-y-3">
          <label htmlFor="project-name" className="text-sm font-medium">
            Project Name
          </label>
          {isLoading ? (
            <Skeleton className="h-10 w-full" />
          ) : (
            <Input
              id="project-name"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              placeholder="my-awesome-project"
            />
          )}
          <p className="text-sm text-muted-foreground">
            The name of your project as it appears in your dashboard.
          </p>
        </div>

        <div className="space-y-3">
          <label htmlFor="project-description" className="text-sm font-medium">
            Description <span className="text-muted-foreground font-normal">(Optional)</span>
          </label>
          {isLoading ? (
            <Skeleton className="h-24 w-full" />
          ) : (
            <Textarea
              id="project-description"
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              placeholder="A brief description of what your project does..."
              className="resize-none"
              rows={4}
            />
          )}
          <p className="text-sm text-muted-foreground">
            Help your team understand the purpose of this project.
          </p>
        </div>
      </div>

      {isDirty && !isLoading && (
        <div className="flex items-center gap-3">
          <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
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
