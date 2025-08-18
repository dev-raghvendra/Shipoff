import { verifyJwt } from "@shipoff/services-commons";
import { NextFunction, Request, Response } from "express";

export async function authorizationMiddleware(req: Request, res: Response, next: NextFunction) {
   try {
       const authHeader = req.headers.authorization;
       const token = authHeader && authHeader.split('Bearer ')[1]
       if(!token){
           throw false;
        }
        const decoded = await verifyJwt(token);
        req.body = { ...req.body, authUserData: (decoded as any).authUserData };
        next();
   } catch (e:any) {
       res.status(401).json({
           code: 401,
           message: "Unauthorized",
           res: null
       });
       return;
   }
}