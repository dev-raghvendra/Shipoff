import { Request, Response, NextFunction } from "express";
import { requestContext } from "@/libs/context";
import { verifyJwt } from "@shipoff/services-commons";
import { UserType } from "@shipoff/types";



export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
    console.log("Auth Middleware: Checking Authorization Header");
    const authHeader = req.headers["authorization"];
    if(!authHeader || !authHeader.startsWith("Bearer ")) return unauthorizedResponse(res);
    const token = authHeader.split(" ")[1];
    if(!token) return unauthorizedResponse(res);
    try {
        const {authUserData} = await verifyJwt<{authUserData:UserType}>(token);
        console.log("Auth Middleware: User authenticated", authUserData.userId);
       requestContext.run({ user:authUserData }, next);
    } catch (error) {
        return unauthorizedResponse(res);
    }
}

function unauthorizedResponse(res: Response) {
    return res.setHeader("WWW-Authenticate",   `Bearer resource_metadata="https://mcp.shipoff.in/.well-known/oauth-protected-resource"`).status(401).end()
}