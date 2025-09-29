import { PopulatedRequest } from "@/types/request";
import { createAsyncErrHandler } from "@shipoff/services-commons/utils/errors";
import { NextFunction, Response } from "express";
import { logger } from "@/libs/winston";
import { DeploymentProducer } from "@/producer/deployment.producer";
import { notFound, ok, serviceUnavailable } from "@/util/res.util";
import { request as httpRequest } from "http";
import { request as httpsRequest } from "https";
import { CachedProject } from "@/cache/project.cache";

const producer = new DeploymentProducer()
const errHandler = createAsyncErrHandler({ subServiceName: "MIDDLEWARES", logger })
const request = {
   "http:": httpRequest,
   "https:": httpsRequest
}

export async function proxyMiddleware(req: PopulatedRequest, res: Response, next: NextFunction) {
   const proxyReq = request[req.destination?.protocol as keyof typeof request](req.proxyReqOptions as any, (proxyRes) => {
      if (proxyRes.statusCode === 404 && req.project?.projectType === "STATIC") {
         return notFound.call(res, req)
      }
      ok.call(res, req, proxyRes)
      proxyRes.pipe(res)
   });
   req.pipe(proxyReq)
   proxyReq.on("error", (err: NodeJS.ErrnoException) => {
      if (["ECONNREFUSED", "ENOTFOUND", "ETIMEDOUT"].includes(err.code as string)) {
         errHandler.call(producer.publishDeploymentRequested(req.project as CachedProject), "ON-PROXY-RES", req.rid as string)
         return serviceUnavailable.call(res, req)
      }
      return next(err)
   })
}


