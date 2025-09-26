import { WebSocketRequest } from "@/types/request";
import { VerifyClientCallbackAsync } from "ws";
import { MiddlewareFunction } from "@/types/middleware";

export const startWSMiddlewareChain = (...middlewares:MiddlewareFunction[])=>{
    const chain : VerifyClientCallbackAsync<WebSocketRequest> = async(info,done) =>{
        let crr = 0;
        const next : Parameters<MiddlewareFunction>[1] = (err)=>{
         crr++;
         if(err) return done(false,err.code,err.message)
         if(crr < middlewares.length){
            middlewares[crr](info,next)
         }
         else done(true)
        }
        if(middlewares.length > 0) middlewares[0](info,next)
        else done(true)
    }
    return chain
}



