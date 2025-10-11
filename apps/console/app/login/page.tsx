import { Suspense } from 'react'
import Auth from "@/components/auth"
import { Loader } from "lucide-react"


function AuthLoading() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-accent-foreground/10 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      <Loader className="w-8 h-8 animate-spin text-primary relative z-10" />
    </div>
  )
}

export default function Login() {
   return (
     <Suspense fallback={<AuthLoading />}>
       <Auth isSignin={false} />
     </Suspense>
   )
}