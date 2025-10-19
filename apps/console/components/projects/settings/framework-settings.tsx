"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Combobox, ComboboxOption } from "@/components/ui/combobox"
import { Check } from "lucide-react"

interface FrameworkSettingsProps {
  projectId: string
  hideActions?: boolean
  onValidityChange?: (isValid: boolean) => void
}

const FRAMEWORKS = [
  {
    id: "nextjs",
    name: "Next.js",
    buildCommand: "next build",
    prodCommand: "next start -p 3000",
    outDir: ".next",
  },
  {
    id: "vite",
    name: "Vite",
    buildCommand: "vite build",
    prodCommand: "vite preview",
    outDir: "dist",
  },
  {
    id: "react",
    name: "React",
    buildCommand: "npm run build",
    prodCommand: "npm start",
    outDir: "build",
  },
  {
    id: "vue",
    name: "Vue",
    buildCommand: "npm run build",
    prodCommand: "npm run preview",
    outDir: "dist",
  },
  {
    id: "svelte",
    name: "Svelte",
    buildCommand: "npm run build",
    prodCommand: "npm run preview",
    outDir: "build",
  },
]

// Framework options for combobox
const frameworkOptions: ComboboxOption[] = FRAMEWORKS.map(fw => ({
  value: fw.id,
  label: fw.name
}))

export function FrameworkSettings({ projectId, hideActions, onValidityChange }: FrameworkSettingsProps) {
  const initialFramework = "nextjs"
  const initialBuildCommand = "next build"
  const initialProdCommand = "next start -p 3000"
  const initialOutDir = ".next"

  const [selectedFramework, setSelectedFramework] = useState(initialFramework)
  const [buildCommand, setBuildCommand] = useState(initialBuildCommand)
  const [prodCommand, setProdCommand] = useState(initialProdCommand)
  const [outDir, setOutDir] = useState(initialOutDir)
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const isDirty =
    selectedFramework !== initialFramework ||
    buildCommand !== initialBuildCommand ||
    prodCommand !== initialProdCommand ||
    outDir !== initialOutDir

  // Report validity when dependent fields change
  useEffect(() => {
    if (!onValidityChange) return
    const isValid = Boolean(buildCommand.trim() && prodCommand.trim() && outDir.trim())
    onValidityChange(isValid)
  }, [buildCommand, prodCommand, outDir])

  const handleFrameworkChange = (frameworkId: string) => {
    const framework = FRAMEWORKS.find((f) => f.id === frameworkId)
    if (framework) {
      setSelectedFramework(frameworkId)
      setBuildCommand(framework.buildCommand)
      setProdCommand(framework.prodCommand)
      setOutDir(framework.outDir)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    console.log("[v0] Saving framework settings:", {
      projectId,
      framework: selectedFramework,
      buildCommand,
      prodCommand,
      outDir,
    })
    await new Promise((resolve) => setTimeout(resolve, 500))
    setIsSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Framework & build configuration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium">Framework</label>
          <br />
          <Combobox
            options={frameworkOptions}
            value={selectedFramework}
            onValueChange={handleFrameworkChange}
            placeholder="Select framework..."
            searchPlaceholder="Search frameworks..."
            emptyText="No framework found."
            className="mt-2 w-40"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Build command</label>
          <Input
            value={buildCommand}
            onChange={(e) => setBuildCommand(e.target.value)}
            placeholder="npm run build"
            className="mt-2 font-mono text-xs"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Production command</label>
          <Input
            value={prodCommand}
            onChange={(e) => setProdCommand(e.target.value)}
            placeholder="npm start"
            className="mt-2 font-mono text-xs"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Output directory</label>
          <Input
            value={outDir}
            onChange={(e) => setOutDir(e.target.value)}
            placeholder=".next"
            className="mt-2 font-mono text-xs"
          />
        </div>

        {isDirty && !hideActions && (
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
        )}
      </CardContent>
    </Card>
  )
}
