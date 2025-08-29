import { configDotenv } from "dotenv";
import {readFileSync} from "fs";
import path from "path";

configDotenv();

export const SECRETS ={
    GITHUB_API_JWT_SECRET: readFileSync(path.resolve(__dirname, 'private-key.pem'),'utf-8').trim(),
    GITHUB_PAYLOAD_SECRET: String(process.env.GITHUB_PAYLOAD_SECRET),
    HOST: String(process.env.HOST),
    PORT: Number(process.env.PORT) || 50051,
    GITHUB_APP_ID: Number(process.env.GITHUB_APP_ID)
} as const

