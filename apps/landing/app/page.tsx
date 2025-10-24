'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, Zap, Shield, Rocket, GitBranch, Globe, Code2, Layers, Terminal, Cloud, Box, Activity, Check } from 'lucide-react'
import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'

export default function LandingPage() {
  const [activeStep, setActiveStep] = useState(0)
  const stepsRef = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const handleScroll = () => {
      const scrollTriggers = stepsRef.current.filter(el => el !== null)
      
      scrollTriggers.forEach((trigger, index) => {
        if (trigger) {
          const rect = trigger.getBoundingClientRect()
          const windowHeight = window.innerHeight
          
          // Check if trigger is in the middle of viewport
          if (rect.top < windowHeight / 2 && rect.bottom > windowHeight / 2) {
            setActiveStep(index)
          }
        }
      })
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Initial check

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const frameworks= [
    {name: "Next.js", tag: "nextjs", icon: "nextjs-plain", color: "from-gray-900 to-gray-700"},
    {name: "React", tag: "react",   icon: "react-original", color: "from-blue-500 to-blue-600"},
    {name: "Vue", tag: "vuejs", icon: "vuejs-plain", color: "from-green-500 to-green-600"},
    {name: "Angular", tag: "angularjs", icon: "angularjs-plain", color: "from-red-500 to-red-600"},
    {name: "Svelte", tag: "svelte", icon: "svelte-plain", color: "from-orange-500 to-orange-600"},
    {name: "Nuxt", tag: "nuxtjs", icon: "nuxtjs-plain", color: "from-green-600 to-green-700"},
    {name: "Express", tag: "express", icon: "express-original", color: "from-gray-700 to-gray-800"},
    {name: "Nest.js", tag: "nestjs", icon: "nestjs-original", color: "from-red-600 to-pink-600"},
    {name: "Django", tag: "django", icon: "django-plain", color: "from-green-700 to-green-800"},
    {name: "Flask", tag: "flask", icon: "flask-original", color: "from-gray-600 to-gray-700"},
    {name: "Laravel", tag: "laravel", icon: "laravel-original", color: "from-red-500 to-red-700"},
    {name: "FastAPI", tag: "fastapi", icon: "fastapi-plain", color: "from-teal-500 to-teal-600"},
    {name: "Vite", tag: "vite", icon: "vite-original", color: "from-blue-500 to-blue-600"},
    {name: "Fastify", tag: "fastify", icon: "fastify-original", color: "from-teal-500 to-teal-600"},
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-border/40 bg-background/60 backdrop-blur-xl">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Box className="size-8 text-primary" />
              <span className="text-xl font-bold">Shipoff</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <Link href="#features" className="text-sm hover:text-primary transition-colors">
                Features
              </Link>
              <Link href="#benefits" className="text-sm hover:text-primary transition-colors">
                Benefits
              </Link>
              <Link href="#pricing" className="text-sm hover:text-primary transition-colors">
                Pricing
              </Link>
              <Link href="/dashboard/overview">
                <Button variant="ghost" size="sm">Dashboard</Button>
              </Link>
              <Link href="/login">
                <Button size="sm">Get Started</Button>
              </Link>
            </div>
            <div className="md:hidden">
              <Link href="/login">
                <Button size="sm">Sign In</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-32 overflow-hidden min-h-[90vh] flex items-center">
        {/* Main gradient orb - bottom left to top right */}
        <div className="absolute inset-0 landing-gradient" />
        
        {/* Large dramatic orb - Bottom Left */}
        <div className="absolute -left-1/4 bottom-0 translate-y-1/4 w-[900px] h-[900px] hero-orb-gradient" />
        
        {/* Secondary accent orb - Top Right */}
        <div className="absolute -right-1/4 -top-1/4 w-[700px] h-[700px] accent-orb" />
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]" />
        
        {/* Vignette effect - top to bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
        
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 backdrop-blur-sm mb-8 text-sm hover:border-primary/30 transition-colors"
              >
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-primary text-primary-foreground">
                  New
                </span>
                <span className="text-foreground/80">Deploy in seconds, scale infinitely</span>
                <ArrowRight className="size-3.5 text-primary" />
              </motion.div>
            
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-tight"
              >
                From Code to Cloud
                <span className="block mt-2">
                  <motion.span 
                    className="text-primary"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    in Seconds
                  </motion.span>
                </span>
              </motion.h1>

              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-lg sm:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed"
              >
                Push code. Ship products. Scale effortlessly.
                <br className="hidden sm:block" />
                The fastest way from localhost to production.
              </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
            >
              <Link href="/login">
                <Button size="lg" className="gap-2 group px-8 h-12 text-base shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all">
                  Get Started
                  <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-sm text-muted-foreground"
            >
              {[
                { icon: Activity, color: 'text-green-500', text: '99.9% Uptime' },
                { icon: Shield, color: 'text-blue-500', text: 'Enterprise Security' },
                { icon: Zap, color: 'text-yellow-500', text: 'Instant Deployment' },
              ].map((item, i) => (
                <motion.div 
                  key={item.text}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.8 + (i * 0.1) }}
                  className="flex items-center gap-2"
                >
                  <item.icon className={`size-4 ${item.color}`} />
                  <span>{item.text}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works Section - Scroll-based Animation */}
      <section className="py-20 sm:py-32 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Sticky Header - Desktop */}
          <div className="hidden lg:block sticky top-20 z-20 mb-24 pb-12 bg-gradient-to-b from-background via-background to-transparent">
            <div className="text-center">
              <h2 className="text-3xl sm:text-4xl font-bold mb-3">
                How It Works
              </h2>
              <p className="text-lg text-muted-foreground">
                Deploy in 4 simple steps • No Dockerfile needed
              </p>
            </div>
          </div>

          {/* Mobile Header */}
          <div className="lg:hidden text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Deploy in 4 simple steps • No Dockerfile needed
            </p>
          </div>

          {/* Fixed Height Container for Scroll Experience */}
          <div className="relative hidden lg:block" style={{ height: '2400px' }}>
            {/* Invisible scroll triggers */}
            <div ref={(el) => { stepsRef.current[0] = el }} className="absolute top-0 left-0 right-0" style={{ height: '600px' }} />
            <div ref={(el) => { stepsRef.current[1] = el }} className="absolute left-0 right-0" style={{ top: '600px', height: '600px' }} />
            <div ref={(el) => { stepsRef.current[2] = el }} className="absolute left-0 right-0" style={{ top: '1200px', height: '600px' }} />
            <div ref={(el) => { stepsRef.current[3] = el }} className="absolute left-0 right-0" style={{ top: '1800px', height: '600px' }} />
            
            <div className="sticky top-32">
              <div className="grid grid-cols-[1fr_0.8fr] gap-16 items-start h-[550px] max-w-6xl mx-auto pt-12">
                
                {/* Left Side - Transitioning Text Content */}
                <div className="relative h-full flex items-start">
                  <div className="w-full relative">
                    
                    {/* Step Indicators */}


                    {/* Step 1 Content */}
                    <div className={`absolute inset-0 transition-all duration-700 ${
                      activeStep === 0 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
                    }`}>
                      <div className="flex items-start gap-4">
                        <div className="size-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border-2 border-primary/30 flex items-center justify-center shrink-0">
                          <GitBranch className="size-7 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <h3 className="text-2xl font-bold">Link Repository</h3>
                            <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-1 rounded">Step 1</span>
                          </div>
                          <p className="text-muted-foreground leading-relaxed text-lg mb-6">
                            Connect your GitHub repository. Grant access and select the repository you want to deploy.
                          </p>
                          <div className="p-5 rounded-xl bg-muted/50 border-2 border-primary/20 font-mono text-sm">
                            <div className="flex items-center gap-2 text-muted-foreground mb-2">
                              <Terminal className="size-4" />
                              <span className="text-xs">Terminal</span>
                            </div>
                            <div><span className="text-primary">$</span> git push origin main</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Step 2 Content */}
                    <div className={`absolute inset-0 transition-all duration-700 ${
                      activeStep === 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
                    }`}>
                      <div className="flex items-start gap-4">
                        <div className="size-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-500/5 border-2 border-blue-500/30 flex items-center justify-center shrink-0">
                          <Code2 className="size-7 text-blue-500" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <h3 className="text-2xl font-bold">Framework Detection</h3>
                            <span className="text-xs font-mono text-blue-500 bg-blue-500/10 px-2 py-1 rounded">Step 2</span>
                          </div>
                          <p className="text-muted-foreground leading-relaxed text-lg mb-6">
                            Shipoff automatically analyzes your code to determine the language and framework. No configuration files needed.
                          </p>
                          <div className="p-5 rounded-xl bg-gradient-to-br from-blue-500/10 to-primary/5 border-2 border-blue-500/20">
                            <div className="flex items-center gap-4">
                              <div className="size-12 rounded-xl bg-primary/20 flex items-center justify-center">
                                <Code2 className="size-6 text-primary" />
                              </div>
                              <div>
                                <div className="font-bold text-lg">Next.js 14</div>
                                <div className="text-sm text-muted-foreground">TypeScript • React 18</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Step 3 Content */}
                    <div className={`absolute inset-0 transition-all duration-700 ${
                      activeStep === 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
                    }`}>
                      <div className="flex items-start gap-4">
                        <div className="size-14 rounded-2xl bg-gradient-to-br from-purple-500/20 to-purple-500/5 border-2 border-purple-500/30 flex items-center justify-center shrink-0">
                          <Shield className="size-7 text-purple-500" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <h3 className="text-2xl font-bold">Configure Environment</h3>
                            <span className="text-xs font-mono text-purple-500 bg-purple-500/10 px-2 py-1 rounded">Step 3</span>
                          </div>
                          <p className="text-muted-foreground leading-relaxed text-lg mb-6">
                            Set up your environment variables securely. Add API keys, database URLs, and other secrets.
                          </p>
                          <div className="space-y-3">
                            {['DATABASE_URL', 'API_KEY'].map((env) => (
                              <div key={env} className="p-4 rounded-xl bg-muted/40 border-2 border-purple-500/20 font-mono text-sm flex items-center justify-between">
                                <span className="font-semibold">{env}</span>
                                <span className="text-muted-foreground">••••••••</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Step 4 Content */}
                    <div className={`absolute inset-0 transition-all duration-700 ${
                      activeStep === 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
                    }`}>
                      <div className="flex items-start gap-4">
                        <div className="size-14 rounded-2xl bg-gradient-to-br from-green-500/20 to-green-500/5 border-2 border-green-500/30 flex items-center justify-center shrink-0">
                          <Rocket className="size-7 text-green-500" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <h3 className="text-2xl font-bold">Deploy & Go Live</h3>
                            <span className="text-xs font-mono text-green-500 bg-green-500/10 px-2 py-1 rounded">Step 4</span>
                          </div>
                          <p className="text-muted-foreground leading-relaxed text-lg mb-6">
                            Hit deploy and watch your application go live in seconds. Automatic SSL, global CDN, and monitoring included.
                          </p>
                          <div className="p-5 rounded-xl bg-muted/50 border-2 border-green-500/20">
                            <div className="space-y-3 font-mono text-sm">
                              <div className="flex items-center gap-3">
                                <Check className="size-4 text-green-500" />
                                <span>Building...</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <Check className="size-4 text-green-500" />
                                <span>Deploying to edge...</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="size-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
                                <span className="text-green-500 font-semibold">Going live...</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Right Side - Animated Visual that Changes Based on Active Step */}
                <div className="relative h-full flex items-start">
                  <div className="relative w-full h-[480px] rounded-2xl border border-border/50 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-xl overflow-hidden shadow-2xl">
                
                {/* Step 1 Visual - Git Connection Animation */}
                <div className={`absolute inset-0 transition-all duration-700 ${
                  activeStep === 0 ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
                }`}>
                  <div className="h-full flex items-center justify-center p-6">
                    <div className="relative w-full">
                      {/* Git Graph Visualization */}
                      <div className="space-y-5">
                        {/* Origin/Remote */}
                        <div className="flex items-center justify-center">
                          <div className="relative">
                            <div className="size-20 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border-2 border-primary/30 flex items-center justify-center animate-pulse">
                              <GitBranch className="size-10 text-primary" />
                            </div>
                            <div className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-mono text-muted-foreground">
                              origin/main
                            </div>
                          </div>
                        </div>
                        
                        {/* Connection Line */}
                        <div className="flex justify-center">
                          <div className="w-px h-16 bg-gradient-to-b from-primary via-primary/50 to-transparent animate-pulse" />
                        </div>
                        
                        {/* Local Commits */}
                        <div className="flex justify-center gap-3">
                          {[1, 2, 3].map((i) => (
                            <div 
                              key={i}
                              className="size-14 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 flex items-center justify-center"
                              style={{
                                animation: `fadeInUp 0.5s ease-out ${i * 0.2}s both`
                              }}
                            >
                              <span className="text-xs font-mono text-primary">c{i}</span>
                            </div>
                          ))}
                        </div>
                        
                        <div className="text-center text-sm text-muted-foreground font-mono">
                          git push origin main
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/10 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* Step 2 Visual - Framework Detection Animation */}
                <div className={`absolute inset-0 transition-all duration-700 ${
                  activeStep === 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
                }`}>
                  <div className="h-full flex items-center justify-center p-6">
                    <div className="relative w-full">
                      {/* Scanning Effect */}
                      <div className="space-y-6">
                        {/* File Structure */}
                        <div className="space-y-2 font-mono text-xs">
                          {['package.json', 'next.config.js', 'tsconfig.json'].map((file, i) => (
                            <div 
                              key={file}
                              className="flex items-center gap-3 p-2.5 rounded-lg bg-muted/30 border border-muted"
                              style={{
                                animation: `slideInRight 0.4s ease-out ${i * 0.1}s both`
                              }}
                            >
                              <div className="size-2 rounded-full bg-blue-500 animate-pulse" />
                              <span>{file}</span>
                              <Check className="size-3.5 text-green-500 ml-auto" />
                            </div>
                          ))}
                        </div>
                        
                        {/* Detection Result */}
                        <div className="p-5 rounded-xl bg-gradient-to-br from-blue-500/20 via-primary/10 to-transparent border-2 border-blue-500/30 backdrop-blur-sm"
                          style={{
                            animation: 'scaleIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.5s both'
                          }}
                        >
                          <div className="flex items-center gap-4">
                            <div className="size-14 rounded-lg bg-primary/20 flex items-center justify-center">
                              <Code2 className="size-7 text-primary" />
                            </div>
                            <div>
                              <div className="font-bold text-base">Next.js 14</div>
                              <div className="text-xs text-muted-foreground">TypeScript • React 18</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-500/10 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* Step 3 Visual - Environment Variables Animation */}
                <div className={`absolute inset-0 transition-all duration-700 ${
                  activeStep === 2 ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
                }`}>
                  <div className="h-full flex items-center justify-center p-6">
                    <div className="relative w-full">
                      {/* Lock/Security Visualization */}
                      <div className="space-y-5">
                        <div className="flex justify-center"
                          style={{
                            animation: 'bounceIn 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) both'
                          }}
                        >
                          <div className="relative">
                            <div className="size-24 rounded-full bg-gradient-to-br from-purple-500/20 to-purple-500/5 flex items-center justify-center border-3 border-purple-500/30">
                              <Shield className="size-12 text-purple-500" />
                            </div>
                            <div className="absolute inset-0 rounded-full border-3 border-purple-500/20 animate-ping" />
                          </div>
                        </div>
                        
                        {/* Encrypted Variables */}
                        <div className="space-y-2.5">
                          {['DATABASE_URL', 'API_KEY', 'STRIPE_SECRET'].map((env, i) => (
                            <div 
                              key={env}
                              className="flex items-center gap-3 p-3 rounded-lg bg-muted/40 border border-purple-500/20"
                              style={{
                                animation: `fadeInUp 0.5s ease-out ${i * 0.2 + 0.3}s both`
                              }}
                            >
                              <Terminal className="size-3.5 text-purple-500" />
                              <span className="font-mono text-xs flex-1">{env}</span>
                              <div className="flex gap-0.5">
                                {Array(6).fill(0).map((_, j) => (
                                  <div key={j} className="size-1 rounded-full bg-muted-foreground/40" />
                                ))}
                              </div>
                              <Check className="size-3.5 text-green-500" />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-purple-500/10 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* Step 4 Visual - Deployment Progress Animation */}
                <div className={`absolute inset-0 transition-all duration-700 ${
                  activeStep === 3 ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
                }`}>
                  <div className="h-full flex items-center justify-center p-6">
                    <div className="relative w-full">
                      {/* Rocket Launch Visualization */}
                      <div className="space-y-6">
                        <div className="flex justify-center"
                          style={{
                            animation: 'rocketLaunch 2s ease-out both'
                          }}
                        >
                          <div className="relative">
                            <div className="size-24 rounded-full bg-gradient-to-br from-green-500/30 to-primary/20 flex items-center justify-center border-3 border-green-500/40">
                              <Rocket className="size-12 text-green-500" />
                            </div>
                            {/* Exhaust trails */}
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-16 bg-gradient-to-b from-green-500/50 to-transparent animate-pulse" />
                          </div>
                        </div>
                        
                        {/* Status Updates */}
                        <div className="space-y-2.5 font-mono text-xs">
                          {[
                            { text: 'Building...', done: true },
                            { text: 'Deploying to edge...', done: true },
                            { text: 'Configuring CDN...', done: true },
                            { text: 'Going live...', done: false }
                          ].map((status, i) => (
                            <div 
                              key={status.text}
                              className="flex items-center gap-2.5 p-2.5 rounded-lg bg-muted/30"
                              style={{
                                animation: `fadeInLeft 0.5s ease-out ${i * 0.3}s both`
                              }}
                            >
                              {status.done ? (
                                <Check className="size-3.5 text-green-500" />
                              ) : (
                                <div className="size-3.5 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
                              )}
                              <span>{status.text}</span>
                            </div>
                          ))}
                        </div>
                        
                        {/* Success Message */}
                        <div 
                          className="p-5 rounded-xl bg-gradient-to-br from-green-500/20 via-primary/10 to-transparent border-2 border-green-500/30"
                          style={{
                            animation: 'scaleIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 1.2s both'
                          }}
                        >
                          <div className="text-center">
                            <div className="text-base font-bold text-green-500 mb-1.5">🎉 Deployed!</div>
                            <div className="text-xs font-mono text-primary">yourapp.shipoff.dev</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-green-500/10 via-transparent to-transparent pointer-events-none" />
                </div>

                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Version - Traditional Layout */}
          <div className="lg:hidden space-y-16">
            
            {/* Step 1 Mobile */}
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="size-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border-2 border-primary/30 flex items-center justify-center shrink-0">
                  <GitBranch className="size-6 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-bold">Link Repository</h3>
                    <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-1 rounded">01</span>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    Connect your GitHub repository. Grant access and select the repository you want to deploy.
                  </p>
                </div>
              </div>
              
              {/* Visual */}
              <div className="rounded-xl border bg-card/50 backdrop-blur-sm p-6 shadow-lg">
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <div className="size-20 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border-2 border-primary/30 flex items-center justify-center">
                      <GitBranch className="size-10 text-primary" />
                    </div>
                  </div>
                  <div className="flex justify-center gap-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="size-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                        <span className="text-xs font-mono text-primary">c{i}</span>
                      </div>
                    ))}
                  </div>
                  <div className="text-center text-sm text-muted-foreground font-mono">
                    git push origin main
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2 Mobile */}
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="size-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-500/5 border-2 border-blue-500/30 flex items-center justify-center shrink-0">
                  <Code2 className="size-6 text-blue-500" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-bold">Framework Detection</h3>
                    <span className="text-xs font-mono text-blue-500 bg-blue-500/10 px-2 py-1 rounded">02</span>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    Shipoff automatically analyzes your code to determine the language and framework.
                  </p>
                </div>
              </div>
              
              <div className="rounded-xl border bg-card/50 backdrop-blur-sm p-6 shadow-lg">
                <div className="p-4 rounded-lg bg-gradient-to-br from-blue-500/10 to-primary/5 border border-blue-500/20">
                  <div className="flex items-center gap-4">
                    <div className="size-12 rounded-lg bg-primary/20 flex items-center justify-center">
                      <Code2 className="size-6 text-primary" />
                    </div>
                    <div>
                      <div className="font-bold">Next.js 14</div>
                      <div className="text-sm text-muted-foreground">TypeScript • React 18</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3 Mobile */}
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="size-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-500/5 border-2 border-purple-500/30 flex items-center justify-center shrink-0">
                  <Shield className="size-6 text-purple-500" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-bold">Configure Environment</h3>
                    <span className="text-xs font-mono text-purple-500 bg-purple-500/10 px-2 py-1 rounded">03</span>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    Set up your environment variables securely. Add API keys, database URLs, and other secrets.
                  </p>
                </div>
              </div>
              
              <div className="rounded-xl border bg-card/50 backdrop-blur-sm p-6 shadow-lg">
                <div className="flex justify-center mb-4">
                  <div className="size-20 rounded-full bg-gradient-to-br from-purple-500/20 to-purple-500/5 flex items-center justify-center border-2 border-purple-500/30">
                    <Shield className="size-10 text-purple-500" />
                  </div>
                </div>
                <div className="space-y-2">
                  {['DATABASE_URL', 'API_KEY'].map((env) => (
                    <div key={env} className="p-3 rounded-lg bg-muted/40 border border-purple-500/20 font-mono text-xs flex items-center justify-between">
                      <span>{env}</span>
                      <span className="text-muted-foreground">••••••••</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Step 4 Mobile */}
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="size-12 rounded-xl bg-gradient-to-br from-green-500/20 to-green-500/5 border-2 border-green-500/30 flex items-center justify-center shrink-0">
                  <Rocket className="size-6 text-green-500" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-bold">Deploy & Go Live</h3>
                    <span className="text-xs font-mono text-green-500 bg-green-500/10 px-2 py-1 rounded">04</span>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    Hit deploy and watch your application go live in seconds. Automatic SSL, global CDN, and monitoring included.
                  </p>
                </div>
              </div>
              
              <div className="rounded-xl border bg-card/50 backdrop-blur-sm p-6 shadow-lg">
                <div className="flex justify-center mb-4">
                  <div className="size-20 rounded-full bg-gradient-to-br from-green-500/30 to-primary/20 flex items-center justify-center border-2 border-green-500/40">
                    <Rocket className="size-10 text-green-500" />
                  </div>
                </div>
                <div className="space-y-2 font-mono text-sm">
                  <div className="flex items-center gap-3">
                    <Check className="size-4 text-green-500" />
                    <span>Building...</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="size-4 text-green-500" />
                    <span>Deploying to edge...</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="size-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
                    <span className="text-green-500">Going live...</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Frameworks Section */}
      <section id="features" className="py-20 sm:py-32 relative overflow-hidden">
        <div className="absolute inset-0 mesh-gradient opacity-50" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6"
            >
              <Code2 className="size-4 text-primary" />
              <span className="text-sm font-medium text-primary">Zero Configuration</span>
            </motion.div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Deploy Any Framework
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We automatically detect and build your favorite frameworks with optimal configurations
            </p>
          </motion.div>

          {/* Framework Grid */}
          <div className="max-w-5xl mx-auto mb-20">
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-[7.5fr_7.5fr_7.5fr_7.5fr_7.5fr_7.5fr_7.5fr] gap-6">
              {frameworks.map((framework, i) => (
                <motion.div
                  key={framework.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  whileHover={{ scale: 1.1 }}
                  className="group relative aspect-square rounded-2xl border-2 border-border bg-card backdrop-blur-sm p-4 flex flex-col items-center justify-center hover:border-primary hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 cursor-pointer"
                >
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${framework.color} opacity-0 group-hover:opacity-[0.15] transition-opacity`} />
                  <div className="relative">
                    <div className="size-10 sm:size-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform group-hover:from-primary/30 group-hover:to-primary/20">
                      <img 
                        src={`https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${framework.tag}/${framework.icon}.svg`}
                        alt={framework.name}
                        className="size-5 sm:size-6 brightness-0 saturate-0 opacity-70 group-hover:opacity-100 transition-opacity"
                        style={{ filter: 'invert(57%) sepia(91%) saturate(439%) hue-rotate(95deg) brightness(95%) contrast(89%)' }}
                        onError={(e) => {
                          e.currentTarget.src = `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${framework.icon}/${framework.icon}-plain.svg`;
                        }}
                      />
                    </div>
                    <div className="text-xs sm:text-sm font-semibold text-center text-foreground">{framework.name}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Features in Unconventional Layout */}
          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            
            {/* Feature 1 - Large */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-2 group relative rounded-3xl border-2 border-border bg-card backdrop-blur-xl p-8 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10 transition-all duration-500"
            >
              <div className="absolute top-8 right-8 size-32 rounded-full bg-primary/10 blur-3xl group-hover:bg-primary/20 transition-all" />
              <div className="relative">
                <GitBranch className="size-12 text-primary mb-4" />
                <h3 className="text-2xl font-bold mb-3">Git-Powered Deployments</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Connect your repository once, and every push automatically triggers a new deployment. Support for GitHub, GitLab, and Bitbucket with branch previews and pull request deployments.
                </p>
                <div className="flex flex-wrap gap-2">
                  {['Auto Deploy', 'PR Previews', 'Rollbacks'].map((tag) => (
                    <span key={tag} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Feature 2 - Small */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="group relative rounded-3xl border-2 border-border bg-gradient-to-br from-blue-500/10 to-blue-500/5 backdrop-blur-xl p-8 hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-500"
            >
              <Rocket className="size-10 text-blue-500 mb-4" />
              <h3 className="text-xl font-bold mb-3">Edge Network</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Deploy to our global edge network for ultra-low latency worldwide.
              </p>
            </motion.div>

            {/* Feature 3 - Small */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ scale: 1.05 }}
              className="group relative rounded-3xl border-2 border-border bg-gradient-to-br from-purple-500/10 to-purple-500/5 backdrop-blur-xl p-8 hover:border-purple-500/50 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-500"
            >
              <Terminal className="size-10 text-purple-500 mb-4" />
              <h3 className="text-xl font-bold mb-3">Environment Variables</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Securely manage secrets across all environments with encryption.
              </p>
            </motion.div>

            {/* Feature 4 - Large */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="lg:col-span-2 group relative rounded-3xl border-2 border-border bg-gradient-to-br from-green-500/10 to-green-500/5 backdrop-blur-xl p-8 hover:border-green-500/50 hover:shadow-xl hover:shadow-green-500/10 transition-all duration-500"
            >
              <Globe className="size-12 text-green-500 mb-4" />
              <h3 className="text-2xl font-bold mb-3">Custom Domains & SSL</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Add unlimited custom domains with automatic SSL certificates. DNS configuration is handled automatically, and certificates renew without any action required.
              </p>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="size-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-muted-foreground">Auto SSL</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="size-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-muted-foreground">DNS Management</span>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Benefits Section - Improved */}
      <section id="benefits" className="py-20 sm:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-muted/50 via-background to-background" />
        <div className="absolute top-1/4 left-1/4 size-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 size-96 bg-blue-500/5 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Focus on <span className="text-primary">building</span>,
              <br />
              we handle the rest
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Ship features faster while we take care of infrastructure, scaling, and security
            </p>
          </motion.div>

          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8 mb-8">
              
              {/* Large Feature Card */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
                className="lg:row-span-2 group relative rounded-3xl border-2 border-border bg-card backdrop-blur-xl p-10 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10 transition-all duration-500 overflow-hidden"
              >
                <div className="absolute -top-24 -right-24 size-48 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/15" />
                <div className="relative">
                  <div className="size-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-6">
                    <Shield className="size-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Enterprise Security</h3>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    SOC 2 Type II compliant infrastructure with automatic SSL certificates, DDoS protection, and continuous security monitoring. Your data is encrypted at rest and in transit.
                  </p>
                  
                  <div className="space-y-3">
                    {[
                      { label: 'Automatic SSL', status: 'Active' },
                      { label: 'DDoS Protection', status: 'Enabled' },
                      { label: 'Security Audits', status: 'Passed' },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <span className="text-sm font-medium">{item.label}</span>
                        <div className="flex items-center gap-2">
                          <div className="size-2 rounded-full bg-green-500 animate-pulse" />
                          <span className="text-xs text-green-500">{item.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Medium Feature Card */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.1 }}
                whileHover={{ y: -4 }}
                className="group relative rounded-3xl border-2 border-border bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent backdrop-blur-xl p-8 hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-500"
              >
                <Cloud className="size-12 text-blue-500 mb-4" />
                <h3 className="text-xl font-bold mb-3">Global Edge Network</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Deploy to 200+ locations worldwide. Your content is automatically distributed to the edge for lightning-fast performance.
                </p>
                <div className="mt-4 flex items-center gap-2 text-xs text-blue-500">
                  <span className="font-mono">~50ms</span>
                  <span className="text-muted-foreground">average latency</span>
                </div>
              </motion.div>

              {/* Medium Feature Card */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.2 }}
                whileHover={{ y: -4 }}
                className="group relative rounded-3xl border-2 border-border bg-gradient-to-br from-green-500/10 via-green-500/5 to-transparent backdrop-blur-xl p-8 hover:border-green-500/50 hover:shadow-xl hover:shadow-green-500/10 transition-all duration-500"
              >
                <Activity className="size-12 text-green-500 mb-4" />
                <h3 className="text-xl font-bold mb-3">99.99% Uptime SLA</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Reliable infrastructure with automatic failover, health checks, and real-time monitoring. Your apps stay online.
                </p>
                <div className="mt-4 flex items-center gap-2 text-xs text-green-500">
                  <div className="size-2 rounded-full bg-green-500 animate-pulse" />
                  <span>All systems operational</span>
                </div>
              </motion.div>

            </div>

            {/* Bottom Full Width Card */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="group relative rounded-3xl border-2 border-border bg-card backdrop-blur-xl p-8 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10 transition-all duration-500"
            >
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <Layers className="size-10 text-primary" />
                    <h3 className="text-2xl font-bold">Collaborative Development</h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Invite your team, manage permissions, and collaborate seamlessly. Every PR gets its own preview deployment for better code reviews.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {['Team Management', 'PR Previews', 'Role-based Access', 'Audit Logs'].map((feature) => (
                      <span key={feature} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="relative">
                  <div className="flex -space-x-3">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="size-12 rounded-full border-2 border-background bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center font-bold text-primary"
                      >
                        {i}
                      </div>
                    ))}
                    <div className="size-12 rounded-full border-2 border-background bg-muted flex items-center justify-center text-xs font-bold">
                      +12
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 sm:py-20 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">
              Simple Pricing
            </h2>
            <p className="text-sm text-muted-foreground">
              Start for free, upgrade as you grow
            </p>
          </motion.div>

          {/* Pricing Cards Grid - Ready for multiple tiers */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            
            {/* Free Tier Card */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{ y: -8 }}
              className="relative group rounded-2xl border-2 border-primary/50 bg-card p-6 hover:border-primary hover:shadow-lg hover:shadow-primary/10 transition-all"
            >
              {/* Popular badge */}
              <div className="absolute -top-2.5 left-1/2 -translate-x-1/2">
                <div className="px-3 py-0.5 rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                  Popular
                </div>
              </div>

              <div className="text-center mb-5 mt-1">
                <h3 className="text-lg font-bold mb-1">Free</h3>
                <div className="flex items-baseline justify-center gap-1 mb-2">
                  <span className="text-3xl font-bold">$0</span>
                  <span className="text-xs text-muted-foreground">/month</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  For personal projects
                </p>
              </div>

              {/* Compact Features List */}
              <div className="space-y-3 mb-5">
                <div>
                  <div className="flex items-center gap-2 text-sm font-medium mb-0.5">
                    <Check className="size-4 text-primary shrink-0" />
                    <span>4 Static Projects</span>
                  </div>
                  <p className="text-xs text-muted-foreground ml-6">Deploy React, Vue, Next.js static exports, and more</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-sm font-medium mb-0.5">
                    <Check className="size-4 text-primary shrink-0" />
                    <span>1 Dynamic Project</span>
                  </div>
                  <p className="text-xs text-muted-foreground ml-6">Full-stack apps with server-side rendering and APIs</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-sm font-medium mb-0.5">
                    <Check className="size-4 text-primary shrink-0" />
                    <span>On-Demand Scaling</span>
                  </div>
                  <p className="text-xs text-muted-foreground ml-6">Automatically scales based on traffic</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-sm font-medium mb-0.5">
                    <Check className="size-4 text-primary shrink-0" />
                    <span>Always-Up Static Sites</span>
                  </div>
                  <p className="text-xs text-muted-foreground ml-6">Static sites never sleep, available 24/7</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-sm font-medium mb-0.5">
                    <Check className="size-4 text-primary shrink-0" />
                    <span>24hr Log Retention</span>
                  </div>
                  <p className="text-xs text-muted-foreground ml-6">Extend with persistent storage add-on</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-sm font-medium mb-0.5">
                    <Check className="size-4 text-primary shrink-0" />
                    <span>Global CDN</span>
                  </div>
                  <p className="text-xs text-muted-foreground ml-6">200+ edge locations worldwide</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-sm font-medium mb-0.5">
                    <Check className="size-4 text-primary shrink-0" />
                    <span>DDoS Protection</span>
                  </div>
                  <p className="text-xs text-muted-foreground ml-6">Enterprise-grade security included</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-sm font-medium mb-0.5">
                    <Check className="size-4 text-primary shrink-0" />
                    <span>Automatic SSL</span>
                  </div>
                  <p className="text-xs text-muted-foreground ml-6">Free certificates that auto-renew</p>
                </div>
              </div>

              {/* CTA Button */}
              <Link href="/login" className="block">
                <Button className="w-full gap-2 group">
                  Get Started
                  <ArrowRight className="size-3.5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>

            {/* Pro Tier - Coming Soon */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 0.6, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative rounded-2xl border-2 border-border bg-card/50 p-6"
            >
              <div className="absolute top-3 right-3">
                <span className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-xs font-medium">
                  Coming Soon
                </span>
              </div>

              <div className="text-center mb-5">
                <h3 className="text-lg font-bold mb-1">Pro</h3>
                <div className="flex items-baseline justify-center gap-1 mb-2">
                  <span className="text-3xl font-bold">$19</span>
                  <span className="text-xs text-muted-foreground">/month</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  For growing teams
                </p>
              </div>

              <div className="space-y-3 mb-5 text-muted-foreground">
                <div>
                  <div className="flex items-center gap-2 text-sm font-medium mb-0.5">
                    <Check className="size-4 shrink-0" />
                    <span>Unlimited Projects</span>
                  </div>
                  <p className="text-xs ml-6">Deploy as many projects as you need</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-sm font-medium mb-0.5">
                    <Check className="size-4 shrink-0" />
                    <span>Priority Support</span>
                  </div>
                  <p className="text-xs ml-6">Faster response times from our team</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-sm font-medium mb-0.5">
                    <Check className="size-4 shrink-0" />
                    <span>Advanced Analytics</span>
                  </div>
                  <p className="text-xs ml-6">Detailed traffic and performance insights</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-sm font-medium mb-0.5">
                    <Check className="size-4 shrink-0" />
                    <span>Custom Domains</span>
                  </div>
                  <p className="text-xs ml-6">Unlimited domains with automatic DNS</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-sm font-medium mb-0.5">
                    <Check className="size-4 shrink-0" />
                    <span>Everything in Free</span>
                  </div>
                  <p className="text-xs ml-6">All Free tier features included</p>
                </div>
              </div>

              <Button className="w-full" disabled>
                Coming Soon
              </Button>
            </motion.div>

            {/* Team Tier - Coming Soon */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 0.6, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="relative rounded-2xl border-2 border-border bg-card/50 p-6"
            >
              <div className="absolute top-3 right-3">
                <span className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-xs font-medium">
                  Coming Soon
                </span>
              </div>

              <div className="text-center mb-5">
                <h3 className="text-lg font-bold mb-1">Team</h3>
                <div className="flex items-baseline justify-center gap-1 mb-2">
                  <span className="text-3xl font-bold">$49</span>
                  <span className="text-xs text-muted-foreground">/month</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  For enterprises
                </p>
              </div>

              <div className="space-y-3 mb-5 text-muted-foreground">
                <div>
                  <div className="flex items-center gap-2 text-sm font-medium mb-0.5">
                    <Check className="size-4 shrink-0" />
                    <span>Team Collaboration</span>
                  </div>
                  <p className="text-xs ml-6">Invite members and manage roles</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-sm font-medium mb-0.5">
                    <Check className="size-4 shrink-0" />
                    <span>SSO & SAML</span>
                  </div>
                  <p className="text-xs ml-6">Secure single sign-on integration</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-sm font-medium mb-0.5">
                    <Check className="size-4 shrink-0" />
                    <span>Audit Logs</span>
                  </div>
                  <p className="text-xs ml-6">Track actions for compliance</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-sm font-medium mb-0.5">
                    <Check className="size-4 shrink-0" />
                    <span>SLA Guarantee</span>
                  </div>
                  <p className="text-xs ml-6">99.99% uptime with financial credits</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-sm font-medium mb-0.5">
                    <Check className="size-4 shrink-0" />
                    <span>Everything in Pro</span>
                  </div>
                  <p className="text-xs ml-6">All Pro tier features included</p>
                </div>
              </div>

              <Button className="w-full" disabled>
                Coming Soon
              </Button>
            </motion.div>

          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 sm:py-32 relative overflow-hidden">
        <div className="absolute inset-0 landing-gradient opacity-30" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="relative rounded-3xl border border-primary/20 bg-card/50 backdrop-blur-xl p-12 sm:p-16 text-center overflow-hidden"
          >
            <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl" />
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
                Ready to ship faster?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join thousands of developers deploying their applications with Shipoff
              </p>
              <Link href="/login">
                <Button size="lg" className="gap-2 group px-8 h-12 text-base shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all">
                  Get Started for Free
                  <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#features" className="hover:text-foreground transition-colors">Features</Link></li>
                <li><Link href="#pricing" className="hover:text-foreground transition-colors">Pricing</Link></li>
                <li><Link href="/dashboard/overview" className="hover:text-foreground transition-colors">Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground transition-colors">Documentation</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">API Reference</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Guides</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground transition-colors">About</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Blog</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Careers</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground transition-colors">Privacy</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Terms</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Security</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Box className="size-6 text-primary" />
              <span className="font-semibold">Shipoff</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 Shipoff. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}