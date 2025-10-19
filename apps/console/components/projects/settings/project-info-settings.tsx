"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Check } from "lucide-react"

interface ProjectNameSettingsProps {
  projectId: string
  hideActions?: boolean
  onValidityChange?: (isValid: boolean) => void
}

export function ProjectNameSettings({ projectId, hideActions, onValidityChange }: ProjectNameSettingsProps) {
  const initialName = "my-paas-app"
  const initialDescription = "Web app for managing deployments and environments."

  const [name, setName] = useState(initialName)
  const [description, setDescription] = useState(initialDescription)
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const isDirty = name !== initialName || description !== initialDescription

  // Report validity to parent when name changes
  // Valid when name is non-empty
  useEffect(() => {
    if (!onValidityChange) return
    const isValid = name.trim().length > 0
    onValidityChange(isValid)
  }, [name])

  const handleSave = async () => {
    setIsSaving(true)
    console.log("[v0] Saving project name:", { projectId, name, description })
    await new Promise((resolve) => setTimeout(resolve, 500))
    setIsSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Project name & description</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium">Project name</label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter project name"
            className="mt-2"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Description</label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter project description"
            className="mt-2 resize-none"
            rows={3}
          />
        </div>

        {isDirty && !hideActions && (
          <div>
            <Button onClick={handleSave} disabled={isSaving || saved} className="w-full sm:w-auto">
              {saved ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Saved
                </>
              ) : isSaving ? (
                "Saving..."
              ) : (
                "Save changes"
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
