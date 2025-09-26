import { MiddlewareFunction } from "@/types/middleware";
import { verifyBearerTokenHeader } from "@/utils/req-util";
import { JsonWebTokenError } from "@shipoff/services-commons";

export const authorizationMiddleware :MiddlewareFunction = async(info,next) => {
    try {
       const header = info.req.headers["authorization"];
       const user = await verifyBearerTokenHeader(header) as any
       info.req.user = user.authUserData;
       return next();
   } catch (e:any) {
       if(e instanceof JsonWebTokenError) return next({code:401,message:"Unauthorized"});
       else return next({code:500,message:"Internal Server Error"});
   }
}