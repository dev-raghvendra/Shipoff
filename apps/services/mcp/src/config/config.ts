import { configDotenv } from "dotenv";
configDotenv()

export const CONFIG = {
    MCP_SERVER_NAME:String(process.env.MCP_SERVER_NAME || "shipoff-mcp"),
    MCP_SERVER_VERSION:String(process.env.MCP_SERVER_VERSION || "0.0.1"),
    REQ_IDEMPOTENCY_KEY_TTL:Number(process.env.REQ_IDEMPOTENCY_KEY_TTL || 60 * 60 * 24)
} as const;
export const SECRETS = {
    JWT_SECRET:process.env.JWT_SECRET

} as const;