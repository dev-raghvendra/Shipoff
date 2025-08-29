export const CONFIG = {
    ENV:String(process.env.ENV),
    ORCHESTRATOR_ENDPOINT:String(process.env.ORCHESTRATOR_ENDPOINT)
} as const;