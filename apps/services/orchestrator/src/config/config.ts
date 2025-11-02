export const CONFIG = {
    ENV:String(process.env.ENV),
    ORCHESTRATOR_URL:String(process.env.ORCHESTRATOR_URL),
    ORCHESTRATOR_WEBHOOK_URI:String(process.env.ORCHESTRATOR_WEBHOOK_URI),
    BASE_IMAGE_PREFIX:String(process.env.BASE_IMAGE_PREFIX),
    FREE_TIER_MEMORY_LIMIT_BYTES: Number(process.env.FREE_TIER_MEMORY_LIMIT_BYTES) || 750*1024*1024,
    K8S_NODE_NAME:String(process.env.K8S_NODE_NAME),
} as const;
