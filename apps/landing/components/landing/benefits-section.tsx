"use client"

import { motion } from 'framer-motion'
import { Shield, Cloud, Activity, Layers } from 'lucide-react'

export function BenefitsSection() {
  return (
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
  )
}

