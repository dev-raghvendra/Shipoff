import { WS_ROUTES } from "@/config";
import { MiddlewareFunction } from "@/types/middleware";


export const routingMiddleware:MiddlewareFunction = (info,next)=>{
    const url = new URL(info.req.url!,`http://${info.req.headers.host}`);
    info.req.URL = url;
    const path = url.pathname;
    if(!Object.hasOwn(WS_ROUTES,path)) return next({code:404,message:"WS endpoint not found"})
    next()
 }