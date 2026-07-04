"use client"

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Zap, Shield, Activity, Bot, Terminal, Check, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import { CONFIG } from '@/app/config/config'

const agentSteps = [
  { label: 'createProject', status: 'done' as const },
  { label: 'redeployDeployment', status: 'done' as const },
  { label: 'monitorDeployment', status: 'active' as const },
]

export function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 sm:pt-36 sm:pb-28 overflow-hidden min-h-[92vh] flex items-center">
      <div className="absolute inset-0 landing-gradient" />
      <div className="absolute -left-1/4 bottom-0 translate-y-1/4 w-[900px] h-[900px] hero-orb-gradient" />
      <div className="absolute -right-1/4 -top-1/4 w-[700px] h-[700px] accent-orb" />
      <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-violet-500/10 rounded-full blur-[120px] -translate-y-1/2" />
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]" />
      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="gap-12 lg:gap-16 items-center max-w-6xl mx-auto">
          {/* Left — copy */}
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 backdrop-blur-sm mb-6 text-sm hover:border-primary/30 transition-colors"
            >
              <span className="p-1 px-2 text-xs font-semibold rounded-full bg-orange-500 text-primary-foreground">
                Y
              </span>
              <span className="text-foreground/80">Not backed by Y Combinator</span>
              <ArrowRight className="size-3.5 text-primary" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight mb-6 leading-[1.08]"
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
              className="text-lg sm:text-xl mt-10 text-muted-foreground mb-8 max-w-xl mx-auto  leading-relaxed"
            >
              Push code. Ship products. Scale effortlessly.
              The fastest way from localhost to production.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-center gap-3 mb-10"
            >
              <Link href="https://console.shipoff.in/signin">
                <Button size="lg" className="gap-2 group px-8 h-12 text-base shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all w-full sm:w-auto">
                  Create your first project
                  <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-wrap items-center justify-center  gap-5 sm:gap-7 text-sm text-muted-foreground"
            >
              {[
                { icon: Activity, color: 'text-green-500', text: '99.9% Uptime' },
                { icon: Shield, color: 'text-blue-500', text: 'Enterprise Security' },
                { icon: Zap, color: 'text-yellow-500', text: 'Instant Deployment' },
              ].map((item, i) => (
                <motion.div
                  key={item.text}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.7 + i * 0.1 }}
                  className="flex items-center gap-2"
                >
                  <item.icon className={`size-4 ${item.color}`} />
                  <span>{item.text}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Right — MCP agent panel */}
          {/* <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="relative mx-auto w-full max-w-md lg:max-w-none"
          >
            <div className="absolute -inset-4 bg-gradient-to-br from-violet-500/20 via-primary/10 to-transparent rounded-[2rem] blur-2xl" />

            <div className="relative rounded-2xl border border-violet-500/20 bg-card/70 backdrop-blur-xl shadow-2xl shadow-violet-500/10 overflow-hidden"> */}
              {/* Window chrome */}
              {/* <div className="flex items-center justify-between px-4 py-3 border-b border-border/60 bg-muted/30">
                <div className="flex items-center gap-2">
                  <div className="size-2.5 rounded-full bg-red-400/80" />
                  <div className="size-2.5 rounded-full bg-yellow-400/80" />
                  <div className="size-2.5 rounded-full bg-green-400/80" />
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
                  <Sparkles className="size-3 text-violet-500" />
                  mcp.shipoff.in
                </div>
                <div className="size-6" />
              </div> */}

              <div className="p-5 space-y-4">
                {/* Agent prompt */}
                {/* <div className="flex gap-3">
                  <div className="size-8 rounded-lg bg-violet-500/15 flex items-center justify-center shrink-0">
                    <Bot className="size-4 text-violet-500" />
                  </div>
                  <div className="flex-1 rounded-xl rounded-tl-sm bg-violet-500/10 border border-violet-500/15 px-3.5 py-2.5 text-sm text-foreground/90">
                    Deploy my Next.js app to Shipoff and watch the build.
                  </div>
                </div> */}

                {/* Tool calls */}
                {/* <div className="rounded-xl border border-border/60 bg-muted/25 p-3.5 space-y-2.5">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Terminal className="size-3.5 text-violet-500" />
                    <span className="font-medium">MCP tools</span>
                  </div>
                  {agentSteps.map((step, i) => (
                    <motion.div
                      key={step.label}
                      initial={{ opacity: 0, x: 8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.35, delay: 0.9 + i * 0.15 }}
                      className="flex items-center justify-between gap-3 px-3 py-2 rounded-lg bg-background/60 border border-border/50 font-mono text-xs"
                    >
                      <code className="text-primary">{step.label}</code>
                      {step.status === 'done' ? (
                        <span className="flex items-center gap-1 text-green-500">
                          <Check className="size-3" />
                          done
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-violet-500">
                          <span className="size-2 rounded-full bg-violet-500 animate-pulse" />
                          running
                        </span>
                      )}
                    </motion.div>
                  ))}
                </div> */}

                {/* Live status */}
                {/* <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.4 }}
                  className="flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl bg-green-500/10 border border-green-500/20"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="size-2 rounded-full bg-green-500 animate-pulse shrink-0" />
                    <span className="text-xs font-mono text-green-600 dark:text-green-400 truncate">
                      my-app.shipoff.dev
                    </span>
                  </div>
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-green-500 shrink-0">
                    Live
                  </span>
                </motion.div> */}
              </div>

              {/* Endpoint strip */}
              {/* <div className="px-5 py-3 border-t border-border/60 bg-muted/20 flex items-center justify-between gap-2 text-xs">
                <span className="text-muted-foreground">MCP endpoint</span>
                <code className="font-mono text-violet-500 truncate">{CONFIG.MCP_URL.replace('https://', '')}</code>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
              className="absolute -bottom-3 -left-3 sm:-left-6 px-3 py-1.5 rounded-full border border-violet-500/25 bg-background/90 backdrop-blur text-xs font-medium shadow-lg"
            >
              <span className="text-violet-500">NEW</span>
              <span className="text-muted-foreground ml-1.5">AI workflow support</span>
            </motion.div>
          </motion.div> */}
        </div>
      </div>
    </section>
  )
}
