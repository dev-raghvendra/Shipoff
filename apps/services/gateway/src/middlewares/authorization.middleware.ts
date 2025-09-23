import { logger } from "@/libs/winston";
import { JsonWebTokenError, verifyJwt } from "@shipoff/services-commons";
import { NextFunction, Request, Response } from "express";

export async function authorizationMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split('Bearer ')[1]
        if (!token) throw new JsonWebTokenError("Token missing");
        const decoded = await verifyJwt(token);
        req.body = { ...req.body, authUserData: (decoded as any).authUserData };
        next();
    } catch (e: any) {
        if (e instanceof JsonWebTokenError) {
            res.status(401).json({ code: 401, message: "Unauthorized", res: null });
        }
        logger.error(`UNEXPECTED_ERROR_OCCURED_AT_AUTHORIZATION_MIDDLEWARE ${JSON.stringify(e, null, 2)}`);
        res.status(500).json({ code: 500, message: "Internal Server Error", res: null });
        return
    }
}