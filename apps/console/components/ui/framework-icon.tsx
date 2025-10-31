import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"
import Image from "next/image"

interface FrameworkIconProps {
  src: string
  alt: string
  className?: string
  applyThemeColor?: boolean
}

export function FrameworkIcon({ 
  src, 
  alt, 
  className = "h-6 w-6"
}: FrameworkIconProps) {

  const {theme} = useTheme()

  return (
    <Image 
      src={theme === "dark" ? `/framework/${src}-dark.svg` : `/framework/${src}-light.svg`}
      alt={alt}
      className={cn("object-contain", className)}
      onError={(e) => {
        (e.target as HTMLImageElement).src = `/framework/${src}.svg`
      }}
      width={16}
      height={16}
    />
  )
}








