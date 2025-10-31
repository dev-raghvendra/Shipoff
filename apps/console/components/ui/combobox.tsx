"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export interface ComboboxOption {
  value: string
  label: string
  icon?: React.ReactNode
}

interface ComboboxProps {
  options: ComboboxOption[]
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  searchPlaceholder?: string
  emptyText?: string
  className?: string
  disabled?: boolean
  isLoading?: boolean
}

export function Combobox({
  options,
  value,
  onValueChange,
  placeholder = "Select option...",
  searchPlaceholder = "Search...",
  emptyText = "No option found.",
  className,
  disabled = false,
  isLoading = false,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [triggerWidth, setTriggerWidth] = React.useState<number>(300)
  const triggerRef = React.useRef<HTMLButtonElement>(null)

  const selectedOption = options.find((option) => option.value === value)

  React.useEffect(() => {
    if (triggerRef.current && open) {
      const width = triggerRef.current.offsetWidth
      // Only update if width has actually changed to prevent unnecessary re-renders
      setTriggerWidth(prev => prev !== width ? width : prev)
    }
  }, [open])

  // Don't render if loading
  if (isLoading) {
    return null
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          ref={triggerRef}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between gap-2", className)}
          disabled={disabled}
        >
          <span className="flex items-center gap-2 truncate">
            {selectedOption?.icon && selectedOption.icon}
            <span className="truncate">
              {selectedOption ? selectedOption.label : placeholder}
            </span>
          </span>
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="p-0" 
        align="start"
        style={{ 
          width: `${triggerWidth}px`
        }}
      >
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>{emptyText}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.label}
                  keywords={[option.label, option.value]}
                  onSelect={() => {
                    onValueChange?.(option.value)
                    setOpen(false)
                  }}
                  className="gap-2.5"
                >
                  <div className="flex items-center justify-start">
                  <Check
                    className={cn(
                      "h-4 w-4 shrink-0",
                      value === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option.icon && <span className="shrink-0 ml-2">{option.icon}</span>}
                  </div>
                  <span className="truncate ml-1">{option.label}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
