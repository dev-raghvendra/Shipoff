"use client"
import { useTheme } from "next-themes";

export function Logo({ className="h-10 w-auto" }: { className?: string }) {
    const {resolvedTheme} = useTheme();
    const src = resolvedTheme === "dark" ? "/meta/logo-dark.svg" : "/meta/logo-light.svg";

    return (
      <img
        src={src}
        alt="Logo"
        className={className}
      />
    );
}