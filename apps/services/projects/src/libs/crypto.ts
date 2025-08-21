import { status } from "@grpc/grpc-js";
import { GrpcAppError } from "@shipoff/services-commons";
import { SECRETS } from "config/secrets";
import path from "path";
import {Worker} from  "worker_threads";

export function verifySignature(payload:string, signature:string){
    return new Promise((res,rej)=>{
        const isDev = SECRETS.ENV === "development";
        const fileName = isDev ? "worker.ts" : "worker.js"
        const worker = new Worker(path.resolve(__dirname, '../worker',fileName),{
            execArgv: isDev ? ['--require', 'ts-node/register'] : [],
            workerData:{
                payload,
                signature,
                secret:SECRETS.GITHUB_PAYLOAD_SECRET
            }
        })
        worker.on("message",(data)=>{
            if(data.valid){
                res(true);
            }else{
                rej(new GrpcAppError(status.INVALID_ARGUMENT,"Invalid signature provided"));
            }
        })
        worker.on("error",(err)=>{
            rej(new GrpcAppError(status.INTERNAL,"Internal server error",err));
        })
    })
}