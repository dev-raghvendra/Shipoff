import { WebSocketServer } from "ws"
import { authorizationMiddleware } from "@/middlewares/ws/authorization.middleware"
import { routingMiddleware } from "@/middlewares/ws/routing.middleware"
import { startWSMiddlewareChain } from "@/middlewares/ws/start-middleware-chain"
import { wsRouter } from "@/routers/ws/ws.router"
import { ridMiddleware } from "@/middlewares/ws/rid,middleware"

export function createWebSocketServer(server:any){
    const wss = new WebSocketServer({
    server,
    verifyClient:startWSMiddlewareChain(ridMiddleware,authorizationMiddleware,routingMiddleware)
})
    wss.on("connection",wsRouter)
    return wss;
}