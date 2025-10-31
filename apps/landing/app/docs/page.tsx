'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import Link from 'next/link'
import { ArrowLeft, Book, Rocket, GitBranch, Code2, Globe, Settings, Users, Zap, Shield, Terminal, Database, AlertCircle, CheckCircle, Search, Menu, X, ChevronRight, Lock, Play, Circle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/ui/logo'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
const frameworks = [
  { name: 'Next.js', type: 'Static/Dynamic', runtime: 'Node.js', build: 'npm run build', outDir: '.next' },
  { name: 'React', type: 'Static', runtime: 'Node.js', build: 'npm run build', outDir: 'build' },
  { name: 'Vue', type: 'Static', runtime: 'Node.js', build: 'npm run build', outDir: 'dist' },
  { name: 'Vite', type: 'Static', runtime: 'Node.js', build: 'npm run build', outDir: 'dist' },
  { name: 'Express', type: 'Dynamic', runtime: 'Node.js', build: 'npm install', outDir: 'N/A' },
  { name: 'Nest.js', type: 'Dynamic', runtime: 'Node.js', build: 'npm run build', outDir: 'dist' },
  { name: 'Fastify', type: 'Dynamic', runtime: 'Node.js', build: 'npm install', outDir: 'N/A' },
  { name: 'Django', type: 'Dynamic', runtime: 'Python', build: 'pip install -r requirements.txt', outDir: 'staticfiles' },
  { name: 'Flask', type: 'Dynamic', runtime: 'Python', build: 'pip install -r requirements.txt', outDir: 'N/A' },
  { name: 'FastAPI', type: 'Dynamic', runtime: 'Python', build: 'pip install -r requirements.txt', outDir: 'N/A' },
  { name: 'Laravel', type: 'Dynamic', runtime: 'PHP', build: 'composer install', outDir: 'public' },
  { name: 'Symfony', type: 'Dynamic', runtime: 'PHP', build: 'composer install', outDir: 'public' },
]

const deploymentStates = [
  {
    status: 'QUEUED',
    color: 'bg-blue-500',
    description: 'Deployment is waiting in the queue to start',
    canDelete: false,
    canRedeploy: false,
    transitions: ['BUILDING']
  },
  {
    status: 'BUILDING',
    color: 'bg-yellow-500',
    description: 'Build process is currently running',
    canDelete: false,
    canRedeploy: false,
    transitions: ['PROVISIONING', 'FAILED']
  },
  {
    status: 'PROVISIONING',
    color: 'bg-purple-500',
    description: 'Runtime environment is being set up',
    canDelete: false,
    canRedeploy: false,
    transitions: ['PRODUCTION', 'FAILED']
  },
  {
    status: 'PRODUCTION',
    color: 'bg-green-500',
    description: 'Deployment is live and serving traffic',
    canDelete: false,
    canRedeploy: false,
    note: 'Only one PRODUCTION deployment per project. Cannot be deleted.'
  },
  {
    status: 'INACTIVE',
    color: 'bg-gray-500',
    description: 'Deployment completed but is no longer active',
    canDelete: true,
    canRedeploy: true,
    note: 'Stable state - can be deleted or redeployed'
  },
  {
    status: 'FAILED',
    color: 'bg-red-500',
    description: 'Deployment encountered an error',
    canDelete: true,
    canRedeploy: true,
    note: 'Stable state - can be deleted or redeployed'
  },
]

const sections = [
  { id: 'getting-started', title: 'Getting Started', icon: Zap },
  { id: 'projects', title: 'Projects', icon: Code2 },
  { id: 'deployments', title: 'Deployments', icon: Rocket },
  { id: 'deployment-states', title: 'Deployment States', icon: Database },
  { id: 'frameworks', title: 'Frameworks', icon: Code2 },
  { id: 'environment-variables', title: 'Environment Variables', icon: Settings },
  { id: 'teams', title: 'Teams & Collaboration', icon: Users },
  { id: 'troubleshooting', title: 'Troubleshooting', icon: AlertCircle },
]

export default function DocsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('getting-started')
  const [searchMatches, setSearchMatches] = useState<Array<{ sectionId: string; sectionTitle: string; elementId: string; text: string }>>([])
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Search through all content in DOM
  useEffect(() => {
    const query = searchQuery.toLowerCase().trim()
    
    // Clear previous matches
    document.querySelectorAll('[data-search-match]').forEach(el => {
      el.removeAttribute('data-search-match')
      el.removeAttribute('id')
    })

    if (!query) {
      setSearchMatches([])
      return
    }

    const foundMatches: Array<{ sectionId: string; sectionTitle: string; elementId: string; text: string }> = []
    let matchIndex = 0

    sections.forEach(section => {
      const sectionElement = document.getElementById(section.id)
      if (!sectionElement) return

      // Search all text content in the section
      const allElements = sectionElement.querySelectorAll('p, li, span, td, div')
      
      allElements.forEach(element => {
        const text = element.textContent || ''
        if (text.toLowerCase().includes(query) && text.trim().length > 10) {
          const elementId = `search-match-${section.id}-${matchIndex++}`
          
          element.setAttribute('data-search-match', 'true')
          element.setAttribute('id', elementId)
          
          let matchText = text.trim().substring(0, 80)
          if (matchText.length < text.trim().length) matchText += '...'
          
          foundMatches.push({
            sectionId: section.id,
            sectionTitle: section.title,
            elementId: elementId,
            text: matchText
          })
        }
      })
    })

    setSearchMatches(foundMatches)
  }, [searchQuery])

  // Filter sections based on search
  const filteredSections = useMemo(() => {
    if (!searchQuery) return sections
    const query = searchQuery.toLowerCase().trim()
    
    const titleMatches = sections.filter(section => 
      section.title.toLowerCase().includes(query) || 
      section.id.toLowerCase().includes(query)
    )
    
    const contentMatches = sections.filter(section => 
      searchMatches.some(m => m.sectionId === section.id)
    )
    
    // Combine and deduplicate
    const allMatches = [...new Set([...titleMatches, ...contentMatches])]
    return allMatches.length > 0 ? allMatches : sections
  }, [searchQuery, searchMatches])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setActiveSection(sectionId)
      setSidebarOpen(false)
    }
  }

  // Ctrl+K keyboard shortcut handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen(true)
        setTimeout(() => {
          searchInputRef.current?.focus()
        }, 0)
      }
      if (e.key === 'Escape' && searchOpen) {
        setSearchOpen(false)
        setSearchQuery('')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [searchOpen])

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (searchOpen && !target.closest('.search-container')) {
        setSearchOpen(false)
      }
    }

    if (searchOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [searchOpen])

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 150
      const current = sections
        .map(section => {
          const element = document.getElementById(section.id)
          if (!element) return null
          return {
            id: section.id,
            offsetTop: element.offsetTop,
            offsetHeight: element.offsetHeight
          }
        })
        .filter(Boolean)
        .reverse()
        .find(section => section && scrollPosition >= section.offsetTop)
      
      if (current) {
        setActiveSection(current.id)
      }
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Initial check
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-background overflow-x-hidden relative">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 fixed w-full top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1600px]">
          <div className="flex items-center justify-between h-16 gap-4">
            <div className="flex items-center gap-4 flex-1">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden shrink-0"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                {sidebarOpen ? <X className="size-5" /> : <Menu className="size-5" />}
              </Button>
              <Link href="/" className="flex items-center gap-2 shrink-0">
                <Logo className="h-8" />
                <span className="text-sm font-medium text-muted-foreground hidden sm:inline">Docs</span>
              </Link>
              {/* Search in Navbar */}
              <div className="relative hidden lg:flex flex-1 max-w-md ml-8 search-container">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground z-10" />
                <Input
                  ref={searchInputRef}
                  placeholder="Search docs... (⌘K)"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setSearchOpen(true)
                  }}
                  onFocus={() => setSearchOpen(true)}
                  className="pl-9"
                />
                {/* Search Results Dropdown */}
                {searchOpen && searchQuery && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-background border rounded-lg shadow-lg max-h-[400px] overflow-y-auto z-50 search-container">
                    {searchMatches.length > 0 ? (
                      <div className="p-2">
                        {searchMatches.slice(0, 10).map((match) => (
                          <button
                            key={match.elementId}
                            onClick={() => {
                              const element = document.getElementById(match.elementId)
                              if (element) {
                                element.scrollIntoView({ behavior: 'smooth', block: 'center' })
                                element.classList.add('bg-yellow-500/20')
                                setTimeout(() => {
                                  element.classList.remove('bg-yellow-500/20')
                                }, 2000)
                              }
                              setSearchOpen(false)
                              setSearchQuery('')
                            }}
                            className="w-full text-left px-3 py-2 rounded-md hover:bg-muted transition-colors group"
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-semibold text-primary">{match.sectionTitle}</span>
                            </div>
                            <div className="text-sm text-muted-foreground group-hover:text-foreground line-clamp-2">
                              {match.text}
                            </div>
                          </button>
                        ))}
                        {searchMatches.length > 10 && (
                          <div className="px-3 py-2 text-xs text-muted-foreground text-center">
                            +{searchMatches.length - 10} more results
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="p-4 text-center text-sm text-muted-foreground">
                        No results found
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-4 shrink-0">
              <Button variant="ghost" asChild size="sm" className="hidden sm:flex">
                <Link href="/">
                  <ArrowLeft className="size-4 mr-2" />
                  Back to Home
                </Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/login">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex lg:justify-center ">
        <div className="w-full lg:max-w-[1600px] lg:max-h-screen lg:overflow-y-hidden lg:mx-auto lg:px-8 flex lg:items-start">
          {/* Sidebar */}
          <aside 
            className={`fixed lg:sticky top-16 left-0 lg:left-auto lg:self-start h-[calc(100vh-4rem)] w-64 border-r bg-background/95 backdrop-blur overflow-y-auto z-40 transition-transform duration-200 lg:translate-x-0 shrink-0 ${
              sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
          <div className="p-4">
            {/* Mobile Search */}
            <div className="relative lg:hidden mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Search docs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Navigation */}
            <nav className="space-y-1">
              {filteredSections.length === 0 ? (
                <p className="text-sm text-muted-foreground px-3 py-2">No results found</p>
              ) : (
                <>
                  {filteredSections.map((section) => {
                    const Icon = section.icon
                    const isActive = activeSection === section.id
                    const sectionMatches = searchMatches.filter(m => m.sectionId === section.id)
                    const hasMatches = sectionMatches.length > 0
                    
                    return (
                      <div key={section.id} className="space-y-1">
                        <button
                          onClick={() => scrollToSection(section.id)}
                          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                            isActive
                              ? 'bg-primary/10 text-primary font-medium'
                              : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                          }`}
                        >
                          <Icon className="size-4 shrink-0" />
                          <span className="text-left flex-1">{section.title}</span>
                        </button>
                      </div>
                    )
                  })}
                </>
              )}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0 lg:max-h-screen lg:overflow-y-auto w-full pt-16">
          <div className="w-full max-w-4xl mx-auto lg:mx-0 lg:ml-8 xl:ml-12 px-4 sm:px-6 lg:px-0 py-8 overflow-x-hidden">
            {/* Header */}
            <div className="mb-8">
              <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
                <ArrowLeft className="size-4 mr-2" />
                Back to Home
              </Link>
              <div className="flex items-center gap-3 mb-4">
                <Book className="size-8 text-primary" />
                <h1 className="text-4xl font-bold">Documentation</h1>
              </div>
              <p className="text-lg text-muted-foreground">
                Everything you need to know about deploying and managing your projects on Shipoff
              </p>
            </div>

            {/* Getting Started */}
            <section id="getting-started" className="scroll-mt-24 mb-16">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <Zap className="size-7 text-primary" />
                Getting Started
              </h2>
              
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>1. Create an Account</CardTitle>
                    <CardDescription>Sign up for a free Shipoff account</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">
                      Visit <Link href="/login" className="text-primary hover:underline">shipoff.in/login</Link> and create your account. 
                      You can sign up with your email or use GitHub OAuth for a faster setup.
                    </p>
                    <div className="bg-muted p-4 rounded-lg">
                      <p className="text-sm font-mono">✓ Email/Password signup</p>
                      <p className="text-sm font-mono">✓ GitHub OAuth integration</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>2. Connect GitHub</CardTitle>
                    <CardDescription>Link your GitHub account to enable deployments</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">
                      During project creation, you'll be prompted to install the Shipoff GitHub App. This allows us to:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                      <li>Access your repositories for deployment</li>
                      <li>Set up webhooks for automatic deployments</li>
                      <li>Create preview deployments for pull requests</li>
                      <li>Access repository metadata (commits, branches, etc.)</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>3. Create Your First Project</CardTitle>
                    <CardDescription>Follow the project creation wizard</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">
                      Navigate to <strong>Dashboard → Projects → Create Project</strong> to start the wizard:
                    </p>
                    <ol className="list-decimal pl-6 space-y-2 text-muted-foreground">
                      <li><strong>Project Info:</strong> Name and description</li>
                      <li><strong>Framework:</strong> Select your framework (auto-detected if possible)</li>
                      <li><strong>Repository:</strong> Connect your GitHub repository</li>
                      <li><strong>Domain:</strong> Choose your project domain</li>
                      <li><strong>Environment Variables:</strong> Add secrets and config (optional)</li>
                    </ol>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>4. Deploy</CardTitle>
                    <CardDescription>Your first deployment happens automatically</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">
                      Once your project is created, Shipoff automatically triggers your first deployment. You can:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                      <li>Watch the build progress in real-time</li>
                      <li>View deployment logs</li>
                      <li>Access your live site once deployment completes</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Projects */}
            <section id="projects" className="scroll-mt-24 mb-16">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <Code2 className="size-7 text-primary" />
                Managing Projects
              </h2>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Project Types</CardTitle>
                    <CardDescription>Understanding static vs dynamic projects</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="border rounded-lg p-4">
                        <h3 className="font-semibold mb-2">Static Projects</h3>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• React, Vue, Angular apps</li>
                          <li>• Static site generators</li>
                          <li>• Always available (no sleep)</li>
                          <li>• Served via CDN</li>
                          <li>• Free tier: 4 projects</li>
                        </ul>
                      </div>
                      <div className="border rounded-lg p-4">
                        <h3 className="font-semibold mb-2">Dynamic Projects</h3>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• Node.js, Python, PHP apps</li>
                          <li>• Full-stack applications</li>
                          <li>• Auto-scaling</li>
                          <li>• Server-side rendering</li>
                          <li>• Free tier: 1 project</li>
                        </ul>
                        <div className="mt-3 p-2 bg-yellow-500/10 border border-yellow-500/20 rounded text-xs">
                          <p className="text-yellow-700 dark:text-yellow-500 font-semibold mb-1">⚠️ Free Tier Autoscaling:</p>
                          <p className="text-muted-foreground">
                            Dynamic projects on the free tier automatically scale down to <strong>0 instances</strong> after <strong>15 minutes of inactivity</strong>. 
                            The first request after scaling down will experience a cold start delay.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Project Configuration</CardTitle>
                    <CardDescription>Setting up build and runtime commands</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <h3 className="font-semibold">Build Command</h3>
                    <p className="text-sm text-muted-foreground">
                      The command that builds your application. For static sites, this creates the production bundle. 
                      For dynamic apps, this installs dependencies.
                    </p>
                    <div className="bg-muted p-4 rounded-lg font-mono text-sm">
                      <p># Static (React/Vue/etc)</p>
                      <p className="text-primary">npm run build</p>
                      <p className="mt-2"># Dynamic (Node.js)</p>
                      <p className="text-primary">npm install && npm run build</p>
                      <p className="mt-2"># Python</p>
                      <p className="text-primary">pip install -r requirements.txt</p>
                    </div>

                    <h3 className="font-semibold mt-6">Production Command</h3>
                    <p className="text-sm text-muted-foreground">
                      For dynamic projects, this is the command that starts your server. Static projects use "N/A".
                    </p>
                    <div className="bg-muted p-4 rounded-lg font-mono text-sm">
                      <p># Node.js (Express)</p>
                      <p className="text-primary">node server.js</p>
                      <p className="mt-2"># Python (Flask)</p>
                      <p className="text-primary">gunicorn app:app</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Free Tier Limits</CardTitle>
                    <CardDescription>Resource and time constraints for free tier projects</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="border-l-4 border-yellow-500 pl-4 py-2 bg-yellow-500/5 rounded-r">
                      <h3 className="font-semibold mb-2 text-yellow-700 dark:text-yellow-500">Time Limits</h3>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>
                          <strong>Build Timeout:</strong> All free tier projects have a <strong>5-minute (300 seconds)</strong> limit 
                          to complete the build process. If your build takes longer, the deployment will fail with a 
                          <code className="bg-background px-1 rounded font-mono text-xs">BUILD_TIMEOUT</code> error.
                        </li>
                        <li>
                          <strong>Server Startup Timeout:</strong> Dynamic projects must start their server and respond to 
                          health checks within <strong>5 minutes (300 seconds)</strong>. If your server doesn't start in time, 
                          the deployment will fail with a <code className="bg-background px-1 rounded font-mono text-xs">SERVER_STARTUP_TIMEOUT</code> error.
                        </li>
                      </ul>
                      <p className="text-xs text-muted-foreground mt-3">
                        <strong>Tip:</strong> Optimize your build times by using build caches, minimizing dependencies, 
                        and ensuring your production command starts quickly. Consider upgrading for longer time limits.
                      </p>
                    </div>

                    <div className="border-l-4 border-blue-500 pl-4 py-2 bg-blue-500/5 rounded-r">
                      <h3 className="font-semibold mb-2 text-blue-700 dark:text-blue-500">Resource Limits</h3>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>
                          <strong>Memory Limit:</strong> Free tier projects are limited to <strong>512MB of RAM</strong>. 
                          If your application exceeds this limit during build or runtime, it will be terminated with a 
                          <code className="bg-background px-1 rounded font-mono text-xs">MEMORY_LIMIT_EXCEEDED</code> error.
                        </li>
                      </ul>
                      <p className="text-xs text-muted-foreground mt-3">
                        <strong>Tip:</strong> Monitor your memory usage and optimize your application. Consider reducing 
                        dependency sizes or upgrading for more resources.
                      </p>
                    </div>

                    <div className="border-l-4 border-orange-500 pl-4 py-2 bg-orange-500/5 rounded-r">
                      <h3 className="font-semibold mb-2 text-orange-700 dark:text-orange-500">Autoscaling Behavior</h3>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>
                          <strong>Scale-to-Zero:</strong> Free tier dynamic projects automatically scale down to <strong>0 instances</strong> after 
                          <strong>15 minutes of inactivity</strong>. When there are no incoming requests for 15 minutes, your application will be scaled to zero.
                        </li>
                        <li>
                          <strong>Cold Start:</strong> The first request after scaling to zero will experience a <strong>cold start delay</strong> 
                          as the application instance needs to be provisioned and started. This typically takes a few seconds.
                        </li>
                        <li>
                          <strong>Active Scaling:</strong> Once a request arrives, the instance scales up automatically and serves subsequent requests 
                          without delay until the 15-minute inactivity period begins again.
                        </li>
                      </ul>
                      <p className="text-xs text-muted-foreground mt-3">
                        <strong>Note:</strong> This behavior only applies to free tier dynamic projects. Static projects are always available 
                        and do not scale to zero. Consider upgrading if you need always-on availability for your dynamic applications.
                      </p>
                    </div>

                    <div className="bg-muted p-4 rounded-lg">
                      <p className="text-sm font-semibold mb-2">Summary:</p>
                      <div className="space-y-1 text-sm text-muted-foreground font-mono">
                        <p>• Build must complete: ≤ 5 minutes</p>
                        <p>• Server startup (dynamic): ≤ 5 minutes</p>
                        <p>• Memory limit: 512MB</p>
                        <p>• Auto-scale to zero: 15 min inactivity (dynamic only)</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Deployments */}
            <section id="deployments" className="scroll-mt-24 mb-16">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <Rocket className="size-7 text-primary" />
                Deployments
              </h2>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Automatic Deployments</CardTitle>
                    <CardDescription>How auto-deploy works</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">
                      Shipoff automatically deploys your application whenever you push to your connected branch (usually <code className="bg-muted px-1 rounded">main</code> or <code className="bg-muted px-1 rounded">master</code>).
                    </p>
                    <div className="bg-muted p-4 rounded-lg">
                      <p className="text-sm font-semibold mb-2">Deployment Flow:</p>
                      <ol className="list-decimal pl-6 space-y-1 text-sm text-muted-foreground">
                        <li>Push code to your repository</li>
                        <li>GitHub webhook notifies Shipoff</li>
                        <li>Build process starts</li>
                        <li>Application is deployed to edge network</li>
                        <li>Your site is live!</li>
                      </ol>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Viewing Logs</CardTitle>
                    <CardDescription>Monitoring your deployments</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">
                      Access real-time logs from the Deployments page:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                      <li><strong>Build Logs:</strong> Output from your build command</li>
                      <li><strong>Runtime Logs:</strong> Application output and errors</li>
                      <li><strong>Deployment Logs:</strong> Infrastructure provisioning messages</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Deployment States */}
            <section id="deployment-states" className="scroll-mt-24 mb-16">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <Database className="size-7 text-primary" />
                Deployment State Machine
              </h2>

              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Understanding the Deployment Lifecycle</CardTitle>
                  <CardDescription>How deployments progress through states in sequence</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-6">
                    Every deployment in Shipoff follows a strict state machine. Understanding this lifecycle and the sequence 
                    of states is essential for managing your deployments effectively. Deployments progress through states in a 
                    specific order, and each state has specific rules about what operations are allowed.
                  </p>
                  
                  <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-lg mb-6">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="size-5 text-yellow-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-yellow-500 mb-1">Critical Rules</p>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• Only <strong>INACTIVE</strong> and <strong>FAILED</strong> deployments can be deleted or redeployed</li>
                          <li>• <strong>PRODUCTION</strong> deployments cannot be deleted (they protect your live site)</li>
                          <li>• Deployments in <strong>QUEUED</strong>, <strong>BUILDING</strong>, or <strong>PROVISIONING</strong> must complete before actions can be taken</li>
                          <li>• Only one <strong>PRODUCTION</strong> deployment exists per project at a time</li>
                          <li>• When a new deployment reaches <strong>PRODUCTION</strong>, the previous <strong>PRODUCTION</strong> automatically becomes <strong>INACTIVE</strong></li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6 mb-8">
                    <div>
                      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <span className="flex items-center justify-center size-8 rounded-full bg-blue-500/10 text-blue-500 font-bold">1</span>
                        QUEUED - The Starting Point
                      </h3>
                      <div className="border rounded-lg p-4 bg-blue-500/5">
                        <div className="flex items-start gap-3 mb-2">
                          <div className="bg-blue-500 size-3 rounded-full mt-2 shrink-0" />
                          <div className="flex-1">
                            <p className="text-sm text-muted-foreground mb-2">
                              When you push code or create a new deployment, it starts in the <strong>QUEUED</strong> state. 
                              The deployment is waiting in line to be processed by the build system.
                            </p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span>Next state:</span>
                              <span className="px-2 py-0.5 bg-muted rounded font-mono">BUILDING</span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-2 italic">
                              Cannot be deleted or redeployed while in this state. Must wait for state transition.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <span className="flex items-center justify-center size-8 rounded-full bg-yellow-500/10 text-yellow-500 font-bold">2</span>
                        BUILDING - Compiling Your Code
                      </h3>
                      <div className="border rounded-lg p-4 bg-yellow-500/5">
                        <div className="flex items-start gap-3 mb-2">
                          <div className="bg-yellow-500 size-3 rounded-full mt-2 shrink-0" />
                          <div className="flex-1">
                            <p className="text-sm text-muted-foreground mb-2">
                              The build system is now executing your build command. This includes installing dependencies, 
                              compiling code, and creating the production bundle. This is where most build errors occur.
                            </p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                              <span>Can transition to:</span>
                              <span className="px-2 py-0.5 bg-muted rounded font-mono">PROVISIONING</span>
                              <span className="text-muted-foreground">or</span>
                              <span className="px-2 py-0.5 bg-red-500/10 text-red-500 rounded font-mono">FAILED</span>
                            </div>
                            <p className="text-xs text-muted-foreground italic mb-2">
                              Cannot be deleted or redeployed while building. If build fails, transitions to FAILED state.
                            </p>
                            <div className="text-xs text-yellow-700 dark:text-yellow-500 bg-yellow-500/10 rounded px-2 py-1.5 border border-yellow-500/20">
                              <strong>Free Tier:</strong> Build must complete within 5 minutes. Long builds will timeout and fail.
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <span className="flex items-center justify-center size-8 rounded-full bg-purple-500/10 text-purple-500 font-bold">3</span>
                        PROVISIONING - Setting Up Runtime
                      </h3>
                      <div className="border rounded-lg p-4 bg-purple-500/5">
                        <div className="flex items-start gap-3 mb-2">
                          <div className="bg-purple-500 size-3 rounded-full mt-2 shrink-0" />
                          <div className="flex-1">
                            <p className="text-sm text-muted-foreground mb-2">
                              Once the build succeeds, the runtime environment is being provisioned. This includes setting up 
                              containers, configuring networking, and preparing the deployment to serve traffic.
                            </p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                              <span>Can transition to:</span>
                              <span className="px-2 py-0.5 bg-green-500/10 text-green-500 rounded font-mono">PRODUCTION</span>
                              <span className="text-muted-foreground">or</span>
                              <span className="px-2 py-0.5 bg-red-500/10 text-red-500 rounded font-mono">FAILED</span>
                            </div>
                            <p className="text-xs text-muted-foreground italic mb-2">
                              Cannot be deleted or redeployed while provisioning. If provisioning fails, transitions to FAILED state.
                            </p>
                            <div className="text-xs text-yellow-700 dark:text-yellow-500 bg-yellow-500/10 rounded px-2 py-1.5 border border-yellow-500/20">
                              <strong>Dynamic Projects:</strong> Server must start and respond to health checks within 5 minutes. 
                              Ensure your server starts quickly and the PORT environment variable is correctly configured.
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <span className="flex items-center justify-center size-8 rounded-full bg-green-500/10 text-green-500 font-bold">4</span>
                        PRODUCTION - Live and Serving Traffic
                      </h3>
                      <div className="border rounded-lg p-4 bg-green-500/5">
                        <div className="flex items-start gap-3 mb-2">
                          <div className="bg-green-500 size-3 rounded-full mt-2 shrink-0" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-xs px-2 py-0.5 bg-red-500/10 text-red-500 rounded">
                                <Lock className="size-3 inline mr-1" />
                                Protected - Cannot be deleted
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              The deployment is now live and serving production traffic. This is your active deployment. 
                              Only one deployment can be in PRODUCTION state per project at any given time.
                            </p>
                            <p className="text-xs text-muted-foreground mb-2">
                              <strong>Important:</strong> When a new deployment reaches PRODUCTION, the previous PRODUCTION deployment 
                              automatically transitions to INACTIVE. This ensures only one active deployment at a time.
                            </p>
                            <p className="text-xs text-muted-foreground italic">
                              Protected state - cannot be deleted to prevent accidental downtime. Automatically becomes INACTIVE 
                              when replaced by a new PRODUCTION deployment.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="border-t pt-6 mt-6">
                      <h3 className="text-lg font-semibold mb-4">Terminal States - Operations Allowed</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        These states are "stable" terminal states where deployments can remain indefinitely. 
                        Operations like delete and redeploy are only available in these states.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <span className="flex items-center justify-center size-8 rounded-full bg-gray-500/10 text-gray-500 font-bold">5</span>
                        INACTIVE - Previous Production Deployment
                      </h3>
                      <div className="border rounded-lg p-4 bg-gray-500/5">
                        <div className="flex items-start gap-3 mb-2">
                          <div className="bg-gray-500 size-3 rounded-full mt-2 shrink-0" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-xs px-2 py-0.5 bg-green-500/10 text-green-500 rounded">✓ Deletable</span>
                              <span className="text-xs px-2 py-0.5 bg-blue-500/10 text-blue-500 rounded">✓ Redeployable</span>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              This deployment was previously in PRODUCTION but has been replaced by a newer deployment. 
                              It's no longer serving traffic but retains all its data and can be reactivated or deleted.
                            </p>
                            <p className="text-xs text-muted-foreground mb-2">
                              <strong>Operations available:</strong> You can delete this deployment to free up resources, 
                              or redeploy it to make it active again (transitions back to QUEUED).
                            </p>
                            <p className="text-xs text-muted-foreground italic">
                              Stable terminal state - safe to delete or redeploy at any time.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <span className="flex items-center justify-center size-8 rounded-full bg-red-500/10 text-red-500 font-bold">6</span>
                        FAILED - Error State
                      </h3>
                      <div className="border rounded-lg p-4 bg-red-500/5">
                        <div className="flex items-start gap-3 mb-2">
                          <div className="bg-red-500 size-3 rounded-full mt-2 shrink-0" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-xs px-2 py-0.5 bg-green-500/10 text-green-500 rounded">✓ Deletable</span>
                              <span className="text-xs px-2 py-0.5 bg-blue-500/10 text-blue-500 rounded">✓ Redeployable</span>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              The deployment encountered an error during BUILDING or PROVISIONING. The deployment process 
                              has stopped and is not serving traffic.
                            </p>
                            <p className="text-xs text-muted-foreground mb-2">
                              <strong>Common causes:</strong> Build command failure, dependency errors, runtime provisioning 
                              issues, or configuration problems.
                            </p>
                            <p className="text-xs text-muted-foreground mb-2">
                              <strong>Operations available:</strong> You can delete this deployment to remove it, or redeploy 
                              it (after fixing issues) which transitions it back to QUEUED.
                            </p>
                            <p className="text-xs text-muted-foreground italic">
                              Stable terminal state - safe to delete or redeploy. Check logs to identify and fix the error before redeploying.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Complete State Machine Flow Diagram</CardTitle>
                  <CardDescription>Sequential flow of deployment states</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Primary Flow */}
                    <div>
                      <p className="text-sm font-semibold text-muted-foreground mb-3">Primary Success Path:</p>
                      <div className="flex flex-wrap items-center gap-2 p-4 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Circle className="size-3 fill-blue-500 text-blue-500" />
                          <span className="font-mono text-sm font-semibold">QUEUED</span>
                        </div>
                        <ChevronRight className="size-5 text-muted-foreground" />
                        <div className="flex items-center gap-2">
                          <Circle className="size-3 fill-yellow-500 text-yellow-500" />
                          <span className="font-mono text-sm font-semibold">BUILDING</span>
                        </div>
                        <ChevronRight className="size-5 text-muted-foreground" />
                        <div className="flex items-center gap-2">
                          <Circle className="size-3 fill-purple-500 text-purple-500" />
                          <span className="font-mono text-sm font-semibold">PROVISIONING</span>
                        </div>
                        <ChevronRight className="size-5 text-muted-foreground" />
                        <div className="flex items-center gap-2">
                          <Circle className="size-3 fill-green-500 text-green-500" />
                          <span className="font-mono text-sm font-semibold">PRODUCTION</span>
                        </div>
                        <span className="text-xs text-muted-foreground ml-2">(Live)</span>
                      </div>
                    </div>

                    {/* Error Path */}
                    <div>
                      <p className="text-sm font-semibold text-muted-foreground mb-3">Error Paths:</p>
                      <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-lg space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <span className="font-mono">BUILDING</span>
                          <ChevronRight className="size-4 text-muted-foreground" />
                          <Circle className="size-2 fill-red-500 text-red-500" />
                          <span className="font-mono">FAILED</span>
                          <span className="text-xs text-muted-foreground ml-2">(on build error)</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="font-mono">PROVISIONING</span>
                          <ChevronRight className="size-4 text-muted-foreground" />
                          <Circle className="size-2 fill-red-500 text-red-500" />
                          <span className="font-mono">FAILED</span>
                          <span className="text-xs text-muted-foreground ml-2">(on provisioning error)</span>
                        </div>
                      </div>
                    </div>

                    {/* Production Replacement */}
                    <div>
                      <p className="text-sm font-semibold text-muted-foreground mb-3">Production Replacement:</p>
                      <div className="p-4 bg-blue-500/5 border border-blue-500/20 rounded-lg">
                        <div className="flex items-center gap-2 text-sm mb-2">
                          <span className="font-mono">New deployment reaches PRODUCTION</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="font-mono">Previous PRODUCTION</span>
                          <ChevronRight className="size-4 text-muted-foreground" />
                          <Circle className="size-2 fill-gray-500 text-gray-500" />
                          <span className="font-mono">INACTIVE</span>
                          <span className="text-xs text-muted-foreground ml-2">(automatic transition)</span>
                        </div>
                      </div>
                    </div>

                    {/* Redeploy Path */}
                    <div>
                      <p className="text-sm font-semibold text-muted-foreground mb-3">Redeployment Path:</p>
                      <div className="p-4 bg-green-500/5 border border-green-500/20 rounded-lg">
                        <div className="flex items-center gap-2 text-sm">
                          <Circle className="size-2 fill-gray-500 text-gray-500" />
                          <span className="font-mono">INACTIVE</span>
                          <span className="text-xs text-muted-foreground">or</span>
                          <Circle className="size-2 fill-red-500 text-red-500" />
                          <span className="font-mono">FAILED</span>
                          <span className="text-xs text-muted-foreground mx-2">→ User clicks Redeploy →</span>
                          <Circle className="size-2 fill-blue-500 text-blue-500" />
                          <span className="font-mono">QUEUED</span>
                          <span className="text-xs text-muted-foreground ml-2">(restarts lifecycle)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Operations Available by State</CardTitle>
                  <CardDescription>What you can do with deployments in each state</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2">State</th>
                          <th className="text-left p-2">View Logs</th>
                          <th className="text-left p-2">Redeploy</th>
                          <th className="text-left p-2">Delete</th>
                          <th className="text-left p-2">Notes</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="p-2 font-mono font-semibold">QUEUED</td>
                          <td className="p-2">✓</td>
                          <td className="p-2 text-muted-foreground">✗</td>
                          <td className="p-2 text-muted-foreground">✗</td>
                          <td className="p-2 text-xs text-muted-foreground">Waiting to start</td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-2 font-mono font-semibold">BUILDING</td>
                          <td className="p-2">✓</td>
                          <td className="p-2 text-muted-foreground">✗</td>
                          <td className="p-2 text-muted-foreground">✗</td>
                          <td className="p-2 text-xs text-muted-foreground">Build in progress</td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-2 font-mono font-semibold">PROVISIONING</td>
                          <td className="p-2">✓</td>
                          <td className="p-2 text-muted-foreground">✗</td>
                          <td className="p-2 text-muted-foreground">✗</td>
                          <td className="p-2 text-xs text-muted-foreground">Setting up runtime</td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-2 font-mono font-semibold">PRODUCTION</td>
                          <td className="p-2">✓</td>
                          <td className="p-2 text-muted-foreground">✗</td>
                          <td className="p-2 text-red-500 font-semibold">✗ Protected</td>
                          <td className="p-2 text-xs text-muted-foreground">Live deployment</td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-2 font-mono font-semibold">INACTIVE</td>
                          <td className="p-2">✓</td>
                          <td className="p-2 text-green-500 font-semibold">✓</td>
                          <td className="p-2 text-green-500 font-semibold">✓</td>
                          <td className="p-2 text-xs text-muted-foreground">Replaced by newer deployment</td>
                        </tr>
                        <tr>
                          <td className="p-2 font-mono font-semibold">FAILED</td>
                          <td className="p-2">✓</td>
                          <td className="p-2 text-green-500 font-semibold">✓</td>
                          <td className="p-2 text-green-500 font-semibold">✓</td>
                          <td className="p-2 text-xs text-muted-foreground">Error occurred</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Frameworks */}
            <section id="frameworks" className="scroll-mt-24 mb-16">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <Code2 className="size-7 text-primary" />
                Supported Frameworks
              </h2>

              <Card>
                <CardHeader>
                  <CardTitle>Framework Reference</CardTitle>
                  <CardDescription>Default configurations for supported frameworks</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2">Framework</th>
                          <th className="text-left p-2">Type</th>
                          <th className="text-left p-2">Runtime</th>
                          <th className="text-left p-2">Build Command</th>
                          <th className="text-left p-2">Output Dir</th>
                        </tr>
                      </thead>
                      <tbody>
                        {frameworks.map((fw, i) => (
                          <tr key={i} className="border-b">
                            <td className="p-2 font-medium">{fw.name}</td>
                            <td className="p-2 text-muted-foreground">{fw.type}</td>
                            <td className="p-2 text-muted-foreground">{fw.runtime}</td>
                            <td className="p-2 font-mono text-xs">{fw.build}</td>
                            <td className="p-2 font-mono text-xs text-muted-foreground">{fw.outDir}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Environment Variables */}
            <section id="environment-variables" className="scroll-mt-24 mb-16">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <Settings className="size-7 text-primary" />
                Environment Variables
              </h2>

              <Card>
                <CardHeader>
                  <CardTitle>Managing Secrets</CardTitle>
                  <CardDescription>Securely managing secrets and configuration</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Environment variables are encrypted at rest and injected into your build and runtime environments. 
                    They're never exposed in logs or the UI.
                  </p>
                  <div className="border-l-4 border-red-500 pl-4 py-2 bg-red-500/5 rounded-r mb-4">
                    <h3 className="font-semibold mb-2 text-red-700 dark:text-red-500">Required for Dynamic Projects</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      Dynamic projects <strong>must</strong> set the <code className="bg-background px-1 rounded font-mono">PORT</code> environment variable. 
                      This is the port number your application listens on (e.g., <code className="bg-background px-1 rounded font-mono">3000</code>, 
                      <code className="bg-background px-1 rounded font-mono">8000</code>). Without this variable, your deployment will fail during health checks.
                    </p>
                    <div className="bg-muted p-3 rounded mt-2">
                      <p className="text-xs font-mono text-muted-foreground">Example:</p>
                      <p className="text-xs font-mono text-primary">PORT=3000</p>
                    </div>
                  </div>

                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-sm font-semibold mb-2">Best Practices:</p>
                    <ul className="list-disc pl-6 space-y-1 text-sm text-muted-foreground">
                      <li>Use descriptive names (e.g., <code className="bg-background px-1 rounded">DATABASE_URL</code> not <code className="bg-background px-1 rounded">DB</code>)</li>
                      <li>Never commit secrets to your repository</li>
                      <li>Use different values for different environments if needed</li>
                      <li>Rotate secrets regularly</li>
                      <li><strong>Dynamic projects:</strong> Always set <code className="bg-background px-1 rounded">PORT</code> to match your application's listening port</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Teams */}
            <section id="teams" className="scroll-mt-24 mb-16">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <Users className="size-7 text-primary" />
                Teams & Collaboration
              </h2>

              <Card>
                <CardHeader>
                  <CardTitle>Working with Teams</CardTitle>
                  <CardDescription>Collaborate on projects with your team</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Invite team members, manage permissions, and collaborate on projects. Team features include:
                  </p>
                  <ul className="list-disc pl-6 space-y-1 text-sm text-muted-foreground">
                    <li>Role-based access control</li>
                    <li>Project sharing</li>
                    <li>Team analytics</li>
                    <li>Audit logs</li>
                  </ul>
                </CardContent>
              </Card>
            </section>

            {/* Troubleshooting */}
            <section id="troubleshooting" className="scroll-mt-24 mb-16">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <AlertCircle className="size-7 text-primary" />
                Troubleshooting
              </h2>

              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Build Failures</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      <strong>Common causes:</strong>
                    </p>
                    <ul className="list-disc pl-6 space-y-1 text-sm text-muted-foreground">
                      <li>Missing dependencies in package.json/requirements.txt</li>
                      <li>Incorrect build command</li>
                      <li>Missing environment variables (especially <code className="bg-background px-1 rounded font-mono text-xs">PORT</code> for dynamic projects)</li>
                      <li><strong>Build timeout:</strong> Free tier projects have a 5-minute build limit. Optimize your build process if it's taking too long</li>
                      <li><strong>Memory limit exceeded:</strong> Projects are limited to 512MB RAM. Reduce dependencies or optimize memory usage</li>
                      <li><strong>Server startup timeout:</strong> Dynamic projects must start within 5 minutes. Ensure your server starts quickly and responds on the configured PORT</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Deployment Not Triggering</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      If deployments aren't triggering automatically:
                    </p>
                    <ul className="list-disc pl-6 space-y-1 text-sm text-muted-foreground">
                      <li>Verify GitHub App is installed on your repository</li>
                      <li>Check that you're pushing to the correct branch</li>
                      <li>Ensure webhook is configured in GitHub</li>
                      <li>Check project repository settings</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Cannot Delete/Redeploy Deployment</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-2">
                      If you're unable to delete or redeploy a deployment:
                    </p>
                    <ul className="list-disc pl-6 space-y-1 text-sm text-muted-foreground">
                      <li><strong>PRODUCTION</strong> deployments cannot be deleted (this protects your live site)</li>
                      <li>Deployments in <strong>QUEUED</strong>, <strong>BUILDING</strong>, or <strong>PROVISIONING</strong> must complete first</li>
                      <li>Wait for the deployment to reach <strong>INACTIVE</strong> or <strong>FAILED</strong> state</li>
                      <li>Only stable states allow deletion and redeployment</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Need More Help?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      If you're still experiencing issues, reach out to our support team at{' '}
                      <Link href="teamshipoff@gmail.com" className="text-primary hover:underline">teamshipoff@gmail.com</Link> 
                      {' '}or use the "Report Bug" feature in your dashboard.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </section>
          </div>
        </main>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}
