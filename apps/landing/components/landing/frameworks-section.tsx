"use client"

import { motion } from 'framer-motion'
import { Code2, GitBranch, Rocket, Terminal, Globe } from 'lucide-react'

const frameworks = [
  {name: "Next.js", tag: "nextjs", icon: "nextjs-plain", color: "from-green-500 to-green-600"},
  {name: "React", tag: "react", icon: "react-original", color: "from-green-500 to-green-600"},
  {name: "Vue", tag: "vuejs", icon: "vuejs-plain", color: "from-green-500 to-green-600"},
  {name: "Angular", tag: "angularjs", icon: "angularjs-plain", color: "from-green-500 to-green-600"},
  {name: "Svelte", tag: "svelte", icon: "svelte-plain", color: "from-green-500 to-green-600"},
  {name: "Nuxt", tag: "nuxtjs", icon: "nuxtjs-plain", color: "from-green-600 to-green-700"},
  {name: "Express", tag: "express", icon: "express-original", color: "from-green-500 to-green-600"},
  {name: "Nest.js", tag: "nestjs", icon: "nestjs-original", color: "from-green-500 to-green-600"},
  {name: "Django", tag: "django", icon: "django-plain", color: "from-green-700 to-green-800"},
  {name: "Flask", tag: "flask", icon: "flask-original", color: "from-green-500 to-green-600"},
  {name: "Laravel", tag: "laravel", icon: "laravel-original", color: "from-green-500 to-green-600"},
  {name: "FastAPI", tag: "fastapi", icon: "fastapi-plain", color: "from-green-500 to-green-600"},
  {name: "Vite", tag: "vite", icon: "vite-original", color: "from-green-500 to-green-600"},
  {name: "Fastify", tag: "fastify", icon: "fastify-original", color: "from-green-500 to-green-600"},
]

export function FrameworksSection() {
  return (
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
  )
}

