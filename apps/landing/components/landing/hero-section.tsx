"use client"

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Zap, Shield, Activity } from 'lucide-react'
import { motion } from 'framer-motion'

export function HeroSection() {
  return (
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
            <Link href="https://console.shipoff.in/signin">
              <Button size="lg" className="gap-2 group px-8 h-12 text-base shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all">
                Create your first project
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
  )
}

