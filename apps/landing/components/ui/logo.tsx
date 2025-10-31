"use client"
import { useTheme } from "next-themes";
import {useEffect, useState} from "react";

export function Logo({ className="h-10 w-auto" }: { className?: string }) {
    const {theme} = useTheme();
    const [src, setSrc] = useState("");

    useEffect(() => {
      setSrc(theme === "dark" ? "/meta/logo-dark.svg" : "/meta/logo-light.svg");
    }, [theme]);

    return <img className={className} src={src} alt="Logo" />;
}