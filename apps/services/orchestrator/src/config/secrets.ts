export const SECRETS = {
    HOST:String(process.env.HOST),
    PORT:Number(process.env.PORT),
    DATABASE_URI:String(process.env.DATABASE_URI),
    BUCKET_URI:String(process.env.BUCKET_URI),
    ORCHESTRATOR_OCI_SECRET_KEY:String(process.env.ORCHESTRATOR_OCI_SECRET_KEY),
    ORCHESTRATOR_OCI_ACCESS_KEY:String(process.env.ORCHESTRATOR_OCI_ACCESS_KEY),
    BUCKET_REGION:String(process.env.BUCKET_REGION),
    BUCKET_ENDPOINT:String(process.env.BUCKET_ENDPOINT),
    BUCKET_NAME:String(process.env.BUCKET_NAME),
    ORCHESTRATOR_WEBHOOK_PAYLOAD_SECRET:String(process.env.ORCHESTRATOR_WEBHOOK_PAYLOAD_SECRET)
} as const



