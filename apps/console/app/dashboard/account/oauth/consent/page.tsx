"use client"

import React, { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ShieldCheck, Check, AlertCircle, ArrowLeft, KeyRound, Lock, Info } from "lucide-react"
import { toast } from "sonner"
import { useSession } from "@/context/session.context"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { motion, AnimatePresence } from "framer-motion"
function parseJwt(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}
function OAuthConsentContent() {
  const searchParams = useSearchParams()
  const request = searchParams.get("request")
  const { data: session, status } = useSession()
  
  const [loading, setLoading] = useState(true)
  const [requestData, setRequestData] = useState<any>(null)
  const [authorizing, setAuthorizing] = useState(false)

  useEffect(() => {
    if (request) {
      const decoded = parseJwt(request)
      if (decoded) {
        setRequestData(decoded)
      } else {
        toast.error("Invalid authorization request.")
      }
    } else {
      toast.error("Request param not found")
    }
    setLoading(false)
  }, [request])

  const handleAuthorize = async () => {
     toast.success("Authorization allowed")
     window.location.href=`${window.location.origin}/api/oauth/authorize/decision?accept=true&request=${request}`
  }

  const handleDeny = () => {
    toast.info("Authorization denied")
     window.location.href=`${window.location.origin}/api/oauth/authorize/decision?accept=false&request=${request}`
  }

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <Card className="w-full max-w-md bg-background/50 backdrop-blur-xl border-border/50 shadow-2xl">
          <CardHeader>
            <Skeleton className="h-8 w-12 rounded-xl mb-4" />
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-full" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-20 w-full rounded-xl" />
            <Skeleton className="h-32 w-full rounded-xl" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!request || !requestData) {
    return (
      <div className="flex items-center justify-center min-h-[80vh] p-4">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          <Card className="w-full max-w-md border-destructive/30 bg-destructive/5 shadow-2xl shadow-destructive/10 backdrop-blur-xl">
            <CardHeader className="text-center">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="mx-auto bg-destructive/20 p-4 rounded-2xl w-16 h-16 flex items-center justify-center mb-6 ring-4 ring-destructive/10"
              >
                <AlertCircle className="h-8 w-8 text-destructive" />
              </motion.div>
              <CardTitle className="text-2xl font-bold tracking-tight">Invalid Request</CardTitle>
              <CardDescription className="text-base mt-2">
                The authorization request is missing or invalid. Please return to the application and try again.
              </CardDescription>
            </CardHeader>
            <CardFooter className="justify-center pb-8">
              <Button variant="outline" onClick={() => window.history.back()} className="rounded-xl px-8 transition-transform hover:scale-105 active:scale-95">
                <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    )
  }

  const clientName = requestData.client_name || requestData.client_id || "An application"
  const scopes = (requestData.scope || "").split(" ").filter(Boolean)
  const initials = (session?.user?.fullName || "U").split(" ").map((s: string) => s[0]).join("").slice(0, 2).toUpperCase()

  return (
    <div className="flex items-center justify-center min-h-[80vh] p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl -z-10 mix-blend-screen opacity-50 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-120 h-120 bg-blue-500/10 rounded-full blur-3xl -z-10 mix-blend-screen opacity-50" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="border-border/40 shadow-2xl bg-background/70 backdrop-blur-2xl overflow-hidden rounded-2xl ring-1 ring-white/10 dark:ring-white/5">
          <div className="absolute inset-0 bg-linear-to from-primary/5 via-transparent to-transparent opacity-50 pointer-events-none" />
          
          <CardHeader className="text-center pb-2 pt-8 relative">
            <motion.div 
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.1 }}
              className="mx-auto bg-linear-to from-primary/20 to-primary/5 p-4 rounded-2xl w-16 h-16 flex items-center justify-center mb-6 shadow-inner ring-1 ring-primary/20"
            >
              <ShieldCheck className="h-8 w-8 text-primary" />
            </motion.div>
            <CardTitle className="text-2xl font-extrabold tracking-tight bg-clip-text text-transparent bg-linear-to-b from-foreground to-foreground/70">
              Authorize Application
            </CardTitle>
            <CardDescription className="text-base mt-2">
              <span className="font-semibold text-foreground">{clientName}</span> wants to access your account.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 pt-4 relative">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center justify-between p-4 bg-muted/40 rounded-xl border border-border/50 shadow-sm backdrop-blur-md"
            >
              <div className="flex items-center gap-4">
                <Avatar className="size-12 border-2 border-background shadow-sm ring-2 ring-primary/10">
                  <AvatarImage src={session?.user?.avatarUri} />
                  <AvatarFallback className="bg-primary/5 text-primary font-bold">{initials}</AvatarFallback>
                </Avatar>
                <div className="text-sm">
                  <p className="font-semibold text-foreground">{session?.user?.fullName || "User"}</p>
                  <p className="text-muted-foreground">{session?.user?.email}</p>
                </div>
              </div>
              <Badge variant="secondary" className="bg-background/80 shadow-sm border-border/50 backdrop-blur-md">
                <Lock className="h-3 w-3 mr-1 text-primary" /> Active
              </Badge>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="space-y-4"
            >
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <KeyRound className="h-4 w-4 text-muted-foreground" />
                This application will be able to:
              </h3>
              <ul className="space-y-3">
                {scopes.length > 0 ? (
                  scopes.map((scope: string, i) => (
                    <motion.li 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + (i * 0.1) }}
                      key={scope} 
                      className="flex items-start gap-3 text-sm"
                    >
                      <div className="mt-0.5 size-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <Check className="h-3 w-3 text-primary" />
                      </div>
                      <span className="text-muted-foreground leading-relaxed">
                        Access your <strong className="text-foreground font-medium">{scope}</strong> information
                      </span>
                    </motion.li>
                  ))
                ) : (
                  <motion.li 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex items-start gap-3 text-sm"
                  >
                    <div className="mt-0.5 size-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Check className="h-3 w-3 text-primary" />
                    </div>
                    <span className="text-muted-foreground leading-relaxed">
                      Access your basic profile information
                    </span>
                  </motion.li>
                )}
              </ul>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex gap-3 text-xs text-muted-foreground bg-muted/30 p-4 rounded-xl border border-border/40"
            >
              <Info className="h-4 w-4 shrink-0 text-primary mt-0.5" />
              <p className="leading-relaxed">
                By authorizing, you allow this application to access your data in accordance with their privacy policy and terms of service.
              </p>
            </motion.div>
          </CardContent>

          <CardFooter className="flex-col gap-3 pb-8 pt-2 relative z-10">
            <Button 
              className="w-full h-12 rounded-xl text-base font-semibold transition-all hover:shadow-lg hover:shadow-primary/25 active:scale-[0.98]" 
              onClick={handleAuthorize} 
              disabled={authorizing}
            >
              <AnimatePresence mode="wait">
                {authorizing ? (
                  <motion.div
                    key="authorizing"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2"
                  >
                    <div className="h-4 w-4 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                    Authorizing...
                  </motion.div>
                ) : (
                  <motion.span
                    key="authorize"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    Authorize Access
                  </motion.span>
                )}
              </AnimatePresence>
            </Button>
            <Button 
              variant="ghost" 
              className="w-full h-12 rounded-xl text-base hover:bg-destructive/5 hover:text-destructive transition-colors active:scale-[0.98]" 
              onClick={handleDeny}
              disabled={authorizing}
            >
              Cancel
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}

export default function OAuthConsentPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-[80vh]"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
      <OAuthConsentContent />
    </Suspense>
  )
}
