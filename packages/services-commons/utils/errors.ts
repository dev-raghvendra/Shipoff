import { status } from "@grpc/grpc-js";
import {GrpcResponse} from "./rpc-utils";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";

export class GrpcAppError  {
  public code: number;
  public res: any;
  public message: string;

  constructor(code: number, message: string, res: any = null) {

    this.code = code;
    this.res = res;
    this.message = message
  }
}


export function createGrpcErrorHandler({
  subServiceName,
  logger
}: {
  subServiceName: string;
  logger: { error: (msg: string) => void }
}) {
  return function handleError(error: GrpcAppError,origin: string,requestId:string) {
    if(!Object.values(status).includes(error.code) || error.code === status.INTERNAL){
      return GrpcResponse.INTERNAL("Unexpected error occurred",origin,subServiceName,error,logger,requestId);
    }
    return GrpcResponse.ERROR(error.code,error.message,error.res);
  }
}

export function createAsyncErrHandler({subServiceName,logger}:{subServiceName:string,logger:{error:(msg:string)=>void}}){
   return function(this:Promise<any>,origin:string,requestId:string){
      this.catch((err) => {
          const e = typeof err === "object" ? JSON.stringify(err,null,2) : err;
          logger.error(`[rid:${requestId}]: UNEXPECTED_ERROR_OCCURED_IN_${subServiceName}_AT_${origin}: ${e=="{}"?err:e}`);
      });
   }
}

export function createJwtErrHandler({invalidErrMsg="Invalid access token",expiredErrMsg="Access token expired"}:{invalidErrMsg?:string,expiredErrMsg?:string}){
   return function(e: JsonWebTokenError){
      if(e instanceof TokenExpiredError){
         return GrpcResponse.ERROR(status.UNAUTHENTICATED, expiredErrMsg)
      }
      return GrpcResponse.ERROR(status.UNAUTHENTICATED, invalidErrMsg)
   }
}

export function createSyncErrHandler({subServiceName,logger}:{subServiceName:string,logger:{error:(msg:string)=>void}}){
   return function(err: Error | object | string,origin: string,requestId:string,message?:string){
      const e = typeof err === "object" ? JSON.stringify(err,null,2) : err;
      logger.error(`[rid:${requestId}]: UNEXPECTED_ERROR_OCCURED_IN_${subServiceName}_AT_${origin}_${message || ""}: ${e=="{}"?err:e}`);
   }
}

export {TokenExpiredError}