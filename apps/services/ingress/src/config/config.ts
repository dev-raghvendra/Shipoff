import { readFileSync } from "fs";
import path from "path";

export const CONFIG = {
    EMPTY_URL: process.env.EMPTY_URL,
    NOT_FOUND: readFileSync(path.join(__dirname, "..","static","404.html"), "utf-8"),
    SERVICE_UNAVAILABLE: readFileSync(path.join(__dirname, "..","static","503.html"), "utf-8"),
    INTERNAL_ERROR:readFileSync(path.join(__dirname, "..","static","500.html"), "utf-8")
} as const


