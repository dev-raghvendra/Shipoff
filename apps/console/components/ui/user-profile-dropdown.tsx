"use client"

import * as React from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogOut, Monitor, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { signOut } from "next-auth/react"
import { useSession } from "@/context/session.context"
import { toast } from "sonner"
import { Skeleton } from "./skeleton"
import { cn } from "@/lib/utils"

export interface UserProfileDropdownProps {}

export function UserProfileDropdown() {
  const { theme, setTheme } = useTheme()
  const { data: session, update, status } = useSession()
  const [isUpdatingTheme, setIsUpdatingTheme] = React.useState(false)
  
  // Get user info from session - using correct property names
  const userName = session?.user?.fullName || "User"
  const userEmail = session?.user?.email || "user@example.com"
  const userAvatar = session?.user?.avatarUri
  
  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }
  
  const handleLogout = async () => {
    try {
      await signOut({ callbackUrl: '/login' })
    } catch (error) {
      toast.error("Failed to log out")
    }
  }
  
  const handleThemeChange = async (newTheme: "dark" | "light" | "system") => {
    try {
      setIsUpdatingTheme(true)
      setTheme(newTheme)
      
      // Update the preferredTheme in session
      await update({
        user: {
          ...session?.user,
          preferredTheme: newTheme
        }
      })
    } catch (error) {
      toast.error("Failed to update theme preference")
    } finally {
      setIsUpdatingTheme(false)
    }
  }
  
  // Show loading state while session is loading
  if (status === "loading") {
    return (
      <Skeleton className="h-8 w-8 rounded-full" />
    )
  }
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="relative h-8 w-8 rounded-full"
        >
          <Avatar className="h-8 w-8">
            {userAvatar && <AvatarImage src={userAvatar} alt={userName} />}
            <AvatarFallback className="bg-muted text-xs font-medium">
              {getInitials(userName)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        {/* User Info */}
        <div className="flex flex-col space-y-1 px-2 py-2">
          <p className="text-sm font-medium leading-none">{userName}</p>
          <p className="text-xs leading-none text-muted-foreground">
            {userEmail}
          </p>
        </div>
        
        <DropdownMenuSeparator />
        
        {/* Theme Selection */}
        <div className="flex items-center justify-between px-2 py-2">
          <span className="text-sm">Theme</span>
          <div className="flex items-center gap-0.5 bg-muted/50 rounded-md p-0.5">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleThemeChange("system")}
              disabled={isUpdatingTheme}
              className={cn(
                "h-6 w-6 p-0 transition-all",
                theme === "system" 
                  ? "bg-background shadow-sm" 
                  : "hover:bg-background/50"
              )}
              title="System theme"
            >
              <Monitor className={cn(
                "h-3.5 w-3.5",
                theme === "system" ? "text-foreground" : "text-muted-foreground"
              )} />
              <span className="sr-only">System</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleThemeChange("light")}
              disabled={isUpdatingTheme}
              className={cn(
                "h-6 w-6 p-0 transition-all",
                theme === "light" 
                  ? "bg-background shadow-sm" 
                  : "hover:bg-background/50"
              )}
              title="Light theme"
            >
              <Sun className={cn(
                "h-3.5 w-3.5",
                theme === "light" ? "text-foreground" : "text-muted-foreground"
              )} />
              <span className="sr-only">Light</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleThemeChange("dark")}
              disabled={isUpdatingTheme}
              className={cn(
                "h-6 w-6 p-0 transition-all",
                theme === "dark" 
                  ? "bg-background shadow-sm" 
                  : "hover:bg-background/50"
              )}
              title="Dark theme"
            >
              <Moon className={cn(
                "h-3.5 w-3.5",
                theme === "dark" ? "text-foreground" : "text-muted-foreground"
              )} />
              <span className="sr-only">Dark</span>
            </Button>
          </div>
        </div>
        
        <DropdownMenuSeparator />
        
        {/* Logout */}
        <DropdownMenuItem 
          onClick={handleLogout} 
          className="cursor-pointer text-sm"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
