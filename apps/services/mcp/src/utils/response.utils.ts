import { CONFIG } from "@/config/config";
import { ErrorCode } from "@modelcontextprotocol/sdk/types.js";
import { McpError } from "@modelcontextprotocol/sdk/types.js";
import { Response } from "express";

export enum GrpcStatus {
    OK = 0,
    INVALID_ARGUMENT = 1,
    NOT_FOUND = 2,
    ALREADY_EXISTS = 3,
    PERMISSION_DENIED = 4,
    UNAUTHENTICATED = 5,
    INTERNAL = 6,
    UNAVAILABLE = 7,
};

export function mapGrpcCode(code: number): ErrorCode {
    switch (code) {
        case GrpcStatus.INVALID_ARGUMENT:
            return ErrorCode.InvalidParams;

        case GrpcStatus.NOT_FOUND:
            return ErrorCode.InvalidRequest;

        case GrpcStatus.PERMISSION_DENIED:
        case GrpcStatus.UNAUTHENTICATED:
            return ErrorCode.InvalidRequest;

        case GrpcStatus.UNAVAILABLE:
        case GrpcStatus.INTERNAL:
        default:
            return ErrorCode.InternalError;
    }
}

interface GrpcResponse <T> {
   code:GrpcStatus,
   message:string,
   res:T
}

export function unwrapGrpcResponse<T>(response: GrpcResponse<T>): T {
    if (response.code !== GrpcStatus.OK || response.res == null) {
        throw new McpError(
            mapGrpcCode(response.code),
            response.message
        );
    }

    return response.res;
}


export function unauthorizedResponse(res: Response) {
    return res.setHeader("WWW-Authenticate",   `Bearer resource_metadata="${CONFIG.MCP_SERVER_URL}/.well-known/oauth-protected-resource"`).status(401).end()
}