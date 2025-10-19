"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Check, Copy } from "lucide-react"

interface DomainSettingsProps {
  projectId: string
  hideActions?: boolean
  onValidityChange?: (isValid: boolean) => void
}

const DOMAIN_SUFFIX = "on.shipoff.in"

export function DomainSettings({ projectId, hideActions, onValidityChange }: DomainSettingsProps) {
  const initialPrefix = "my-paas-app"
  const [domainPrefix, setDomainPrefix] = useState(initialPrefix)
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [copied, setCopied] = useState(false)

  const fullDomain = `${domainPrefix}.${DOMAIN_SUFFIX}`

  const isDirty = domainPrefix !== initialPrefix

  useEffect(() => {
    if (!onValidityChange) return
    const isValid = domainPrefix.trim().length > 0
    onValidityChange(isValid)
  }, [domainPrefix])

  const handleSave = async () => {
    setIsSaving(true)
    console.log("[v0] Saving domain settings:", { projectId, domainPrefix, fullDomain })
    await new Promise((resolve) => setTimeout(resolve, 500))
    setIsSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(fullDomain)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Domain</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium">Domain prefix</label>
          <div className="flex items-center gap-2 mt-2">
            <Input
              value={domainPrefix}
              onChange={(e) => setDomainPrefix(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
              placeholder="my-paas-app"
              className="font-mono text-sm"
            />
            <span className="text-sm text-muted-foreground whitespace-nowrap">.{DOMAIN_SUFFIX}</span>
          </div>
        </div>

        <div className="rounded-lg border p-4 bg-muted/30">
          <p className="text-xs text-muted-foreground mb-2">Your domain</p>
          <div className="flex items-center justify-between">
            <code className="text-sm font-mono font-medium">{fullDomain}</code>
            <Button size="sm" variant="ghost" onClick={handleCopy} className="h-8 w-8 p-0">
              <Copy className={`h-4 w-4 ${copied ? "text-green-600" : ""}`} />
            </Button>
          </div>
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
