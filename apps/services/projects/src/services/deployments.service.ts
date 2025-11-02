import { createAsyncErrHandler, createGrpcErrorHandler, GrpcAppError, GrpcResponse } from "@shipoff/services-commons";
import { Database, dbService } from "@/db/db-service";
import authExternalService, { AuthExternalService } from "@/externals/auth.external.service";
import { DeleteDeploymentRequestBodyType, GetAllDeploymentsRequestBodyType, GetDeploymentRequestBodyType, RedeployRequestBodyType } from "@/types/deployments";
import { DeploymentEventProducerService } from "@/producer/deployment.producer";
import { logger } from "@/libs/winston";
import { status } from "@grpc/grpc-js";
import { BulkResourceRequestBodyType } from "@shipoff/types";


export class DeploymentsService {
    private _dbService: Database;
    private _authService: AuthExternalService;
    private _errHandler : ReturnType<typeof createGrpcErrorHandler>
    private _asyncErrHandler: ReturnType<typeof createAsyncErrHandler>  
    private _deploymentProducer : DeploymentEventProducerService;
    private _deletableStatuses = ["FAILED","INACTIVE"];
    private _redeployableStatuses = ["INACTIVE","FAILED","PRODUCTION"];

    constructor() {
        this._errHandler = createGrpcErrorHandler({subServiceName:"DEPLOYMENT_SERVICE",logger});
        this._asyncErrHandler = createAsyncErrHandler({subServiceName:"DEPLOYMENT_SERVICE",logger});
        this._dbService = dbService;
        this._authService = authExternalService;
        this._deploymentProducer = new DeploymentEventProducerService();
    }
    async getDeployment({authUserData, deploymentId,projectId,reqMeta}: GetDeploymentRequestBodyType) {
        try {
            await this._authService.getPermissions({
                authUserData,
                permissions: ["READ"],
                scope: "DEPLOYMENT",
                resourceId: projectId,
                errMsg: "You do not have permission to read this deployment",
                reqMeta
            });
            const deployment = await this._dbService.findUniqueDeploymentById(deploymentId);
            return GrpcResponse.OK(deployment, "Deployment found");
        } catch (e:any) {
            return this._errHandler(e, "GET-DEPLOYMENT",reqMeta.requestId);
        }
    }

    async getAllDeployments({authUserData, projectId, skip, limit,reqMeta}:GetAllDeploymentsRequestBodyType){
        try {
            await this._authService.getPermissions({
                authUserData,
                permissions: ["READ"],
                scope: "DEPLOYMENT",
                resourceId: projectId,
                errMsg: "You do not have permission to read deployments of this project",
                reqMeta
            });
            const deployments = await this._dbService.findManyDeployments({
                where:{
                    projectId
                },
                skip,
                take: limit,
                orderBy: {
                    createdAt: "desc"
                },
                include:{
                    project:{
                      include:{
                        framework:true
                      }
                    },
                    repository:true,
                    buildEnvironment:{
                        take:1,
                        orderBy:{
                           startedAt:"desc",
                        },
                        select:{
                            buildId:true,
                            startedAt:true
                        }
                    },
                    runtimeEnvironment:{
                        take:1,
                        orderBy:{
                           startedAt:"desc"
                        },
                        select:{
                            runtimeId:true,
                            startedAt:true
                        }
                    }
                }
            });
            return GrpcResponse.OK(deployments, "Deployments found");
        } catch (e:any) {
            return this._errHandler(e, "GET-ALL-DEPLOYMENTS",reqMeta.requestId);
        }
    }

    async getLatestDeployments({authUserData, reqMeta, limit}:BulkResourceRequestBodyType){
        try {
            const projectIds = await this._authService.getUserProjectIds(authUserData,reqMeta);
            const deployments = await this._dbService.findManyDeployments({
                where:{
                    projectId:{in:projectIds}
                },
                take: limit,
                orderBy: {
                    createdAt: "desc"
                },
                include:{
                    project:{
                      include:{
                        framework:true
                      }
                    },
                    repository:true,
                    buildEnvironment:{
                        take:1,
                        orderBy:{
                           startedAt:"desc",
                        },
                        select:{
                            buildId:true,
                            startedAt:true
                        }
                    },
                    runtimeEnvironment:{
                        take:1,
                        orderBy:{
                           startedAt:"desc"
                        },
                        select:{
                            runtimeId:true,
                            startedAt:true
                        }
                    
                    }
                }
            });
            return GrpcResponse.OK(deployments, "Latest Deployments found");
        } catch (e:any) {
            return this._errHandler(e, "GET-LATEST-DEPLOYMENTS",reqMeta.requestId);
        }
    }

    async deleteDeployment({authUserData, projectId, deploymentId, reqMeta}:DeleteDeploymentRequestBodyType) {
        try {
            await this._authService.getPermissions({
                authUserData,
                permissions: ["DELETE"],
                scope: "DEPLOYMENT",
                resourceId: projectId,
                errMsg: "You do not have permission to delete this deployment",
                reqMeta
            });
            const deployment = await this._dbService.findUniqueDeploymentById(deploymentId);
            if(!this._deletableStatuses.includes(deployment.status))throw new GrpcAppError(status.FAILED_PRECONDITION,"Deployment is not in a deletable state, only deployments in FAILED or INACTIVE state can be deleted");
            const deletedDeployment = await this._dbService.deleteDeploymentById(deploymentId);
            this._asyncErrHandler.call(this._deploymentProducer.publishDeploymentRequested({
                event: "DELETED",
                projectId,
                deploymentId,
                domain: deployment.project.domain,
                projectType:deployment.project.framework.applicationType,
                commitHash:deployment.commitHash,
                requestId:reqMeta.requestId
            }),"DELETE-DEPLOYMENT",reqMeta.requestId);
            return GrpcResponse.OK(deletedDeployment, "Deployment deleted");
        } catch (e:any) {
            return this._errHandler(e, "DELETE-DEPLOYMENT",reqMeta.requestId);
        }
    }

    async redeploy({authUserData, projectId, deploymentId, reqMeta}:RedeployRequestBodyType) {
        try {
            await this._authService.getPermissions({
                authUserData,
                permissions: ["UPDATE"],
                scope: "DEPLOYMENT",
                resourceId: projectId,
                errMsg: "You do not have permission to redeploy this deployment",
                reqMeta
            });
            const crrStatus = await this._dbService.findUniqueDeploymentById(deploymentId);
            if(!this._redeployableStatuses.includes(crrStatus.status))throw new GrpcAppError(status.FAILED_PRECONDITION,"Deployment is not in a redeployable state, only deployments in INACTIVE or FAILED state can be redeployed");
            if(!crrStatus.repository) throw new GrpcAppError(status.FAILED_PRECONDITION,"The repository this deployment was created from has been removed. Cannot redeploy.");

            const deployment = await this._dbService.updateDeploymentById(deploymentId,projectId,{
                status:"QUEUED",
                lastDeployedAt:new Date()
            })
            this._asyncErrHandler.call(this._deploymentProducer.publishDeploymentRequested({
                event:"CREATED",
                projectId,
                deploymentId,
                domain:deployment.project.domain,
                projectType:deployment.project.framework.applicationType,
                commitHash:deployment.commitHash,
                requestId:reqMeta.requestId
            }),"REDEPLOY-DEPLOYMENT",reqMeta.requestId);
            return GrpcResponse.OK(deployment, "Deployment redeployed");
        } catch (e:any) {
            return this._errHandler(e, "REDEPLOY-DEPLOYMENT",reqMeta.requestId);
        }
    }


}