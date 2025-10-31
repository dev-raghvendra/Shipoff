import { CONFIG } from "@/config";
import { MiddlewareFunction } from "@/types/middleware";
import { JsonWebTokenError, verifyJwt } from "@shipoff/services-commons";

export const authorizationMiddleware :MiddlewareFunction = async(info,next) => {
    try {
       const token = new URL(info.req.url!,CONFIG.BACKEND_WS_API_URL).searchParams.get("access_token") ;
       info.req.user = (await verifyJwt<{authUserData:{}}>(token || "")).authUserData
       return next();
   } catch (e:any) {
       console.error("Authorization error:", e);
       if(e instanceof JsonWebTokenError) return next({code:401,message:"Unauthorized"});
       else return next({code:500,message:"Internal Server Error"});
   }
}