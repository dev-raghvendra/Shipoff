import {configDotenv} from "dotenv"
import path from "path";
import {cwd} from "process";
configDotenv({path:path.join(cwd(),"../../../packages/grpc-clients",".env")});
export const CONFIG = {
    GRPC_AUTH_SERVICE_URL: String(process.env.GRPC_AUTH_SERVICE_URL || "localhost:50051"),
    GRPC_PROJECT_SERVICE_URL: String(process.env.GRPC_PROJECT_SERVICE_URL || "localhost:50051"),
} as const