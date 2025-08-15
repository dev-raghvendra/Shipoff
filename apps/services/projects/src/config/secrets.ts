import { configDotenv } from "dotenv";

configDotenv();

export const SECRETS ={
    GITHUB_API_JWT_SECRET: String(process.env.GITHUB_API_JWT_SECRET),
    HOST: String(process.env.HOST),
    PORT: Number(process.env.PORT) || 50051,
    GITHUB_APP_ID: String(process.env.GITHUB_APP_ID),
    ENV: String(process.env.ENV || "development"),
} as const
