export const SECRETS = {
    HOST:String(process.env.HOST),
    PORT:Number(process.env.PORT),
    MONGODB_URI:String(process.env.MONGODB_URI),
    NODE_BUILDER_IMAGE:String(process.env.NODE_BUILDER_IMAGE),
    NODE_PROD_IMAGE:String(process.env.NODE_PROD_IMAGE),
    S3_BUCKET_URI:String(process.env.S3_BUCKET_URI),
    S3_SECRET_KEY:String(process.env.S3_SECRET_KEY),
    S3_ACCESS_KEY:String(process.env.S3_ACCESS_KEY),
    S3_REGION:String(process.env.S3_REGION),
    S3_ENDPOINT:String(process.env.S3_ENDPOINT),
    S3_BUCKET_NAME:String(process.env.S3_BUCKET_NAME)
} as const