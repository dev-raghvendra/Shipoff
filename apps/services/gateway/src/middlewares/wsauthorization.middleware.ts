import { LogsWebSocketIncomingMessage } from "@/types/request";
import { JsonWebTokenError, verifyJwt } from "@shipoff/services-commons";
import { VerifyClientCallbackAsync } from "ws";

export const wsAuthorizationMiddleware:VerifyClientCallbackAsync<LogsWebSocketIncomingMessage> = async(info,done)=>{
   try {
       const header = info.req.headers["authorization"];
       if(!header) throw new JsonWebTokenError("No authorization header provided");
       const token = header.split(" ")[1].trim();
       if(!token) throw new JsonWebTokenError("No token provided");
       const user = await verifyJwt(token) as any;
       info.req.user = user.authUserData;
       const url = new URL(info.req.url!, `http://${info.req.headers.host}`);
       const envId = url.searchParams.get("envId");
       const projectId = url.searchParams.get("projectId");
       info.req.params = {envId:envId!,projectId:projectId!}
       done(true)
   } catch (e:any) {
       if(e instanceof JsonWebTokenError) done(false,401,"Unauthorized")
       else done(false,500,"Internal Server Error")
   }
}