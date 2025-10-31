"use client"

import * as React from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogOut, MonitorSmartphoneIcon, Moon, Palette, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useSession } from "@/context/session.context"
import { useDebounceRequest } from "@/hooks/debounce-req"
import { toast } from "sonner"

interface UserProfileDropdownProps {
  user?: {
    name: string
    email: string
    avatar?: string
  }
}

export function UserProfileDropdown({ user }: UserProfileDropdownProps) {
  const defaultUser = {
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: "/placeholder-user.jpg"
  }

  
  const {theme,setTheme} = useTheme()
  const {update} = useSession()
  
  const currentUser = user || defaultUser
  
  const handleLogout = () => {
    // Implement logout logic here
}
  
  const handleThemeChange = async(theme:"dark"|"light"|"system") => {
     await update({
         user:{
             preferredTheme:theme
            }
        })
    }
    
    const {error} = useDebounceRequest(handleThemeChange,1000,[theme],theme as "dark"|"light"|"system")
    React.useEffect(()=>{
      if(error) {
        toast.error("Failed to update theme")
      }
    },[error])
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
            <AvatarFallback>
              {currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{currentUser.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {currentUser.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Palette className="mr-2 h-4 w-4" />
          <div className="flex items-center justify-between w-full">
            <span>Theme</span>
            <div className="flex items-center gap-2">
              <Button variant="ghost" className="w-fit h-fit" size="icon" onClick={() => setTheme("dark")}>
                <Moon className={`h-4 w-4 ${theme === "dark" ? "text-primary" : "text-muted-foreground/80"}`} />
              </Button>
              <Button variant="ghost" size="icon" className="w-fit h-fit" onClick={() => setTheme("light")}>
                <Sun className={`h-4 w-4 ${theme === "light" ? "text-primary" : "text-muted-foreground/80"}`} />
              </Button>
              <Button variant="ghost" className="w-fit h-fit" size="icon" onClick={() => setTheme("system")}>
                <MonitorSmartphoneIcon className={`h-4 w-4 ${theme === "system" ? "text-primary" : "text-muted-foreground/80"}`} />
              </Button>
            </div>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
