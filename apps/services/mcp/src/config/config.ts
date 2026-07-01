import { configDotenv } from "dotenv";
configDotenv()

export const CONFIG = {
    MCP_SERVER_NAME:String(process.env.MCP_SERVER_NAME || "shipoff-mcp"),
    MCP_SERVER_VERSION:String(process.env.MCP_SERVER_VERSION || "0.0.1"),
} as const;
export const SECRETS = {
    JWT_SECRET:process.env.JWT_SECRET

} as const;