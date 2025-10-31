import { useTheme } from "next-themes";

export function Logo({ className="h-10 w-auto" }: { className?: string }) {
    const {theme} = useTheme();
    const src = theme === "dark" ? "/meta/logo-dark.svg" : "/meta/logo-light.svg";

    return <img className={className} src={src} alt="Logo" />;
}