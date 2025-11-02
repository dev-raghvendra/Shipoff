"use client"

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowRight, Check } from 'lucide-react'

export function PricingSection() {
  return (
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
              <div>
                <div className="flex items-center gap-2 text-sm font-medium mb-0.5">
                  <Check className="size-4 text-primary shrink-0" />
                  <span>512MB Memory & 0.1 CPU</span>
                </div>
                <p className="text-xs text-muted-foreground ml-6">Per project with auto-scaling</p>
              </div>
            </div>

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
  )
}

