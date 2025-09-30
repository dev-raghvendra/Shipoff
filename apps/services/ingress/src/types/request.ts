import { CachedProject } from "@/cache/project.cache"
import { Request } from "express"
import { RequestOptions } from "https"

export interface PopulatedRequest extends Request {
    project?:CachedProject,
    rid?:string,
    destination?:URL,
    proxyReqOptions?:RequestOptions
}