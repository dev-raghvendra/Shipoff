import { v4 as uuidv4 } from 'uuid';
export async function ridMiddleware(req:any, res:any, next:any) {
    const requestId = "rid-"+uuidv4();
    req.meta = {requestId};
    res.setHeader('X-Request-ID', requestId);
    next()
}