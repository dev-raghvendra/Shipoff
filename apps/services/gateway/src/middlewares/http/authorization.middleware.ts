import { logger } from "@/libs/winston";
import { verifyBearerTokenHeader } from "@/utils/req-util";
import { JsonWebTokenError } from "@shipoff/services-commons";
import { NextFunction,  Response } from "express";
import { createSyncErrHandler } from "@shipoff/services-commons";
import { RequestWithMeta } from "@/types/request";

const errHandler = createSyncErrHandler({ subServiceName: "AUTHORIZATION_MIDDLEWARE", logger });


export async function authorizationMiddleware(req: RequestWithMeta, res: Response, next: NextFunction) {
    try {
        const header = req.headers["authorization"];
        const decoded = await verifyBearerTokenHeader(header) as any
        req.body = { ...req.body, authUserData: decoded.authUserData };
        next();
    } catch (e: any) {
        if (e instanceof JsonWebTokenError) return res.status(401).json({ code: 401, message: "Unauthorized", res: null });
        errHandler(e,"AUTHORIZATION",req.meta?.requestId || "N/A");
        res.status(500).json({ code: 500, message: "Internal Server Error", res: null });
        return
    }
}