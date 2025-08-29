export const CONFIG = {
    GITHUB_API_BASE_URL:String(process.env.GITHUB_API_BASE_URL),
    ENV: String(process.env.ENV || "development")
} as const