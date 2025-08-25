import { loadEnv } from "@shipoff/services-commons";
loadEnv();

export const CONFIG = {
    ENV:String(process.env.ENV)
} as const;