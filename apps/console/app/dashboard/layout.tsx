"use client"

import * as React from "react"
import Link from "next/link"
import { useParams, usePathname } from "next/navigation"
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { UserProfileDropdown } from "@/components/ui/user-profile-dropdown"
import { LayoutDashboard, Boxes, Rocket, Settings, User, ChevronLeft, Users2, BugIcon } from "lucide-react"
import { SessionProvider } from "next-auth/react"


const getDashboardNav = () => [
  {group:"General",items:[
    { label: "Overview", href: "/dashboard/overview", icon: LayoutDashboard },
    { label: "Projects", href: "/dashboard/projects", icon: Boxes },
    { label: "Teams", href: "/dashboard/teams", icon: Users2 },
    { label: "Account", href: "/dashboard/account", icon: User },
  ]},{group:"Community", items:[
    { label: "Report bug", href: "/dashboard/report-bug", icon: BugIcon },
  ]},

]

const getProjectNav = (projectId:string) => [
  {group:"General", items:[
    { label: "Overview", href: `/dashboard/projects/${projectId}`, icon: LayoutDashboard },
    { label: "Deployments", href: `/dashboard/projects/${projectId}/deployments`, icon: Rocket },
    { label: "Settings", href: `/dashboard/projects/${projectId}/settings`, icon: Settings },
    
  ]},{group:"Community", items:[
    { label: "Report bug", href: `/dashboard/projects/${projectId}/report-bug`, icon: BugIcon },
  ]}
]

const getDeploymentNav = (projectId:string,deploymentId:string) => [
  {group:"General", items:[
    { label: "Overview", href: `/dashboard/projects/${projectId}/deployments/${deploymentId}/overview`, icon: LayoutDashboard },
    ,
  ]},
  {group:"Community", items:[
    { label: "Report bug", href: `/dashboard/projects/${projectId}/deployments/${deploymentId}/report-bug`, icon: BugIcon },
  ]}
]


const getBreadcrumbs = (pathname: string, params: any) => {
  const segments = pathname.split('/').filter(Boolean)
  const breadcrumbs = [{ label: 'Dashboard', href: '/dashboard' }]
  
  if (params.projectId) {
    breadcrumbs.push({ 
      label: `Project ${params.projectId}`, 
      href: `/dashboard/projects/${params.projectId}` 
    })
  }
  
  if (params.deploymentId) {
    breadcrumbs.push({ 
      label: `Deployment ${params.deploymentId}`, 
      href: `/dashboard/projects/${params.projectId}/deployments/${params.deploymentId}` 
    })
  }
  
  // Add current page if not at root level
  const lastSegment = segments[segments.length - 1]
  if (lastSegment && !['dashboard', params.projectId, params.deploymentId].includes(lastSegment)) {
    breadcrumbs.push({ 
      label: lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1), 
      href: pathname 
    })
  }
  
  return breadcrumbs
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const params = useParams()

  const isProjectView = Boolean(params.projectId) && !Boolean(params.deploymentId)
  const isDeploymentView = Boolean(params.projectId) && Boolean(params.deploymentId)

  console.log("Is Project View:", isProjectView)
  console.log("Is Deployment View:", isDeploymentView)

  let nav = isDeploymentView
    ? getDeploymentNav(params.projectId as string, params.deploymentId as string)
    : isProjectView
      ? getProjectNav(params.projectId as string)
      : getDashboardNav()

  const breadcrumbs = getBreadcrumbs(pathname, params)
  const backLink = isDeploymentView 
    ? `/dashboard/projects/${params.projectId}/deployments`
    : isProjectView 
      ? '/dashboard/projects' 
      : null

  return (
     <SessionProvider>
      <SidebarProvider defaultOpen>
      <Sidebar variant="inset" collapsible="icon" className="sticky max-h-screen overflow-y-auto">
        <SidebarHeader>
          <Link href="/dashboard" className="flex items-center gap-2 px-2">
            <div className="size-6 rounded-md bg-primary" />
            <span className="font-medium text-sm">Your PaaS</span>
          </Link>
        </SidebarHeader>

        <SidebarContent>
          {/* Back Navigation */}
          {backLink && (
            <div>
              <Button 
                asChild 
                variant="ghost" 
                size="sm" 
                className="w-full justify-start h-8 text-xs group-data-[collapsible=icon]:hidden"
              >
                <Link href={backLink} className="flex items-center gap-2">
                  <ChevronLeft className="size-4" />
                  <span>Back</span>
                </Link>
              </Button>
            </div>
          )}

          {nav.map((group)=>{
            return (
              <SidebarGroup key={group.group}>
                <SidebarGroupLabel>{group.group}</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {group.items.map((item) => {
                      const Icon = item!.icon
                      const isActive = pathname.endsWith(item!.label.toLocaleLowerCase().replace(" ","-"))
                      return (
                        <SidebarMenuItem key={item!.href}>
                          <SidebarMenuButton asChild isActive={isActive}>
                            <Link href={item!.href} className="flex items-center gap-2">
                              <Icon className="size-4" />
                              <span>{item!.label}</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      )
                    })}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            )
          })}
        </SidebarContent>

        <SidebarSeparator />

        <SidebarFooter>
          <div className="px-2 py-1.5 text-xs text-sidebar-foreground/70">Plan</div>
          <div className="flex items-center justify-between px-2">
            <Badge variant="outline" className="text-xs">
              Free
            </Badge>
            <Button asChild size="sm" variant="outline" className="h-7 text-xs bg-transparent">
              <Link href="/dashboard/upgrade">Upgrade</Link>
            </Button>
          </div>
        </SidebarFooter>

        <SidebarRail />
      </Sidebar>

      <SidebarInset className="min-h-svh" style={{marginTop:
        "0px"
      }}>
        <header className="border-b bg-background sticky top-0 z-10">
          <div className="flex h-14 items-center justify-between gap-2 px-3 md:px-4">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
              <div className="flex items-center gap-2">
                {breadcrumbs.map((crumb, idx) => (
                  <React.Fragment key={crumb.href}>
                    {idx > 0 && <span className="text-muted-foreground">/</span>}
                    {idx === breadcrumbs.length - 1 ? (
                      <h1 className="text-sm font-medium">{crumb.label}</h1>
                    ) : (
                      <Link 
                        href={crumb.href} 
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {crumb.label}
                      </Link>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
            <UserProfileDropdown />
          </div>
        </header>

        <main className="flex-1">
          <div className="mx-auto w-full max-w-6xl px-3 py-6 md:px-4 md:py-8">{children}</div>
        </main>
      </SidebarInset>
    </SidebarProvider>
    </SessionProvider>
  )
}