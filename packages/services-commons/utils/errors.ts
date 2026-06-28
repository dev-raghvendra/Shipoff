import { status } from "@grpc/grpc-js";
import {GrpcResponse} from "./rpc-utils";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";

/**
 * Custom application-level error class mapping directly to gRPC statuses.
 * Thrown within services/handlers to signal specific API errors.
 */
export class GrpcAppError  {
  public code: number;
  public res: any;
  public message: string;

  /**
   * Creates a new GrpcAppError.
   * 
   * @param code The gRPC status code (e.g. status.NOT_FOUND, status.ALREADY_EXISTS).
   * @param message User-facing description of the error.
   * @param res Optional additional error payload metadata.
   */
  constructor(code: number, message: string, res: any = null) {

    this.code = code;
    this.res = res;
    this.message = message
  }
}

/**
 * Creates a gRPC-compliant error handler function for a specific microservice.
 * 
 * @param config Configuration object.
 * @param config.subServiceName The name of the microservice (e.g. AUTH_SERVICE).
 * @param config.logger Logger client used to output error details.
 * @returns A handler function that catches and maps error objects to standard GrpcResponse structures.
 */
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

/**
 * Creates a catch-block handler for promises to log unexpected failures asynchronously.
 * 
 * @param config Configuration object.
 * @param config.subServiceName The name of the microservice.
 * @param config.logger Logger client used to output error details.
 * @returns A utility function that binds to a Promise and logs any rejected state.
 */
export function createAsyncErrHandler({subServiceName,logger}:{subServiceName:string,logger:{error:(msg:string)=>void}}){
   return function(this:Promise<any>,origin:string,requestId:string){
      this.catch((err) => {
          const e = typeof err === "object" ? JSON.stringify(err,null,2) : err;
          logger.error(`[rid:${requestId}]: UNEXPECTED_ERROR_OCCURED_IN_${subServiceName}_AT_${origin}: ${e=="{}"?err:e}`);
      });
   }
}

/**
 * Factory to create a JWT error handler that maps token expiration or parsing errors to gRPC UNAUTHENTICATED statuses.
 * 
 * @param config Configuration object.
 * @param config.invalidErrMsg Error message for malformed tokens.
 * @param config.expiredErrMsg Error message for expired tokens.
 * @returns A handler that takes a JsonWebTokenError and returns a formatted GrpcResponse error.
 */
export function createJwtErrHandler({invalidErrMsg="Invalid access token",expiredErrMsg="Access token expired"}:{invalidErrMsg?:string,expiredErrMsg?:string}){
   return function(e: JsonWebTokenError){
      if(e instanceof TokenExpiredError){
         return GrpcResponse.ERROR(status.UNAUTHENTICATED, expiredErrMsg)
      }
      return GrpcResponse.ERROR(status.UNAUTHENTICATED, invalidErrMsg)
   }
}

/**
 * Creates a synchronous error logger utility for logging unhandled/unexpected exceptions.
 * 
 * @param config Configuration object.
 * @param config.subServiceName The name of the microservice.
 * @param config.logger Logger client used to output error details.
 * @returns A function to log exceptions with request contexts.
 */
export function createSyncErrHandler({subServiceName,logger}:{subServiceName:string,logger:{error:(msg:string)=>void}}){
   return function(err: Error | object | string,origin: string,requestId:string,message?:string){
      const e = typeof err === "object" ? JSON.stringify(err,null,2) : err;
      logger.error(`[rid:${requestId}]: UNEXPECTED_ERROR_OCCURED_IN_${subServiceName}_AT_${origin}_${message || ""}: ${e=="{}"?err:e}`);
   }
}

export {TokenExpiredError}