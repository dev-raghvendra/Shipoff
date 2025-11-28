export const CONFIG = {
    PORT:Number(process.env.PORT) || 8000,
    POST_GITHUB_INSTALLATION_FRONTEND_DESTINATION: String(process.env.POST_GITHUB_INSTALLATION_FRONTEND_DESTINATION || "http://localhost:3000/projects/new"),
    BACKEND_API_URL:String(process.env.BACKEND_API_URL || "http://localhost:8000"),
    BACKEND_WS_API_URL:String(process.env.BACKEND_WS_API_URL || "ws://localhost:8000"),
    FRONTEND_URL:new RegExp(process.env.FRONTEND_URL || "http://localhost:3000"),
} as const

export const WS_ROUTES = {
    "/apis/v1/ws/logs/stream":"/logs/stream"
} as const
