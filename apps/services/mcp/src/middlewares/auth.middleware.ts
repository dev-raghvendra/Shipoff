import { Request, Response, NextFunction } from "express";
import { requestContext } from "@/libs/context";
import { verifyJwt } from "@shipoff/services-commons";
import { UserType } from "@shipoff/types";
import { unauthorizedResponse } from "@/utils/response.utils";



export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers["authorization"];
    if(!authHeader || !authHeader.startsWith("Bearer ")) return unauthorizedResponse(res);
    const token = authHeader.split(" ")[1];
    if(!token) return unauthorizedResponse(res);
    const {authUserData} = await verifyJwt<{authUserData:UserType}>(token);
    requestContext.run({ user:authUserData }, next);
}

