import { SECRETS } from "@/config";
import { Database, dbService } from "@/db/db-service";
import { ContainerProducer } from "@/producer/container.producer";
import { OrchestratorWebhookRequestBodyType, STATE_CHANGED, TRAFFIC_DETECTED } from "@/types/container";
import { status } from "@grpc/grpc-js";
import { createAsyncErrHandler, createGrpcErrorHandler, createJwtErrHandler, decodeJwt, GrpcAppError, GrpcResponse, JsonWebTokenError, TokenExpiredError, verifyJwt } from "@shipoff/services-commons";
import {logger} from "@/libs/winston";

export class OrchestratorWebhookService {
    private _errHandler: ReturnType<typeof createGrpcErrorHandler>
    private _jwtErrHandler: ReturnType<typeof createJwtErrHandler>
    private _asyncErrHandler: ReturnType<typeof createAsyncErrHandler>
    private _containerProducer: ContainerProducer
    private _dbService: Database
    constructor() {
        this._errHandler = createGrpcErrorHandler({ subServiceName: "ORCHESTRATOR_WEBHOOK_SERVICE",logger })
        this._asyncErrHandler = createAsyncErrHandler({ subServiceName: "ORCHESTRATOR_WEBHOOK_SERVICE",logger })
        this._jwtErrHandler = createJwtErrHandler({
            invalidErrMsg: "Malformed authentication token",
            expiredErrMsg: "Time limit exceeded"
        })
        this._containerProducer = new ContainerProducer();
        this._dbService = dbService
    }

    async IWebhook({ payload, event }: OrchestratorWebhookRequestBodyType) {
        try {
            const eventPayload = await verifyJwt<TRAFFIC_DETECTED | STATE_CHANGED>(payload, SECRETS.ORCHESTRATOR_WEBHOOK_PAYLOAD_SECRET)
            console.log("Webhook recived from container: ", eventPayload);
            switch (event) {
                case "TRAFFIC_DETECTED":
                    return await this._trafficDetected(eventPayload as TRAFFIC_DETECTED)

                case "STATE_CHANGED":
                    return await this._stateChanged(eventPayload as STATE_CHANGED)
                default:
                    throw new GrpcAppError(status.INVALID_ARGUMENT, "Invalid event type")
            }
        } catch (e: any) {
            if (e instanceof JsonWebTokenError) {
                await this._stateChangeTokenExpired(e, { payload, event })
                return this._jwtErrHandler(e)
            }
            return this._errHandler(e, "WEBHOOK")
        }
    }

    private async _trafficDetected(payload: TRAFFIC_DETECTED) {
        try {
            const res = payload.action == "INGRESSED"
                ? await this._dbService.findAndUpdateK8Deployment({
                    projectId: payload.projectId,
                    deploymentId: payload.deploymentId
                }, {
                    lastIngressedAt: Date.now()
                })
                : null;
            if (res) return GrpcResponse.OK(null, "Traffic detected webhook processed")
            return new GrpcAppError(status.INVALID_ARGUMENT, "Invalid traffic event")
        } catch (e: any) {
            return this._errHandler(e, "WEBHOOK")
        }
    }

    private async _stateChanged(payload: STATE_CHANGED) {
        try {
            const res = await this._dbService.upsertK8Deployment({
                projectId: payload.projectId,
                deploymentId:payload.deploymentId
            }, {
                status: payload.action,
                ...(payload.action === "TERMINATED" ? { terminatedAt: Date.now() } : {}),
            })
            this._asyncErrHandler.call(this._containerProducer.publishContainerEvent({
                containerId: payload.containerId,
                event: payload.action,
                projectId: payload.projectId,
                deploymentId:payload.deploymentId
            }), "STATE-CHANGED")
            return GrpcResponse.OK({}, "State changed webhook processed")
        } catch (e: any) {
            return this._errHandler(e, "WEBHOOK")
        }
    }

    private async _stateChangeTokenExpired(e: any, webhook: OrchestratorWebhookRequestBodyType) {
        if (webhook.event == "STATE_CHANGED" && e instanceof TokenExpiredError) {
            // If STATE_CHANGED Tokens are expired then this means the container has been either running for so long or hasn't completed the stages of it in time.
            // In both the cases it needs to be terminated and by sending this error response only, it will work
            const decoded = await decodeJwt<STATE_CHANGED>(webhook.payload);
            await this._dbService.upsertK8Deployment({
                projectId: decoded.projectId,
                deploymentId:decoded.deploymentId,
            }, {
                status: "TERMINATED",
                terminatedAt: Date.now()
            })
            this._asyncErrHandler.call(this._containerProducer.publishContainerEvent({
                containerId: decoded.containerId,
                event: "TERMINATED",
                projectId: decoded.projectId,
                deploymentId:decoded.deploymentId
            }), "STATE-CHANGE-TOKEN-EXPIRED")
        }
    }
}