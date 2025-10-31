"use client"

import { useEffect, useState, useRef } from 'react'
import { GitBranch, Code2, Shield, Rocket, Terminal, Check } from 'lucide-react'

export function HowItWorksSection() {
  const [activeStep, setActiveStep] = useState(0)
  const stepsRef = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const handleScroll = () => {
      const scrollTriggers = stepsRef.current.filter(el => el !== null)
      
      scrollTriggers.forEach((trigger, index) => {
        if (trigger) {
          const rect = trigger.getBoundingClientRect()
          const windowHeight = window.innerHeight
          
          if (rect.top < windowHeight / 2 && rect.bottom > windowHeight / 2) {
            setActiveStep(index)
          }
        }
      })
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const steps = [
    {
      icon: GitBranch,
      title: "Link Repository",
      step: 1,
      description: "Connect your GitHub repository. Grant access and select the repository you want to deploy.",
      color: "primary",
      terminal: "$ git push origin main"
    },
    {
      icon: Code2,
      title: "Framework Detection",
      step: 2,
      description: "Shipoff automatically analyzes your code to determine the language and framework. No configuration files needed.",
      color: "blue",
      framework: "Next.js 14"
    },
    {
      icon: Shield,
      title: "Configure Environment",
      step: 3,
      description: "Set up your environment variables securely. Add API keys, database URLs, and other secrets.",
      color: "purple",
      envVars: ['DATABASE_URL', 'API_KEY']
    },
    {
      icon: Rocket,
      title: "Deploy & Go Live",
      step: 4,
      description: "Hit deploy and watch your application go live in seconds. Automatic SSL, global CDN, and monitoring included.",
      color: "green",
      statuses: [
        { text: 'Building...', done: true },
        { text: 'Deploying to edge...', done: true },
        { text: 'Going live...', done: false }
      ]
    }
  ]

  return (
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
          {steps.map((_, index) => (
            <div 
              key={index}
              ref={(el) => { stepsRef.current[index] = el }} 
              className="absolute left-0 right-0" 
              style={{ top: `${index * 600}px`, height: '600px' }} 
            />
          ))}
          
          <div className="sticky top-32">
            <div className="grid grid-cols-[1fr_0.8fr] gap-16 items-start h-[550px] max-w-6xl mx-auto pt-12">
              {/* Left Side - Transitioning Text Content */}
              <div className="relative h-full flex items-start">
                <div className="w-full relative">
                  {steps.map((step, index) => (
                    <div 
                      key={index}
                      className={`absolute inset-0 transition-all duration-700 ${
                        activeStep === index ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`size-14 rounded-2xl border-2 flex items-center justify-center shrink-0 ${
                          step.color === 'primary' ? 'bg-gradient-to-br from-primary/20 to-primary/5 border-primary/30' :
                          step.color === 'blue' ? 'bg-gradient-to-br from-blue-500/20 to-blue-500/5 border-blue-500/30' :
                          step.color === 'purple' ? 'bg-gradient-to-br from-purple-500/20 to-purple-500/5 border-purple-500/30' :
                          'bg-gradient-to-br from-green-500/20 to-green-500/5 border-green-500/30'
                        }`}>
                          <step.icon className={`size-7 ${
                            step.color === 'primary' ? 'text-primary' :
                            step.color === 'blue' ? 'text-blue-500' :
                            step.color === 'purple' ? 'text-purple-500' :
                            'text-green-500'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <h3 className="text-2xl font-bold">{step.title}</h3>
                            <span className={`text-xs font-mono px-2 py-1 rounded ${
                              step.color === 'primary' ? 'text-primary bg-primary/10' :
                              step.color === 'blue' ? 'text-blue-500 bg-blue-500/10' :
                              step.color === 'purple' ? 'text-purple-500 bg-purple-500/10' :
                              'text-green-500 bg-green-500/10'
                            }`}>
                              Step {step.step}
                            </span>
                          </div>
                          <p className="text-muted-foreground leading-relaxed text-lg mb-6">
                            {step.description}
                          </p>
                          {/* Step-specific content */}
                          {step.terminal && (
                            <div className="p-5 rounded-xl bg-muted/50 border-2 border-primary/20 font-mono text-sm">
                              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                                <Terminal className="size-4" />
                                <span className="text-xs">Terminal</span>
                              </div>
                              <div><span className="text-primary">$</span> {step.terminal}</div>
                            </div>
                          )}
                          {step.framework && (
                            <div className="p-5 rounded-xl bg-gradient-to-br from-blue-500/10 to-primary/5 border-2 border-blue-500/20">
                              <div className="flex items-center gap-4">
                                <div className="size-12 rounded-xl bg-primary/20 flex items-center justify-center">
                                  <Code2 className="size-6 text-primary" />
                                </div>
                                <div>
                                  <div className="font-bold text-lg">{step.framework}</div>
                                  <div className="text-sm text-muted-foreground">TypeScript • React 18</div>
                                </div>
                              </div>
                            </div>
                          )}
                          {step.envVars && (
                            <div className="space-y-3">
                              {step.envVars.map((env) => (
                                <div key={env} className="p-4 rounded-xl bg-muted/40 border-2 border-purple-500/20 font-mono text-sm flex items-center justify-between">
                                  <span className="font-semibold">{env}</span>
                                  <span className="text-muted-foreground">••••••••</span>
                                </div>
                              ))}
                            </div>
                          )}
                          {step.statuses && (
                            <div className="p-5 rounded-xl bg-muted/50 border-2 border-green-500/20">
                              <div className="space-y-3 font-mono text-sm">
                                {step.statuses.map((status, i) => (
                                  <div key={i} className="flex items-center gap-3">
                                    {status.done ? (
                                      <Check className="size-4 text-green-500" />
                                    ) : (
                                      <div className="size-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
                                    )}
                                    <span className={status.done ? '' : 'text-green-500 font-semibold'}>{status.text}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
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
                            <div className="size-24 rounded-full bg-gradient-to-br from-purple-500/20 to-purple-500/5 flex items-center justify-center border-2 border-purple-500/30">
                              <Shield className="size-12 text-purple-500" />
                            </div>
                            <div className="absolute inset-0 rounded-full border-2 border-purple-500/20 animate-ping" />
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
                            <div className="size-24 rounded-full bg-gradient-to-br from-green-500/30 to-primary/20 flex items-center justify-center border-2 border-green-500/40">
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

        {/* Mobile Version */}
        <div className="lg:hidden space-y-16">
          {steps.map((step, index) => (
            <div key={index} className="space-y-6">
              <div className="flex items-start gap-4">
                <div className={`size-12 rounded-xl border-2 flex items-center justify-center shrink-0 ${
                  step.color === 'primary' ? 'bg-gradient-to-br from-primary/20 to-primary/5 border-primary/30' :
                  step.color === 'blue' ? 'bg-gradient-to-br from-blue-500/20 to-blue-500/5 border-blue-500/30' :
                  step.color === 'purple' ? 'bg-gradient-to-br from-purple-500/20 to-purple-500/5 border-purple-500/30' :
                  'bg-gradient-to-br from-green-500/20 to-green-500/5 border-green-500/30'
                }`}>
                  <step.icon className={`size-6 ${
                    step.color === 'primary' ? 'text-primary' :
                    step.color === 'blue' ? 'text-blue-500' :
                    step.color === 'purple' ? 'text-purple-500' :
                    'text-green-500'
                  }`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-bold">{step.title}</h3>
                    <span className={`text-xs font-mono px-2 py-1 rounded ${
                      step.color === 'primary' ? 'text-primary bg-primary/10' :
                      step.color === 'blue' ? 'text-blue-500 bg-blue-500/10' :
                      step.color === 'purple' ? 'text-purple-500 bg-purple-500/10' :
                      'text-green-500 bg-green-500/10'
                    }`}>
                      {String(step.step).padStart(2, '0')}
                    </span>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

