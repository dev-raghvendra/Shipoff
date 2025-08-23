import {config} from "dotenv"
import {resolve} from "path";
import { cwd } from "process";

export function loadEnv(){
    config({path: resolve(__dirname, "../../../root.env")})
    config({path:resolve(cwd(), ".env")})
}