import { ServerWritableStream } from "@grpc/grpc-js";

export function endStreamWithError(this:ServerWritableStream<any,any>,code:number,message:string){
    this.emit("error",{code,message})
    this.end()
}