import { logger } from "@/libs/winston";
import { verifyBearerTokenHeader } from "@/utils/req-util";
import { JsonWebTokenError } from "@shipoff/services-commons";
import { NextFunction, Request, Response } from "express";

export async function authorizationMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
        const header = req.headers["authorization"];
        const decoded = await verifyBearerTokenHeader(header) as any
        req.body = { ...req.body, authUserData: decoded.authUserData };
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