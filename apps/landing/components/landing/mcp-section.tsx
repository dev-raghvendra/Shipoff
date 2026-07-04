"use client"

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Bot, Terminal, Shield, ArrowRight, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CONFIG } from '@/app/config/config'

const tools = [
  { name: 'createProject', description: 'Create and configure a new project' },
  { name: 'redeployDeployment', description: 'Trigger a fresh deployment' },
  { name: 'monitorDeployment', description: 'Watch status and logs in real time' },
  { name: 'deleteDeployment', description: 'Remove a specific deployment' },
  { name: 'deleteProject', description: 'Delete a project and its resources' },
]

const resources = [
  'Projects',
  'Deployments',
  'Frameworks',
  'GitHub repos',
  'Domains',
]

const clients = ['Cursor', 'Claude Desktop', 'Claude Code', 'Codex CLI', 'Custom agents']

export function McpSection() {
  return (
    <section id="mcp" className="py-20 sm:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-violet-500/5 to-background" />
      <div className="absolute top-1/3 -left-32 size-96 bg-violet-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -right-32 size-96 bg-primary/10 rounded-full blur-3xl" />

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
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 mb-6"
          >
            <Sparkles className="size-4 text-violet-500" />
            <span className="text-sm font-medium text-violet-500">Model Context Protocol</span>
          </motion.div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Deploy with <span className="text-primary">AI agents</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Shipoff exposes a native MCP server so your AI assistant can create projects,
            trigger deployments, and monitor production—all from your editor or agent workflow.
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl border-2 border-border bg-card/80 backdrop-blur-xl p-8 hover:border-violet-500/40 transition-all duration-500"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="size-12 rounded-xl bg-violet-500/10 flex items-center justify-center">
                <Bot className="size-6 text-violet-500" />
              </div>
              <div>
                <h3 className="text-xl font-bold">MCP Tools</h3>
                <p className="text-sm text-muted-foreground">Let agents act on your behalf</p>
              </div>
            </div>
            <div className="space-y-3">
              {tools.map((tool, i) => (
                <motion.div
                  key={tool.name}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  className="flex items-start gap-3 p-3 rounded-xl bg-muted/40 border border-border/60"
                >
                  <Terminal className="size-4 text-violet-500 mt-0.5 shrink-0" />
                  <div>
                    <code className="text-sm font-semibold text-primary">{tool.name}</code>
                    <p className="text-xs text-muted-foreground mt-0.5">{tool.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="rounded-3xl border-2 border-border bg-gradient-to-br from-primary/10 via-primary/5 to-transparent backdrop-blur-xl p-8 hover:border-primary/40 transition-all duration-500"
            >
              <h3 className="text-xl font-bold mb-4">Readable context</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Agents pull live account context through MCP resources before taking action.
              </p>
              <div className="flex flex-wrap gap-2">
                {resources.map((resource) => (
                  <span
                    key={resource}
                    className="px-3 py-1.5 rounded-full bg-background/60 border border-border text-xs font-medium"
                  >
                    {resource}
                  </span>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="rounded-3xl border-2 border-border bg-card/80 backdrop-blur-xl p-8 hover:border-green-500/40 transition-all duration-500"
            >
              <div className="flex items-center gap-3 mb-4">
                <Shield className="size-6 text-green-500" />
                <h3 className="text-xl font-bold">Secure by default</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                OAuth 2.1 with dynamic client registration for supported clients. Agents without OAuth
                can authenticate with a personal access token from your dashboard.
              </p>
              <div className="p-4 rounded-xl bg-muted/50 border border-green-500/20 font-mono text-xs overflow-x-auto">
                <div className="text-muted-foreground mb-1"># MCP endpoint</div>
                <div className="text-primary">{CONFIG.MCP_URL}</div>
              </div>
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="max-w-4xl mx-auto rounded-3xl border border-violet-500/20 bg-card/50 backdrop-blur-xl p-8 sm:p-10 text-center"
        >
          <p className="text-sm text-muted-foreground mb-4">Works with</p>
          <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
            {clients.map((client) => (
              <span
                key={client}
                className="px-4 py-2 rounded-full border border-violet-500/20 bg-violet-500/5 text-sm font-medium"
              >
                {client}
              </span>
            ))}
          </div>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Connect your MCP client, authorize once, and let AI handle the deploy loop—from
            project setup to monitoring production.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/docs#mcp">
              <Button variant="outline" size="lg" className="gap-2 px-8 h-12">
                MCP setup guide
                <ArrowRight className="size-4" />
              </Button>
            </Link>
            <Link href="/docs#mcp">
              <Button size="lg" className="gap-2 px-8 h-12 shadow-lg shadow-primary/20">
                Connect your agent
                <ArrowRight className="size-4" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
