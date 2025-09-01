export const CONFIG = {
    ENV:String(process.env.ENV),
    ORCHESTRATOR_URL:String(process.env.ORCHESTRATOR_URL),
    ORCHESTRATOR_WEBHOOK_URI:String(process.env.ORCHESTRATOR_WEBHOOK_URI)
} as const;
