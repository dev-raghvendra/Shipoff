import { MiddlewareFunction } from "@/types/middleware";
import { v4 as uuid} from "uuid";

export const ridMiddleware : MiddlewareFunction = (info,next)=>{
    const requestId = `rid-${uuid()}`;
    info.req.meta = {requestId};
    info.req.headers['x-request-id'] = requestId;
    next()
}