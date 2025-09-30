export const SECRETS = {
    HOST:String(process.env.HOST),
    PORT:Number(process.env.PORT),
    BUCKET_REGION:String(process.env.BUCKET_REGION),
    BUCKET_ENDPOINT:String(process.env.BUCKET_ENDPOINT),
    BUCKET_SECRET_ACCESS_KEY_ID:String(process.env.BUCKET_SECRET_ACCESS_KEY_ID),
    BUCKET_SECRET_ACCESS_KEY:String(process.env.BUCKET_SECRET_ACCESS_KEY),
    BUCKET_NAME:String(process.env.BUCKET_NAME),
} as const