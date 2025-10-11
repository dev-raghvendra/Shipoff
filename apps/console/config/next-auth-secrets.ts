export const NEXT_AUTH_SECRETS = {
    NEXTAUTH_SECRET: String(process.env.NEXTAUTH_SECRET),
    MAIN_BACKEND_API_KEY: String(process.env.MAIN_BACKEND_API_KEY),
    GOOGLE_CLIENT_ID: String(process.env.GOOGLE_CLIENT_ID),
    GOOGLE_CLIENT_SECRET: String(process.env.GOOGLE_CLIENT_SECRET),
    GITHUB_CLIENT_ID: String(process.env.GITHUB_CLIENT_ID),
    GITHUB_CLIENT_SECRET: String(process.env.GITHUB_CLIENT_SECRET)
} as const