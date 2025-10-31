import { ZodTypeAny, parseAsync } from "zod";
import { ServerWritableStream,  status } from "@grpc/grpc-js";

// Protobuf-compatible message type check
interface ProtobufMessage {
  toObject(): Record<string, any>;
}
type MaybeProtobufMessage<T = any> = T | ProtobufMessage;

function isProtobufMessage(obj: any): obj is ProtobufMessage {
  return obj && typeof obj.toObject === "function";
}
function extractRequestData<T>(request: MaybeProtobufMessage<T>): any {
  return isProtobufMessage(request) ? request.toObject() : request;
}

// SchemaMap generic
type SchemaMap = Record<
  string,
  {
    schema: ZodTypeAny;
    errMsg?: string;
  }
>;

// Inferred schema type
type SchemaType<Map extends SchemaMap, K extends keyof Map> = 
  Map[K]["schema"] extends ZodTypeAny ? ReturnType<Map[K]["schema"]["parse"]> : never;

// Call with validated body
 type ValidatedCall<
  Map extends SchemaMap,
  K extends keyof Map,
  TReq,
  TRes
> = ServerWritableStream<TReq & { body: SchemaType<Map, K> }, TRes>;

/**
 * Universal RPC validator for any schema map
 */
export function createStreamValidator<Map extends SchemaMap>(schemaMap: Map, logger: {error: (msg: string) => void}) {
  return function validateBody<
    K extends keyof Map,
    TReq extends MaybeProtobufMessage,
    TRes
  >(
    method: K,
    handler: (
      call: ValidatedCall<Map, K, TReq, TRes>
    ) => void
  ) {
    return async (
      call: ServerWritableStream<TReq, TRes>
    ) => {
      try {
        const raw = extractRequestData(call.request)  
        const schema = schemaMap[method].schema;
        const parsed = await parseAsync(schema, raw);
        const callWithBody = call as unknown as ValidatedCall<Map, K, TReq, TRes>;
        (callWithBody.request as any).body = parsed;
        handler(callWithBody);
      } catch(e:any){
        call.emit("error",{
          code: status.INVALID_ARGUMENT,
          message: `${e.issues[0].path.join("->")}: ${e.issues[0].message}` || schemaMap[method].errMsg || "Invalid request body"
        })
        call.end();
      }
    };
  };
}
