"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function Logo({ className="h-10 w-auto" , externalSrc}: { className?: string , externalSrc?:string}) {
    const {resolvedTheme} = useTheme();
    const [src, setSrc] = useState("/meta/logo-light.svg");

    useEffect(() => {
      if(externalSrc) return;
      const newSrc = resolvedTheme === "dark" ? "/meta/logo-dark.svg" : "/meta/logo-light.svg";
      setSrc(newSrc);
    }, [resolvedTheme]);
    return (
      <img
        src={externalSrc ||src}
        alt="Logo"
        className={className}
      />
    );
}