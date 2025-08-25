import { createAsyncErrHandler, createGrpcErrorHandler, GrpcResponse } from "@shipoff/services-commons";
import { Database, dbService } from "@/db/db-service";
import authExternalService, { AuthExternalService } from "@/externals/auth.external.service";
import { DeleteDeploymentRequestBodyType, GetAllDeploymentsRequestBodyType, GetDeploymentRequestBodyType, RedeployRequestBodyType } from "@/types/deployments";
import { DeploymentEventProducerService } from "@/producer/deployment.producer";


export class DeploymentsService {
    private _dbService: Database;
    private _authService: AuthExternalService;
    private _errHandler : ReturnType<typeof createGrpcErrorHandler>
    private _asyncErrHandler: ReturnType<typeof createAsyncErrHandler>  
    private _deploymentProducer : DeploymentEventProducerService;

    constructor() {
        this._errHandler = createGrpcErrorHandler({serviceName:"DEPLOYMENT_SERVICE"});
        this._asyncErrHandler = createAsyncErrHandler({serviceName:"DEPLOYMENT_SERVICE"});
        this._dbService = dbService;
        this._authService = authExternalService;
        this._deploymentProducer = new DeploymentEventProducerService();
    }
    async getDeployment({authUserData, deploymentId,projectId}: GetDeploymentRequestBodyType) {
        try {
            await this._authService.getPermissions({
                authUserData,
                permissions: ["READ"],
                scope: "DEPLOYMENT",
                resourceId: projectId,
                errMsg: "You do not have permission to read this deployment"
            });
            const deployment = await this._dbService.findUniqueDeploymentById(deploymentId);
            return GrpcResponse.OK(deployment, "Deployment found");
        } catch (e:any) {
            return this._errHandler(e, "GET-DEPLOYMENT");
        }
    }

    async getAllDeployments({authUserData, projectId, skip, limit}:GetAllDeploymentsRequestBodyType){
        try {
            await this._authService.getPermissions({
                authUserData,
                permissions: ["READ"],
                scope: "DEPLOYMENT",
                resourceId: projectId,
                errMsg: "You do not have permission to read deployments of this project"
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
                      select:{
                      domain:true,
                      name:true,
                }
                },
                    repository:true
                }
            });
            return GrpcResponse.OK(deployments, "Deployments found");
        } catch (e:any) {
            return this._errHandler(e, "GET-ALL-DEPLOYMENTS");
        }
    }
    
    async deleteDeployment({authUserData, projectId, deploymentId}:DeleteDeploymentRequestBodyType) {
        try {
            await this._authService.getPermissions({
                authUserData,
                permissions: ["DELETE"],
                scope: "DEPLOYMENT",
                resourceId: projectId,
                errMsg: "You do not have permission to delete this deployment"
            });
            const deployment = await this._dbService.deleteDeploymentById(deploymentId);
            this._asyncErrHandler.call(this._deploymentProducer.publishDeploymentRequested({
                event: "DELETED",
                projectId,
                deploymentId,
                domain: deployment.project.domain
            }),"DELETE-DEPLOYMENT");
            return GrpcResponse.OK({}, "Deployment deleted");
        } catch (e:any) {
            return this._errHandler(e, "DELETE-DEPLOYMENT");
        }
    }

    async redeploy({authUserData, projectId, deploymentId}:RedeployRequestBodyType) {
        try {
            await this._authService.getPermissions({
                authUserData,
                permissions: ["UPDATE"],
                scope: "DEPLOYMENT",
                resourceId: projectId,
                errMsg: "You do not have permission to redeploy this deployment"
            });
            const deployment = await this._dbService.findUniqueDeploymentById(deploymentId);
            this._asyncErrHandler.call(this._deploymentProducer.publishDeploymentRequested({
                event:"CREATED",
                projectId,
                deploymentId,
                domain:deployment.project.domain
            }),"REDEPLOY-DEPLOYMENT");  
            return GrpcResponse.OK(deployment, "Deployment redeployed");
        } catch (e:any) {
            return this._errHandler(e, "REDEPLOY-DEPLOYMENT");
        }
    }


}