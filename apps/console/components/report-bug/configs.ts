import { Code, GitBranch, Terminal, Globe, User, Calendar } from "lucide-react"

export const DASHBOARD_CONFIG = {
  context: {
    title: "Dashboard",
    description: "Reporting an issue with the main dashboard interface, navigation, or general functionality.",
    items: [
      { label: "Location", value: "Main Dashboard", icon: Globe },
      { label: "Interface", value: "Web Application", icon: Terminal },
    ]
  },
  issueTypes: [
    { value: "ui-issue", label: "UI/UX Issue", icon: "🎨" },
    { value: "navigation", label: "Navigation Problem", icon: "🧭" },
    { value: "performance", label: "Performance Issue", icon: "🐌" },
    { value: "authentication", label: "Authentication Issue", icon: "🔐" },
    { value: "data-loading", label: "Data Loading Issue", icon: "📊" },
    { value: "other", label: "Other", icon: "❓" },
  ],
  priorityLevels: [
    { value: "low", label: "Low", color: "bg-[var(--label-quiet)] text-[var(--label-quiet-foreground)]" },
    { value: "medium", label: "Medium", color: "bg-[var(--label-alert)] text-[var(--label-alert-foreground)]" },
    { value: "high", label: "High", color: "bg-[var(--label-destructive)] text-[var(--label-destructive-foreground)]" },
    { value: "critical", label: "Critical", color: "bg-[var(--label-destructive)] text-[var(--label-destructive-foreground)]" },
  ],
  repository: "dev-raghvendra/Shipoff",
  labels: ["bug", "dashboard"]
}

export const PROJECT_CONFIG = {
  context: {
    title: "Project",
    description: "Reporting an issue with a specific project's settings, deployment, or configuration.",
    items: [
      { label: "Project", value: "my-paas-app", icon: Code },
      { label: "Framework", value: "Next.js", icon: Terminal },
      { label: "Repository", value: "example/my-paas-app", icon: GitBranch },
      { label: "Branch", value: "main", icon: GitBranch },
    ]
  },
  issueTypes: [
    { value: "project-settings", label: "Project Settings Issue", icon: "⚙️" },
    { value: "deployment", label: "Deployment Problem", icon: "🚀" },
    { value: "repository", label: "Repository Issue", icon: "📁" },
    { value: "domain", label: "Domain/DNS Issue", icon: "🌐" },
    { value: "environment", label: "Environment Variables", icon: "🔧" },
    { value: "build", label: "Build Configuration", icon: "🔨" },
    { value: "other", label: "Other", icon: "❓" },
  ],
  priorityLevels: [
    { value: "low", label: "Low", color: "bg-[var(--label-quiet)] text-[var(--label-quiet-foreground)]" },
    { value: "medium", label: "Medium", color: "bg-[var(--label-alert)] text-[var(--label-alert-foreground)]" },
    { value: "high", label: "High", color: "bg-[var(--label-destructive)] text-[var(--label-destructive-foreground)]" },
    { value: "critical", label: "Critical", color: "bg-[var(--label-destructive)] text-[var(--label-destructive-foreground)]" },
  ],
  repository: "dev-raghvendra/Shipoff",
  labels: ["bug", "project"]
}

export const DEPLOYMENT_CONFIG = {
  context: {
    title: "Deployment",
    description: "Reporting an issue with a specific deployment's build, runtime, or domain configuration.",
    items: [
      { label: "Project", value: "my-paas-app", icon: Code },
      { label: "Domain", value: "my-paas-app.on.shipoff.in", icon: Globe },
      { label: "Repository", value: "example/my-paas-app", icon: GitBranch },
      { label: "Branch", value: "main", icon: GitBranch },
      { label: "Framework", value: "Next.js", icon: Terminal },
      { label: "Commit", value: "a1b2c3d4e5f6", icon: Code },
      { label: "Author", value: "John Doe", icon: User },
      { label: "Deployed", value: "2024-01-15T10:30:00Z", icon: Calendar },
    ]
  },
  issueTypes: [
    { value: "build-error", label: "Build Error", icon: "🔨" },
    { value: "runtime-error", label: "Runtime Error", icon: "⚡" },
    { value: "performance", label: "Performance Issue", icon: "🐌" },
    { value: "deployment", label: "Deployment Issue", icon: "🚀" },
    { value: "domain", label: "Domain/DNS Issue", icon: "🌐" },
    { value: "other", label: "Other", icon: "❓" },
  ],
  priorityLevels: [
    { value: "low", label: "Low", color: "bg-blue-100 text-blue-800" },
    { value: "medium", label: "Medium", color: "bg-yellow-100 text-yellow-800" },
    { value: "high", label: "High", color: "bg-orange-100 text-orange-800" },
    { value: "critical", label: "Critical", color: "bg-red-100 text-red-800" },
  ],
  repository: "dev-raghvendra/Shipoff",
  labels: ["bug", "deployment"]
}
