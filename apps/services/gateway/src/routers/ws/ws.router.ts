import {WebSocket} from "ws";
import { logsController } from "@/contollers/ws/logs.controller";
import { WebSocketRequest } from "@/types/request";
import { WS_ROUTES } from "@/config";

const ROUTE_CONTROLLER_MAP : Record<keyof typeof WS_ROUTES,(ws:WebSocket,req:WebSocketRequest)=>void> = {
    "/apis/v1/ws/logs/stream":logsController
}
export function wsRouter(ws:WebSocket,req:WebSocketRequest){
    try {
      const controller = ROUTE_CONTROLLER_MAP[req.URL?.pathname as keyof typeof WS_ROUTES];
      if(!controller) return ws.close(1003,"Unsupported Data")
      controller(ws,req);
    } catch (e:any) {
        ws.close(1011,"Internal Server Error")
    }
}