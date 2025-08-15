import { configDotenv } from "dotenv"

configDotenv()
const SECRETS = {
    PORT:String(process.env.PORT),
    HOST:String(process.env.HOST)
} as const

export default SECRETS
