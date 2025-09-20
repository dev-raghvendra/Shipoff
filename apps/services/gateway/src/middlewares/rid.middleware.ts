import { v4 as uuidv4 } from 'uuid';
export async function ridMiddleware(req:any, res:any, next:any) {
    const rid = "rid-"+uuidv4();
    req.body = { ...req.body, rid };
    res.setHeader('X-Request-ID', rid);
    next()
}