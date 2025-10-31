import { useTheme } from "next-themes";

export function Logo({ className="h-10 w-auto" }: { className?: string }) {
    const {resolvedTheme} = useTheme();
    const src = resolvedTheme === "dark" ? "/meta/logo-dark.svg" : "/meta/logo-light.svg";

    return <img className={className} src={src} alt="Logo" />;
}