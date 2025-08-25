import {config} from "dotenv"
import {resolve} from "path";
import { cwd } from "process";

export function loadEnv(){
    config({path: resolve(__dirname, "../../../.env.root")})
    config({path:resolve(cwd(), ".env")})
}