"use client"

import { useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Check, X, Loader2, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { useDebounceRequest } from "@/hooks/use-debounce"
import projectService from "@/services/projects.service"
import { toast } from "sonner"

interface DomainStepProps {
  domainPrefix: string
  onDomainPrefixChange: (value: string) => void
  onAvailabilityChange?: (available: boolean | null) => void
}

const DOMAIN_SUFFIX = "on.shipoff.in"

export function DomainStep({ 
  domainPrefix, 
  onDomainPrefixChange,
  onAvailabilityChange 
}: DomainStepProps) {
  const fullDomain = `${domainPrefix}${DOMAIN_SUFFIX}`
  
  const { data, error, pending } = useDebounceRequest(
    projectService.checkDomainAvailability.bind(projectService),
    500,
    [domainPrefix],
    { domain: fullDomain },
    domainPrefix.length > 0
  )

  const handleChange = (value: string) => {
    // Only allow lowercase alphanumeric and hyphens
    const sanitized = value.toLowerCase().replace(/[^a-z0-9-]/g, "")
    onDomainPrefixChange(sanitized)
  }

  // Handle availability updates
  useEffect(() => {
    if (pending) {
      onAvailabilityChange?.(null)
      return
    }
    
    if (error) {
      console.error(error)
      toast.error(error?.message || "Failed to check domain availability")
      onAvailabilityChange?.(null)
    } else if (data && data.res) {
      onAvailabilityChange?.(data.res.isAvailable)
    }
  }, [data, error, pending, onAvailabilityChange])

  const domainAvailable = data?.res?.isAvailable ?? null

  return (
    <div className="space-y-3">
      <div>
        <label className="text-xs text-muted-foreground">Domain prefix</label>
        <div className="flex items-center gap-2 mt-1">
          <div className="relative flex-1">
            <Input 
              className={cn(
                "font-mono text-sm pr-9",
                domainPrefix.length > 0 && domainAvailable === true && "border-green-500 focus-visible:ring-green-500",
                domainPrefix.length > 0 && domainAvailable === false && "border-red-500 focus-visible:ring-red-500"
              )}
              value={domainPrefix} 
              onChange={(e) => handleChange(e.target.value)}
              placeholder="my-app"
            />
            {/* Availability indicator */}
            {domainPrefix.length > 0 && (
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
          <span className="text-sm text-muted-foreground font-mono whitespace-nowrap">{DOMAIN_SUFFIX}</span>
        </div>
        
        {/* Status messages */}
        {domainPrefix.length > 0 && (
          <div className="mt-2">
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
                Only lowercase letters, numbers, and hyphens allowed
              </p>
            )}
          </div>
        )}
        
        {domainPrefix.length === 0 && (
          <p className="text-sm text-muted-foreground mt-2">
            Only lowercase letters, numbers, and hyphens allowed
          </p>
        )}
      </div>

      {/* Preview Section */}
      <div className="rounded-lg border bg-muted/30 p-3">
        <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
          Your app will be available at
        </div>
        <code className="text-sm font-mono font-semibold text-foreground break-all">
          {fullDomain}
        </code>
      </div>
    </div>
  )
}



