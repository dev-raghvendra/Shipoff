import { status } from "@grpc/grpc-js";
import { ZodObject, ZodType } from 'zod';
import { convertDatesToISO } from "./db-utils";

/**
 * Defines a gRPC RPC schema registry where each RPC action maps to a validation schema.
 * 
 * @template RPC_T The string union representing the list of RPC action names.
 */
export type RPC_SCHEMA_T<RPC_T extends string> = {
    [K in RPC_T]: {
        schema: ZodType
    }
}

/**
 * Helper to construct an RPC registry entry containing a validation schema.
 * 
 * @template T The Zod validation schema type.
 * @param schema The Zod schema to validate inputs against.
 * @returns An object containing the schema.
 */
export function createRPCEntry<T extends ZodType>(schema: T) {
    return {
        schema
    }
}

/**
 * Utility class to build standard gRPC status-based response objects.
 */
export class GrpcResponse {
  /**
   * Constructs a successful gRPC response (status code 0 / OK).
   * Automatically serializes Date objects within the response to ISO strings.
   * 
   * @template T The structure of the response payload.
   * @param res The response payload object.
   * @param message A user-facing status message.
   * @returns An object containing the status code, formatted payload, and message.
   */
  static OK<T>(res: T, message = "Success") {
    convertDatesToISO.apply(res as Object);
    return { code: status.OK, res, message };
  }

  /**
   * Constructs an error gRPC response with a specific status code.
   * 
   * @param code The gRPC status code (e.g. status.INVALID_ARGUMENT, status.UNAUTHENTICATED).
   * @param message The error message explaining the failure.
   * @param res Optional additional error payload metadata.
   * @returns An object containing the status code, payload, and message.
   */
  static ERROR(code: number, message: string, res: any = null) {
    return { code, res, message };
  }

  /**
   * Logs an unexpected error and constructs a standard internal server error response (status code 13 / INTERNAL).
   * 
   * @param message User-facing fallback error message.
   * @param subServiceName The name of the microservice reporting the error.
   * @param origin The module, function, or origin path where the error occurred.
   * @param error The raw caught error object/string.
   * @param logger Logger client used to output error details.
   * @param requestId The request ID tracing this execution.
   * @param res Optional error payload.
   * @returns An object containing the INTERNAL status code, payload, and message.
   */
  static INTERNAL(message = "Internal server error", subServiceName: string, origin: string, error:any, logger: {error: (msg: string) => void}, requestId:string, res: any = null) {
    const e = typeof error === "object" ? JSON.stringify(error,null,2) : error;
    logger.error(`[rid:${requestId}]: UNEXPECTED_ERROR_OCCURED_IN_${subServiceName}_AT_${origin}: ${e=="{}"?error:e}`);
    return this.ERROR(status.INTERNAL, message, res);
  }
}

/**
 * Converts a standard callback-based gRPC client call into a Promise.
 * 
 * @template Fn The function signature of the gRPC client call.
 * @param fn The gRPC client function to call.
 * @param req The request payload argument for the gRPC call.
 * @param errCode Optional override status code for errors.
 * @returns A promise resolving to the plain JavaScript object version of the gRPC response message.
 */
export function promisifyGrpcCall<
  Fn extends (req: any, callback: (err: any, res: any) => void) => void
>(
  fn: Fn,
  req: Parameters<Fn>[0],
  errCode?: number
): Promise<NonNullable<Parameters<Parameters<Fn>[1]>[1]>> {
  return new Promise((resolve, reject) => {
    fn(req, (err, res) => {
      if (err) return reject({
         code:errCode || err.code,
         message:err.message,
         res:err.res || null
      });
      resolve(res.toObject());
    });
  });
}


