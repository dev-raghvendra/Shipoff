"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function Logo({ className="h-10 w-auto" }: { className?: string }) {
    const {resolvedTheme} = useTheme();
    const [src, setSrc] = useState("/meta/logo-light.svg");

    useEffect(() => {
      const newSrc = resolvedTheme === "dark" ? "/meta/logo-dark.svg" : "/meta/logo-light.svg";
      setSrc(newSrc);
    }, [resolvedTheme]);
    return (
      <img
        src={src}
        alt="Logo"
        className={className}
      />
    );
}