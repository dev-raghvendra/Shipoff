import { WebSocketRequest } from "./request";

export type MiddlewareFunction = (info:{ origin: string; secure: boolean; req: WebSocketRequest },next:(err?:{code:number,message:string})=>void)=>void