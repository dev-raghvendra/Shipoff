import { CONFIG } from "@/config";
import { PopulatedRequest } from "@/types/request";
import { Response } from "express";
import { IncomingHttpHeaders, IncomingMessage } from "http";


export function getDefaultHeaders(requestId:string,headers?:IncomingHttpHeaders){
    return new Headers({
        ...(headers || {}) as any,
        'X-Request-Id': requestId,
        'X-Server':'Shipoff-Ingress',
        'X-Powered-By':'Shipoff',
        'X-Served-By':'Shipoff-Edge',
    })
}

export function notFound(this:Response,req:PopulatedRequest){
    return this.status(404).setHeaders(getDefaultHeaders(req.rid as string)).send(
        CONFIG.NOT_FOUND.replace("{{REQUEST_ID_HERE}}",req.rid as string).replaceAll("{{URL_HERE}}",`${req.hostname}${req.url}` as string)
    )
}

export function serviceUnavailable(this:Response,req:PopulatedRequest){
    return this.status(503).setHeaders(getDefaultHeaders(req.rid as string)).send(
        CONFIG.SERVICE_UNAVAILABLE.replace("{{PROJECT_NAME_HERE}}",req.project?.domain as string)
    )
}

export function ok(this:Response,req:PopulatedRequest,proxyRes:IncomingMessage){
    return this.status(proxyRes.statusCode as number).setHeaders(getDefaultHeaders(req.rid as string,proxyRes.headers))
}

export function internalErr(this:Response,req:PopulatedRequest){
    return this.status(500).setHeaders(getDefaultHeaders(req.rid as string)).send(
        CONFIG.INTERNAL_ERROR.replace("{{REQUEST_ID_HERE}}",req.rid as string).replace("{{URL_HERE}}",`${req.hostname}${req.url}` as string)
    )
}