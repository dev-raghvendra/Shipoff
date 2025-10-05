import { PopulatedRequest } from "@/types/request";
import { NextFunction,Response } from "express";

export async function pollUpStreamMiddleware(req:PopulatedRequest,res:Response,next:NextFunction){
    try {
        if(req.method!=="HEAD") return next()
        await fetch((req.destination as URL).toString(),{method:"HEAD",headers:{
            "User-Agent": "Shipoff-Edge"
        }})
        res.status(204).end()
    } catch (e:any) {
        const code = e instanceof Error ? (e.cause as any)?.code : e
        if(code==="ECONNREFUSED" || code==="ENOTFOUND" || code==="ETIMEDOUT") return res.status(503).end()
        else throw e
    }
}