import { verifyJwt } from "@shipoff/services-commons";
import { JsonWebTokenError } from "jsonwebtoken";

export async function verifyBearerTokenHeader(header?:string) {
    const regex = /^Bearer\s+([A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+)$/
    if (!header) throw new JsonWebTokenError("No authorization header provided");
    if (!header.match(regex)) throw new JsonWebTokenError("Invalid authorization header format: Make sure to use Bearer <token>");
    const token = header.split("Bearer ")[1].trim();
    return await verifyJwt(token) as any
}