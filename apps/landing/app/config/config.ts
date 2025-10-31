export const CONFIG = {
   LOGIN_URL: String(process.env.NEXT_PUBLIC_LOGIN_URL || "http://localhost:3000/login"),
   DASHBOARD_URL: String(process.env.NEXT_PUBLIC_DASHBOARD_URL || "http://localhost:3000/dashboard/overview"),
   GITHUB_URL: String(process.env.NEXT_PUBLIC_GITHUB_URL || "https://github.com/dev-raghvendra/Shipoff"),
   EMAIL_SUPPORT: String(process.env.NEXT_PUBLIC_EMAIL_SUPPORT || "support@shipoff.in")
} as const