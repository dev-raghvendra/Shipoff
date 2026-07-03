import { loadEnv } from "@shipoff/services-commons"

loadEnv()

export const SECRETS = {
    API_KEY_SECRET: String(process.env.API_KEY_SECRET?.trim())
} as const