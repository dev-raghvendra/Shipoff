export const CONFIG = {
    PORT:Number(process.env.PORT) || 8000,
    POST_GITHUB_INSTALLATION_FRONTEND_DESTINATION: String(process.env.POST_GITHUB_INSTALLATION_FRONTEND_DESTINATION || "http://localhost:3000/projects/new")
} as const

export const WS_ROUTES = {
    "/ws/logs/stream":"/logs/stream"
} as const
