import { loadEnv } from "@shipoff/services-commons";
loadEnv();

export const CONFIG = {
    MONGODB_URI:String(process.env.MONGODB_URI),
    ENV:String(process.env.ENV),
    NODE_BUILDER_IMAGE:String(process.env.NODE_BUILDER_IMAGE),
    NODE_PROD_IMAGE:String(process.env.NODE_PROD_IMAGE)
} as const;