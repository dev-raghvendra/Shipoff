import { PopulatedRequest } from "@/types/request";
import { NextFunction, Response } from "express";
import { RequestOptions } from "http";

export function createProxyReqMiddleware(req:PopulatedRequest,_:Response,next:NextFunction){
    const options : RequestOptions = {
        method:req.method,
        hostname:req.destination?.hostname,
        port:req.destination?.port,
        protocol:req.destination?.protocol,
        path:req.destination?.pathname+req.destination?.search!,
        headers:{
            ...req.headers,
            host:(req.project!.projectType === "DYNAMIC" ? req.project!.domain : req.destination?.host) || ''
        }
    }
    req.proxyReqOptions = options
    next()
}