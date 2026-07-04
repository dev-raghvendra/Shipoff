export const CONFIG = {
   LOGIN_URL: String(process.env.NEXT_PUBLIC_LOGIN_URL || "htts://console.shipoff.in/login"),
   DASHBOARD_URL: String(process.env.NEXT_PUBLIC_DASHBOARD_URL || "https://console.shipoff.in/dashboard/overview"),
   ACCOUNT_URL: String(
      process.env.NEXT_PUBLIC_ACCOUNT_URL ||
      String(process.env.NEXT_PUBLIC_LOGIN_URL || "https://console.shipoff.in/login").replace(/\/login$/, "/dashboard/account")
   ),
   GITHUB_URL: String(process.env.NEXT_PUBLIC_GITHUB_URL || "https://github.com/dev-raghvendra/Shipoff"),
   EMAIL_SUPPORT: String(process.env.NEXT_PUBLIC_EMAIL_SUPPORT || "teamshipoff@gmail.com"),
   MCP_URL: String(process.env.NEXT_PUBLIC_MCP_URL || "https://mcp.shipoff.in/mcp"),
} as const