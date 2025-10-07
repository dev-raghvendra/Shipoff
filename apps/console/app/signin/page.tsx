import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import Link from "next/link"


export default function SignInPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-accent-foreground/10 via-transparent to-transparent" />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-2xl font-bold text-foreground font-serif">Shipoff</span>
            </div>
          </Link>
          <h1 className="text-3xl font-bold text-foreground mb-2 text-balance">Welcome back</h1>
          <p className="text-muted-foreground text-balance">Sign in to your account to continue</p>
        </div>

        {/* Sign in card */}
        <Card className="bg-card/50 backdrop-blur-xl border p-8 shadow-2xl">
          <form className="space-y-6">
            {/* OAuth buttons */}
            <div className="space-y-3">
              <Button type="button" variant="outline" className="w-full h-11 bg-transparent">
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </Button>

              <Button type="button" variant="outline" className="w-full h-11 bg-transparent">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                Continue with GitHub
              </Button>
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or continue with email</span>
              </div>
            </div>

            {/* Email/Password fields */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground">
                  Email
                </Label>
                <Input id="email" type="email" placeholder="you@company.com" className="h-11" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-foreground">
                    Password
                  </Label>
                  <Link
                    href="/forgot-password"
                    className="text-sm text-primary hover:text-primary/80 transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input id="password" type="password" placeholder="Enter your password" className="h-11" />
              </div>
            </div>

            {/* Submit button */}
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-11 font-medium shadow-lg shadow-primary/20"
            >
              Sign in
            </Button>

            {/* Sign up link */}
            <p className="text-center text-sm text-muted-foreground">
              {"Don't have an account? "}
              <Link href="/signup" className="text-primary hover:text-primary/80 font-medium transition-colors">
                Sign up
              </Link>
            </p>
          </form>
        </Card>

        {/* Footer text */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          By signing in, you agree to our{" "}
          <Link href="/terms" className="text-muted-foreground hover:text-foreground underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-muted-foreground hover:text-foreground underline">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  )
}
