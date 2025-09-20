export const CONFIG = {
    ENV:String(process.env.ENV),
    ORCHESTRATOR_URL:String(process.env.ORCHESTRATOR_URL),
    ORCHESTRATOR_WEBHOOK_URI:String(process.env.ORCHESTRATOR_WEBHOOK_URI),
    BASE_IMAGE_PREFIX:String(process.env.BASE_IMAGE_PREFIX)
} as const;
