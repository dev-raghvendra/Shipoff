import { configDotenv } from "dotenv"

configDotenv()
const SECRETS = {
    PORT:String(process.env.PORT),
    HOST:String(process.env.HOST),
    FREE_SUBSCRIPTION_PERKS_ID:String(process.env.FREE_SUBSCRIPTION_PERKS_ID),
    PRO_SUBSCRIPTION_PERKS_ID:String(process.env.PRO_SUBSCRIPTION_PERKS_ID)
} as const

export default SECRETS
