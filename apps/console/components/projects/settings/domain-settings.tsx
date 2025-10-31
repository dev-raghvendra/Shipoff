"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Check, Copy, Globe, Loader2, X, AlertCircle } from "lucide-react"
import projectService from "@/services/projects.service"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"
import { useDebounceRequest } from "@/hooks/use-debounce"
import { cn } from "@/lib/utils"

interface DomainSettingsProps {
  projectId: string
  initialPrefix?: string
  isLoading?:boolean
  refetchProject: () => Promise<any>
}

const DOMAIN_SUFFIX = "on.shipoff.in"

  export function DomainSettings({ projectId, refetchProject,isLoading, initialPrefix }: DomainSettingsProps) {
  const [originalDomainPrefix, setOriginalDomainPrefix] = useState(initialPrefix || "")
  const [editedDomainPrefix, setEditedDomainPrefix] = useState(initialPrefix || "")
  const [isSaving, setIsSaving] = useState(false)
  const [copied, setCopied] = useState(false)
  const [fetchDomain, setFetchDomain] = useState(false)
  const [domainAvailable, setDomainAvailable] = useState<boolean | null>(null)
  
  // Sync state when initial props change
  useEffect(() => {
    if (initialPrefix !== undefined) {
      setOriginalDomainPrefix(initialPrefix)
      setEditedDomainPrefix(initialPrefix)
    }
  }, [initialPrefix])

  const { data, error, pending } = useDebounceRequest(
    projectService.checkDomainAvailability.bind(projectService),
    500,
    [editedDomainPrefix],
    {domain:`${editedDomainPrefix}.${DOMAIN_SUFFIX}`},
    fetchDomain && editedDomainPrefix.length > 0
  )

  const fullDomain = `${editedDomainPrefix}.${DOMAIN_SUFFIX}`
  const isDirty = editedDomainPrefix !== originalDomainPrefix

  const handleSave = async () => {
    if(!isDirty || !domainAvailable) return
    setIsSaving(true)
    try {
       await projectService.updateProject({projectId,updates:{
        ...(isDirty && {domain:fullDomain})
       }})
      setOriginalDomainPrefix(editedDomainPrefix)
      setDomainAvailable(null)
      setFetchDomain(false)
      await refetchProject()
      toast.success("Domain settings saved successfully!");
    } catch ( error:any) {
      toast.error(error.message || "Failed to save domain settings, please try again later.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(fullDomain)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDomainChange = (value: string) => {
    const sanitized = value.toLowerCase().replace(/[^a-z0-9-]/g, "")
    setEditedDomainPrefix(sanitized)
    setDomainAvailable(null) // Reset availability when user types
    if(sanitized.length > 0 && sanitized !== originalDomainPrefix){
      setFetchDomain(true)
    } else {
      setFetchDomain(false)
    }
  }

  useEffect(() => {
     if(pending) {
       setDomainAvailable(null)
       return
     }
     
     if(error) {
       // Only toast on API errors
       console.error(error)
       toast.error(error?.message || "Failed to check domain availability")
       setDomainAvailable(null)
     } else if(data && data.res){
       // Set availability without toasting
       setDomainAvailable(data.res.isAvailable)
     }
  }, [data, error, pending])




  return (
    <div className="space-y-6">
      <div className="grid gap-6 max-w-2xl">
        <div className="space-y-3">
          <label htmlFor="domain-prefix" className="text-sm font-medium">
            Domain Prefix
          </label>
          {isLoading ? (
            <div className="flex items-center gap-2">
              <Skeleton className="h-10 flex-1 max-w-xs" />
              <Skeleton className="h-5 w-32" />
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <div className="relative flex-1 max-w-xs">
                  <Input
                    id="domain-prefix"
                    value={editedDomainPrefix}
                    onChange={(e) => handleDomainChange(e.target.value)}
                    placeholder="my-app"
                    className={cn(
                      "font-mono text-sm pr-9",
                      isDirty && domainAvailable === true && "border-green-500 focus-visible:ring-green-500",
                      isDirty && domainAvailable === false && "border-red-500 focus-visible:ring-red-500"
                    )}
                  />
                  {/* Availability indicator */}
                  {isDirty && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      {pending ? (
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                      ) : domainAvailable === true ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : domainAvailable === false ? (
                        <X className="h-4 w-4 text-red-600" />
                      ) : null}
                    </div>
                  )}
                </div>
                <span className="text-sm text-muted-foreground font-mono whitespace-nowrap">.{DOMAIN_SUFFIX}</span>
              </div>
              
              {/* Status messages */}
              {isDirty && editedDomainPrefix.length > 0 && (
                <>
                  {pending ? (
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Checking availability...
                    </p>
                  ) : domainAvailable === true ? (
                    <p className="text-sm text-green-600 flex items-center gap-2">
                      <Check className="h-3.5 w-3.5" />
                      Domain is available
                    </p>
                  ) : domainAvailable === false ? (
                    <p className="text-sm text-red-600 flex items-center gap-2">
                      <AlertCircle className="h-3.5 w-3.5" />
                      Domain is already taken
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Choose a unique subdomain. Only lowercase letters, numbers, and hyphens allowed.
                    </p>
                  )}
                </>
              )}
              
              {!isDirty && (
                <p className="text-sm text-muted-foreground">
                  Choose a unique subdomain. Only lowercase letters, numbers, and hyphens allowed.
                </p>
              )}
            </>
          )}
        </div>

        {isLoading ? (
          <Skeleton className="h-28 w-full" />
        ) : (
          <div className="rounded-lg border bg-muted/50 p-5 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                  <Globe className="h-3.5 w-3.5" />
                  Production URL
                </div>
                <code className="text-base font-mono font-semibold block break-all">{fullDomain}</code>
              </div>
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={handleCopy}
                className="gap-2 shrink-0"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy
                  </>
                )}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Your production deployment will be accessible at this URL.
            </p>
          </div>
        )}
      </div>

      {isDirty && !isLoading && (
        <div className="flex items-center gap-3">
          <Button 
            onClick={handleSave} 
            disabled={isSaving || !domainAvailable || pending}
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : "Save Changes"}
          </Button>
          {!domainAvailable && !pending && domainAvailable !== null && (
            <p className="text-sm text-muted-foreground">
              Please choose an available domain
            </p>
          )}
        </div>
      )}
    </div>
  )
}
