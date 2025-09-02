import { status } from "@grpc/grpc-js";
import {GrpcResponse} from "./rpc-utils";
import {logger} from "../libs/winston";
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
  serviceName
}: {
  serviceName: string;
}) {
  return function handleError(error: GrpcAppError,origin: string) {
    if(!Object.values(status).includes(error.code) || error.code === status.INTERNAL){
      return GrpcResponse.INTERNAL("Unexpected error occurred",origin,serviceName,error);
    }
    return GrpcResponse.ERROR(error.code,error.message,error.res);
  }
}

export function createAsyncErrHandler({serviceName}:{serviceName:string}){
   return function(this:Promise<any>,origin:string){
      this.catch((err) => {
          const e = typeof err === "object" ? JSON.stringify(err,null,2) : err;   
          logger.error(`UNEXPECTED_ERROR_OCCURED_IN_${serviceName}_AT_${origin}: ${e}`);
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

export function createSyncErrHandler({serviceName}:{serviceName:string}){
   return function(err: Error,origin: string){
      const e = typeof err === "object" ? JSON.stringify(err,null,2) : err;
      logger.error(`UNEXPECTED_ERROR_OCCURED_IN_${serviceName}_AT_${origin}: ${e}`);
   }
}

export {TokenExpiredError}