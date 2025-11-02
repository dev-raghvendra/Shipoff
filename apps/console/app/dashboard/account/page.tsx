"use client"

import React from "react"
import { useSession } from "@/context/session.context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import { authService } from "@/services/auth.service"
import { 
  Check, 
  Crown, 
  Mail, 
  ShieldCheck, 
  User,
  Pencil, 
  Save, 
  X, 
  Github, 
  ExternalLink, 
  PlugZap,
  AlertCircle,
  Zap,
  Globe,
  Activity,
  Lock,
  Trash2,
  ChevronRight,
  Sparkles
} from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {FaGoogle as GoogleIcon} from "react-icons/fa"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { githubService } from "@/services/github.service"
import { GITHUB_API_ROUTES } from "@/config/service-route-config"
import { GithubInstallationResponse } from "@shipoff/proto"
import { InferResponse } from "@shipoff/types"

const PLANS = [
  {
    type: "FREE",
    title: "Free",
    price: "$0",
    description: "For personal projects",
    features: [
      { label: "4 Static Projects", icon: Globe, description: "Deploy React, Vue, Next.js static exports, and more" },
      { label: "1 Dynamic Project", icon: Zap, description: "Full-stack apps with server-side rendering and APIs" },
      { label: "512MB Memory & 0.1 CPU", icon: Activity, description: "Per project with auto-scaling" },
      { label: "On-Demand Scaling", icon: Activity, description: "Automatically scales based on traffic" },
      { label: "Always-Up Static Sites", icon: Globe, description: "Static sites never sleep, available 24/7" },
      { label: "24hr Log Retention", icon: Activity, description: "Extend with persistent storage add-on" },
      { label: "Global CDN", icon: Globe, description: "200+ edge locations worldwide" },
      { label: "DDoS Protection", icon: ShieldCheck, description: "Enterprise-grade security included" },
      { label: "Automatic SSL", icon: Lock, description: "Free certificates that auto-renew" },
    ],
  },
  {
    type: "PRO",
    title: "Pro",
    price: "$19",
    description: "For growing teams",
    features: [
      { label: "Unlimited Projects", icon: Zap, description: "Deploy as many projects as you need" },
      { label: "Priority Support", icon: ShieldCheck, description: "Faster response times from our team" },
      { label: "Advanced Analytics", icon: Activity, description: "Detailed traffic and performance insights" },
      { label: "Custom Domains", icon: Globe, description: "Unlimited domains with automatic DNS" },
      { label: "Everything in Free", icon: Check, description: "All Free tier features included" },
    ],
    comingSoon: true,
  },
]

export default function AccountPage(){
  const { data: session, status, update } = useSession()

  const currentType = session?.user?.subscription?.type || "FREE"
  const initials = (session?.user?.fullName || "U").split(" ").map(s=>s[0]).join("").slice(0,2).toUpperCase()
  const [editing, setEditing] = React.useState(false)
  const [fullName, setFullName] = React.useState(session?.user?.fullName || "")
  const [ghLoading, setGhLoading] = React.useState(true)
  const [installation, setInstallation] = React.useState<InferResponse<GithubInstallationResponse>["res"] | null>(null)
  const [isDeleting, setIsDeleting] = React.useState(false)
  const [showRemoveDialog, setShowRemoveDialog] = React.useState(false)

  const handleChangePlan = async (type: string) => {
    try{
      if(type === currentType){
        toast.info("You're already on this plan")
        return
      }
      const res = await authService.updateSubscription(type)
      const updatedSub = res?.res?.subscription
      await update({
        user: {
          ...session?.user,
          subscription: updatedSub || { ...session?.user?.subscription, type }
        }
      })
      toast.success("Subscription updated")
    }catch(e:any){
      toast.error(e?.message || "Failed to update subscription")
    }
  }

  const handleSaveName = async () => {
    try{
      if(!fullName || fullName === session?.user?.fullName){
        setEditing(false)
        return
      }
      await authService.updateProfile({ fullName })
      await update({ user: { ...session?.user, fullName } })
      toast.success("Name updated successfully")
      setEditing(false)
    }catch(e:any){
      toast.error(e?.message || "Failed to update name")
    }
  }

  const handleVerifyEmail = async () => {
    try {
      toast.info("Verification email sent! Please check your inbox.")
      // Implementation would call API to send verification email
    } catch (e: any) {
      toast.error(e?.message || "Failed to send verification email")
    }
  }

  React.useEffect(()=>{
    let mounted = true
    const load = async()=>{
      try{
        setGhLoading(true)
        const res = await githubService.getGithubInstallation()
        if(!mounted) return
        setInstallation(res.res)
      }catch{
        setInstallation(null)
      }finally{
        setGhLoading(false)
      }
    }
    load()
    return ()=>{ mounted = false }
  },[])

  if(status === "loading"){
    return (
      <div className="space-y-6">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-56 w-full" />
        <Skeleton className="h-72 w-full" />
      </div>
    )
  }

  const currentPlan = PLANS.find(p => p.type === currentType)

  const providerBadge = (provider: string) => {
    switch(provider.toUpperCase()){
      case "GOOGLE":
        return <GoogleIcon className="h-4 w-4" />
      case "GITHUB":
      return <Github className="h-4 w-4" />
      case "EMAIL":
        return <Mail className="h-4 inline w-4" />
      default:
        return <ShieldCheck className="h-4 inline w-4" />
  }
}

  return (
    <div className="max-w-6xl space-y-6">
      {/* Profile Section */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-6">
            {/* Avatar & Basic Info */}
            <div className="flex flex-col sm:flex-row gap-6">
              <Avatar className="size-20 ring-2 ring-border">
                <AvatarImage src={session?.user?.avatarUri} alt={session?.user?.fullName || "User"} />
                <AvatarFallback className="text-xl font-bold">{initials}</AvatarFallback>
              </Avatar>
              
              <div className="flex-1 flex flex-col gap-4">
                <div className="space-y-2">
                  {editing ? (
                    <div className="flex items-center gap-2">
                      <input
                        className="h-9 px-3 rounded-md border bg-background text-base font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
                        value={fullName}
                        onChange={(e)=>setFullName(e.target.value)}
                        autoFocus
                      />
                      <Button size="sm" onClick={handleSaveName} className="h-9">
                        <Save className="h-4 w-4"/>
                      </Button>
                      <Button size="sm" variant="ghost" onClick={()=>{setFullName(session?.user?.fullName || ''); setEditing(false)}} className="h-9">
                        <X className="h-4 w-4"/>
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <h2 className="text-2xl font-bold">{session?.user?.fullName}</h2>
                      <Button size="sm" variant="ghost" onClick={()=>setEditing(true)} className="h-8 w-8 p-0">
                        <Pencil className="h-4 w-4"/>
                      </Button>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-3 flex-wrap">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      <span>{session?.user?.email}</span>
                    </div>
                    {session?.user?.provider && (
                      <Badge variant="outline" className="gap-1.5 capitalize">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        {session.user.provider.toLowerCase()} account
                      </Badge>
                    )}
                    <Badge variant="secondary" className="uppercase">
                      {currentType}
                    </Badge>
                  </div>
                </div>

                {/* Email Verification Banner */}
                {!session?.user?.emailVerified && (
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900">
                    <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
                        Verify your email address
                      </p>
                      <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                        Please verify your email to unlock all features and secure your account.
                      </p>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={handleVerifyEmail}
                        className="mt-2 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-100 hover:bg-amber-100 dark:hover:bg-amber-900/50"
                      >
                        Verify Email
                      </Button>
                    </div>
                  </div>
                )}

                {/* Account Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                    <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground">Member since</p>
                      <p className="text-sm font-semibold">
                        {session?.user?.subscription?.startedAt 
                          ? new Date(session.user.subscription.startedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                          : 'Recently'
                        }
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                    <div className="size-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                      <Check className="h-5 w-5 text-green-500" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground">Account Status</p>
                      <p className="text-sm font-semibold flex items-center gap-1 mt-0.5">
                        {providerBadge(session?.user?.provider || "")}
                        {session?.user?.emailVerified ? 'Verified'  : 'Unverified'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                    <div className="size-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                      <ShieldCheck className="h-5 w-5 text-blue-500" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground">Security</p>
                      <p className="text-sm font-semibold">Active</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* GitHub Integration Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            
            <div>
              <CardTitle>GitHub Integration</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Connect your GitHub repositories for seamless deployments
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {ghLoading ? (
            <Skeleton className="h-20 w-full" />
          ) : installation ? (
            <div className="space-y-4">
              <div className="flex items-start gap-3 flex-1 min-w-0 p-4 rounded-lg bg-muted/20">
                <div className="size-10 rounded-lg bg-green-500/10 flex items-center justify-center shrink-0">
                  <Check className="h-5 w-5 text-green-500" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold">Connected to GitHub</p>
                    <Badge variant="secondary" className="gap-1">
                      <Check className="h-3 w-3" />
                      Installed
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Connected as <span className="font-medium">{installation.githubUserName || 'your GitHub account'}</span>
                  </p>
                  {installation.githubUserName && (
                    <a 
                      href={`https://github.com/settings/installations/${installation.githubInstallationId}`} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-1"
                    >
                      View installation <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 pt-2 border-t">
                {installation.githubInstallationId && (
                  <Button variant="outline" onClick={()=>window.open(`https://github.com/settings/installations/${installation.githubInstallationId}`, '_blank')} className="gap-2">
                    <Github className="h-4 w-4" />
                    Manage on GitHub
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                )}
                <Button 
                  variant="ghost" 
                  onClick={() => setShowRemoveDialog(true)}
                  disabled={isDeleting}
                  className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/10 ml-auto"
                >
                  <Trash2 className="h-4 w-4" />
                  Remove
                </Button>
                
                <AlertDialog open={showRemoveDialog} onOpenChange={setShowRemoveDialog}>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle className="flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-destructive" />
                        Remove GitHub Installation?
                      </AlertDialogTitle>
                      <AlertDialogDescription className="space-y-3 pt-2">
                        <p>
                          Removing the GitHub installation will result in the <strong>unlinking or deletion</strong> of all 
                          repositories that you have linked to any of your projects.
                        </p>
                        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 mt-4">
                          <p className="text-sm font-semibold text-destructive mb-1">⚠️ Important Warning:</p>
                          <p className="text-sm">
                            This action will cause <strong>all further deployments</strong> of projects that are linked to 
                            GitHub repositories to <strong>fail</strong>. You will need to reconnect your GitHub account and 
                            relink repositories to restore deployment functionality.
                          </p>
                        </div>
                        <p className="text-sm pt-2">
                          Are you sure you want to proceed? You can manage your installation settings on GitHub instead.
                        </p>
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel onClick={() => setShowRemoveDialog(false)}>
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => {
                          setShowRemoveDialog(false)
                          window.location.href = `https://github.com/settings/installations/${installation?.githubInstallationId}`
                        }}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Remove Installation
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-3 p-4 rounded-lg border border-dashed bg-muted/10">
              <div className="size-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                <Github className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold mb-1">Connect your GitHub account</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Install our GitHub App to access your repositories and enable automatic deployments.
                </p>
                <Button 
                  onClick={()=>{
                    const state = session?.accessToken;
                    if (state) window.location.href = GITHUB_API_ROUTES.GITHUB_APP_INSTALLATION({ state })
                  }} 
                  className="gap-2"
                >
                  <PlugZap className="h-4 w-4" />
                  Install GitHub App
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Subscription Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div>
              <CardTitle>Subscription & Billing</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Manage your plan and billing information
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {/* Current Plan */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-lg font-bold">Your Current Plan</p>
                    <Badge variant="default" className="uppercase">
                      {currentType}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {currentPlan?.description}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold">{currentPlan?.price}</p>
                  <p className="text-xs text-muted-foreground">per month</p>
                </div>
              </div>
              
              {/* All Features with Descriptions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentPlan?.features.map((feature, i) => {
                  const Icon = feature.icon
                  return (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                      <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-sm">{feature.label}</p>
                        <p className="text-xs text-muted-foreground mt-1">{feature.description}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Divider */}
            <div className="border-t" />

            {/* Upgrade Plans */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <p className="text-sm font-medium">Upgrade Plans</p>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {PLANS.map(plan => (
                  <div 
                    key={plan.type} 
                    className={`relative rounded-lg border p-5 transition-all ${
                      currentType === plan.type 
                        ? 'border-primary/40 bg-primary/5 shadow-sm' 
                        : plan.comingSoon
                        ? 'border-border/50 bg-muted/20 opacity-60'
                        : 'border-border hover:border-primary/30 hover:shadow-sm cursor-pointer'
                    }`}
                  >
                    {plan.comingSoon && (
                      <div className="absolute -top-2 right-4">
                        <Badge variant="secondary" className="text-xs">
                          Coming Soon
                        </Badge>
                      </div>
                    )}
                    <div className="mb-4">
                      <div className="flex items-baseline gap-2 mb-2">
                        <h3 className="text-xl font-bold">{plan.title}</h3>
                        <span className="text-3xl font-bold">{plan.price}</span>
                        <span className="text-sm text-muted-foreground">/mo</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{plan.description}</p>
                    </div>
                    <div className="space-y-2 mb-4">
                      {plan.features.map((feature, i) => {
                        const Icon = feature.icon
                        return (
                          <div key={i} className="flex items-center gap-2 text-sm">
                            <Icon className="h-4 w-4 text-primary shrink-0" />
                            <span>{feature.label}</span>
                          </div>
                        )
                      })}
                    </div>
                    <Button 
                      className="w-full" 
                      variant={currentType === plan.type ? "outline" : "default"}
                      onClick={() => !plan.comingSoon && handleChangePlan(plan.type)}
                      disabled={plan.comingSoon || currentType === plan.type}
                    >
                      {currentType === plan.type ? 'Current Plan' : plan.comingSoon ? 'Coming Soon' : `Upgrade to ${plan.title}`}
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Feature Comparison */}
            {currentType === 'FREE' && (
              <div className="p-4 rounded-lg border bg-gradient-to-r from-primary/5 to-primary/10">
                <div className="flex items-start gap-3">
                  <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Crown className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold mb-1">Ready to scale?</p>
                    <p className="text-sm text-muted-foreground mb-3">
                      Unlock unlimited projects, priority support, and advanced features with Pro.
                    </p>
                    <Button variant="outline" className="gap-2" disabled>
                      View Pro Features
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
