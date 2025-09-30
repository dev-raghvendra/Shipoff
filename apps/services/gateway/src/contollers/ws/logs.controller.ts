import { LogService } from "@/services/log.service";
import { WebSocketRequest } from "@/types/request";
import { grpcToWsResponse } from "@/utils/res-utils";
import { LogBody } from "@shipoff/proto";
import { WebSocket } from "ws";

const logService = new LogService();

export async function logsController(ws: WebSocket, req: WebSocketRequest) {
    const body = {
        environmentId: req.URL?.searchParams.get("envId") || "",
        projectId: req.URL?.searchParams.get("projectId") || "",
        reqMeta: req.meta,
        authUserData: req.user,
    };

    const stream = logService.streamLogs(body);
    const streamState = { closed: false }; 

    
    stream.on("data", (data: LogBody) => upstreamMessageHandler(data, ws));

    // Handle GRPC stream errors
    stream.on("error", (e) => upstreamErrorHandler(e, streamState, ws, stream));

    // Handle GRPC stream close
    stream.on("close", () => upstreamClosedHandler(streamState, ws));

    // Handle WebSocket close from client
    ws.on("close", () => clientCloseHandler(streamState, stream));

    // Handle WebSocket error from client
    ws.on("error", (err) => clientErrorHandler(err, streamState, ws, stream));
}


function upstreamMessageHandler(data: LogBody, ws: WebSocket) {
    try {
        const message = data.toObject();
        grpcToWsResponse.call(ws, 0, message);
    } catch {}
}

function upstreamErrorHandler(
    e: any,
    streamState: { closed: boolean },
    ws: WebSocket,
    stream: any
) {
    if (!streamState.closed) {
        streamState.closed = true;
        try {
            grpcToWsResponse.call(ws, e.code || 1011, e.message || "Stream error");
        } catch { }
        try { stream.cancel(); } catch { }
    }
}

function upstreamClosedHandler(streamState: { closed: boolean }, ws: WebSocket) {
    if (!streamState.closed) {
        streamState.closed = true;
        try {
            grpcToWsResponse.call(ws, 0, "Stream closed by server");
        } catch { }
    }
}

function clientErrorHandler(
    err: any,
    streamState: { closed: boolean },
    ws: WebSocket,
    stream: any
) {
    if (!streamState.closed) {
        streamState.closed = true;
        try {
            grpcToWsResponse.call(ws, 1011, "WebSocket connection error");
        } catch { }
        try { stream.cancel(); } catch { }
    }
}

function clientCloseHandler(streamState: { closed: boolean }, stream: any) {
    if (!streamState.closed) {
        streamState.closed = true;
        try { stream.cancel(); } catch { }
    }
}
