"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { teamsService } from "@/services/teams.service"
import { toast } from "sonner"
import { CheckCircle2, XCircle, Users, Clock, AlertCircle, Sparkles, Shield, Zap } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function TeamInvitePage() {
  const params = useParams()
  const router = useRouter()
  const inviteId = params.inviteId as string

  const [open, setOpen] = useState(true)
  const [isAccepting, setIsAccepting] = useState(false)
  const [isRejecting, setIsRejecting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isInitializing, setIsInitializing] = useState(true)

  useEffect(() => {
    if (!inviteId) {
      setError("Invalid invitation link")
      setIsInitializing(false)
    } else {
      // Simulate a brief loading to make the transition smoother
      setTimeout(() => setIsInitializing(false), 500)
    }
  }, [inviteId])

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setOpen(false)
      // Navigate back to teams page when dialog is closed
      router.push("/dashboard/teams")
    }
  }

  const handleAccept = async () => {
    if (!inviteId) return

    setIsAccepting(true)
    setError(null)

    try {
      const response = await teamsService.acceptTeamMemberInvite({ inviteId })
      
      if (response.code === 200 || response.code === 201) {
        setSuccess(true)
        toast.success("Invitation accepted successfully!")
        
        // Redirect to teams page after a short delay
        setTimeout(() => {
          router.push("/dashboard/teams")
        }, 2000)
      } else {
        throw new Error(response.message || "Failed to accept invitation")
      }
    } catch (err: any) {
      const errorMessage = err.message || "Failed to accept invitation. Please try again."
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsAccepting(false)
    }
  }

  const handleReject = () => {
    setIsRejecting(true)
    toast.info("Invitation declined")
    
    // Close dialog and redirect to teams page
    setTimeout(() => {
      setOpen(false)
      router.push("/dashboard/teams")
    }, 800)
  }

  if (isInitializing) {
    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-[550px] p-0 gap-0 overflow-hidden">
          <div className="p-6 space-y-4">
            <div className="text-center space-y-4">
              <Skeleton className="h-20 w-20 rounded-full mx-auto" />
              <Skeleton className="h-8 w-64 mx-auto" />
              <Skeleton className="h-4 w-48 mx-auto" />
            </div>
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-10 w-full" />
            <div className="flex gap-3">
              <Skeleton className="h-10 flex-1" />
              <Skeleton className="h-10 flex-1" />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  if (success) {
    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-[500px] border-green-200 dark:border-green-900 p-0 gap-0 overflow-hidden">
          <div className="p-8 text-center space-y-6">
            <div className="mx-auto relative">
              <div className="absolute inset-0 bg-green-500/20 rounded-full blur-xl animate-pulse" />
              <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-green-100 to-green-50 dark:from-green-900/40 dark:to-green-900/20 ring-4 ring-green-100 dark:ring-green-900/30 mx-auto">
                <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400 animate-in zoom-in-50 duration-500" />
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
                Welcome to the team!
              </h2>
              <p className="text-base text-muted-foreground">
                You&apos;ve successfully joined the team. Get ready to collaborate!
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Sparkles className="h-4 w-4 text-yellow-500 animate-pulse" />
              <span>Redirecting you to your teams page...</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  if (error) {
    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-[480px] p-0 gap-0 overflow-hidden">
          <div className="bg-gradient-to-br from-red-50/50 via-background to-background dark:from-red-950/10 dark:via-background dark:to-background p-6 pb-4">
            <DialogHeader className="text-center space-y-3">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                <XCircle className="h-6 w-6 text-destructive" />
              </div>
              <DialogTitle className="text-xl">Unable to Accept Invitation</DialogTitle>
              <DialogDescription className="text-sm">
                {error}
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="px-6 space-y-4 py-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">This could happen if:</p>
              <ul className="space-y-1.5 text-sm text-muted-foreground pl-4">
                <li>• The invitation has expired (7 day limit)</li>
                <li>• You&apos;ve already accepted this invitation</li>
                <li>• The invitation was revoked by the team owner</li>
              </ul>
            </div>

            <p className="text-sm text-muted-foreground">
              Contact the team owner to request a new invitation if needed.
            </p>
          </div>

          <DialogFooter className="px-6 pb-6 flex-col sm:flex-row gap-2">
            <Button 
              variant="outline" 
              className="w-full sm:w-auto"
              onClick={() => router.push("/dashboard/overview")}
            >
              Dashboard
            </Button>
            <Button 
              className="w-full sm:w-auto"
              onClick={() => router.push("/dashboard/teams")}
            >
              View Teams
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[600px] p-0 gap-0 overflow-hidden border-primary/20">
        {/* Header */}
        <DialogHeader className="p-6 pb-4 text-center space-y-4">
          <div className="mx-auto relative">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
            <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/5 ring-4 ring-primary/10 mx-auto">
              <Users className="h-10 w-10 text-primary" />
            </div>
          </div>
          <div className="space-y-2">
            <Badge variant="secondary" className="mb-2">
              Team Collaboration
            </Badge>
            <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Team Invitation
            </DialogTitle>
            <DialogDescription className="text-base">
              You&apos;ve been invited to join a collaborative team
            </DialogDescription>
          </div>
        </DialogHeader>

        {/* Content */}
        <div className="px-6 space-y-6 pb-4">
          <Alert className="border-primary/20 bg-primary/5">
            <Sparkles className="h-4 w-4 text-primary" />
            <AlertTitle className="text-base">What you&apos;ll get</AlertTitle>
            <AlertDescription className="text-sm mt-2 space-y-2">
              <div className="flex items-start gap-2">
                <Shield className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <span>Access to all team resources and shared projects</span>
              </div>
              <div className="flex items-start gap-2">
                <Zap className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <span>Collaborate with team members in real-time</span>
              </div>
              <div className="flex items-start gap-2">
                <Users className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <span>Participate in team discussions and decisions</span>
              </div>
            </AlertDescription>
          </Alert>

          <Separator />

          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground font-medium">Invitation ID</span>
              <code className="px-2 py-1 rounded bg-muted text-xs font-mono">{inviteId.substring(0, 12)}...</code>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>This invitation expires in 7 days</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="px-6 pb-6 flex-col gap-3 sm:flex-col">
          <div className="flex gap-3 w-full">
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleReject}
              disabled={isAccepting || isRejecting}
            >
              {isRejecting ? (
                <>
                  <Skeleton className="h-4 w-4 mr-2 rounded-full animate-spin" />
                  Declining...
                </>
              ) : (
                "Decline"
              )}
            </Button>
            <Button
              className="flex-1 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
              onClick={handleAccept}
              disabled={isAccepting || isRejecting}
            >
              {isAccepting ? (
                <>
                  <Skeleton className="h-4 w-4 mr-2 rounded-full animate-spin" />
                  Accepting...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Accept Invitation
                </>
              )}
            </Button>
          </div>
          <p className="text-xs text-center text-muted-foreground w-full">
            By accepting, you agree to collaborate within the team&apos;s guidelines
          </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

