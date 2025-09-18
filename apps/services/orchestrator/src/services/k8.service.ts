import { CONFIG } from "@/config";
import { ContainerConfigUtil } from "@/utils/container-config.utils";
import { status } from "@grpc/grpc-js";
import k8 from "@kubernetes/client-node"
import {  createSyncErrHandler, GrpcAppError } from "@shipoff/services-commons";

type PaidTierK8DeploymentManifest = {new:k8.AppsV1ApiCreateNamespacedDeploymentRequest , replacement: k8.AppsV1ApiReplaceNamespacedDeploymentRequest}

type FreeTierK8DeploymentManifest = k8.CoreV1ApiCreateNamespacedPodRequest
type namespace = "user-static-apps" | "user-dynamic-apps"

export class K8Service {
    private _appsApi : k8.AppsV1Api;
    private _k8Config : k8.KubeConfig
    private _coreApi : k8.CoreV1Api
    private _containerConfUtil : ContainerConfigUtil
    private _errHandler : ReturnType<typeof createSyncErrHandler>
    constructor(){
        this._k8Config = new k8.KubeConfig();
        CONFIG.ENV === "PRODUCTION"
          ? this._k8Config.loadFromCluster()
          : this._k8Config.loadFromDefault();

        this._appsApi = this._k8Config.makeApiClient(k8.AppsV1Api);
        this._coreApi = this._k8Config.makeApiClient(k8.CoreV1Api);
        this._containerConfUtil = new ContainerConfigUtil();
        this._errHandler = createSyncErrHandler({serviceName:"K8_SERVICE"});
    }

    async createFreeTierStaticDeployment({projectId,deploymentId,commitHash}:{projectId:string,deploymentId:string,commitHash:string}){
        let manifest : FreeTierK8DeploymentManifest
        try {
            manifest = await this._getFreeTierDeploymentManifest(projectId,deploymentId,commitHash,"user-static-apps")
        } catch (e:any) {
            return this._errHandler(e,"GET-FREE-TIER-STATIC-MANIFEST");
        }
        try {
            const deleteExisting = await this.deleteFreeTierDeployment(projectId,"user-static-apps");
            if(!deleteExisting) throw new GrpcAppError(status.INTERNAL,"Failed to delete existing pod",deleteExisting)
            const res = await this._coreApi.createNamespacedPod(manifest);
            return res;
        } catch (e:any) {
            return this._errHandler(e,"CREATE-FREE-TIER-STATIC-DEPLOYMENT");
        }
    }

    async createFreeTierDynamicDeployment({projectId,deploymentId,commitHash}:{projectId:string,deploymentId:string,commitHash:string}){
        let manifest : FreeTierK8DeploymentManifest
        try {
            manifest = await this._getFreeTierDeploymentManifest(projectId,deploymentId,commitHash,"user-dynamic-apps")
        } catch (e:any) {
            return this._errHandler(e,"GET-FREE-TIER-DYNAMIC-MANIFEST");
        }
        try {
            const deleteExisting = await this.deleteFreeTierDeployment(projectId,"user-static-apps");
            if(!deleteExisting) throw new GrpcAppError(status.INTERNAL,"Failed to delete existing pod",deleteExisting)
            const res = await this._coreApi.createNamespacedPod(manifest);
            return res;
        } catch (e:any) {
            return this._errHandler(e,"CREATE-FREE-TIER-DYNAMIC-DEPLOYMENT");
        }
    }

     async deleteFreeTierDeployment(projectId:string,namespace:namespace){
        try {      
            const res = await this._coreApi.deleteNamespacedPod({name:projectId,namespace})
            await this._waitForFreeTierDeletion(projectId,namespace);
            return res;
        } catch (e:any) {
            return this._errHandler(e,"DELETE-FREE-TIER-CONTAINER");
        }
     }

     async deletePaidTierDeployment(projectId:string){
        try {
            const res = await this._appsApi.deleteNamespacedDeployment({name:projectId,namespace:"default"})
            await this._waitForPaidTierDeletion(projectId);
            return res;
        } catch (e:any) {
            return this._errHandler(e,"DELETE-PROD-CONTAINER");
        }
     }

     private async _waitForFreeTierDeletion(podName:string,namespace:namespace="user-static-apps"){
        while(true){
            try {
                await this._coreApi.readNamespacedPod({name:podName,namespace})
                await new Promise(res=>setTimeout(res,5000))
            } catch (e:any) {
                if(e.code === 404) {
                    return true;
                }
                throw e;
            }
        }
     }

     private async _waitForPaidTierDeletion(deploymentName:string){
        while(true){
            try {
                await this._appsApi.readNamespacedDeployment({name:deploymentName,namespace:"default"})
                await new Promise(res=>setTimeout(res,5000))
            } catch (e:any) {
                if(e.code === 404) {
                    return true;
                }
                throw e;
            }
        }
     }


     private async _getPaidTierDeploymentManifest(projectId:string,deploymentId:string,commitHash:string,namespace="user-dynamic-apps"):Promise<PaidTierK8DeploymentManifest>{
           const {envs:env,image,containerId} = await this._containerConfUtil.getProdContainerConfig(projectId,deploymentId,commitHash);
            env.push({
            name:"CONTAINER_ID",
            value:containerId
           })

           return {
              new:{
                 namespace,
               body:{
                  apiVersion:"apps/v1",
                  kind:"Deployment",
                  metadata:{
                    name:projectId,
                    namespace
                  },
                  spec:{
                     replicas:1,
                     selector:{
                        matchLabels:{
                            app:projectId
                        }
                     },
                     
                     template:{
                        metadata:{
                            labels:{
                                app:projectId
                            }
                        },
                        spec:{
                            containers:[{
                                name:containerId,
                                image,
                                env
                            }]
                        }
                     }
                  }
               }
              },
            replacement:{
               name:projectId,
               namespace,
               body:{
                  apiVersion:"apps/v1",
                  kind:"Deployment",
                  metadata:{
                    name:projectId,
                    namespace
                  },
                  spec:{
                     replicas:1,
                     selector:{
                        matchLabels:{
                            app:projectId
                        }
                     },
                     strategy:{
                        type:"Recreate"
                     },
                     template:{
                        metadata:{
                            labels:{
                                app:projectId
                            }
                        },
                        spec:{
                            containers:[{
                                name:containerId,
                                image,
                                env
                            }]
                        }
                     }
                  }
               }
            }
           }
     }

     private async _getFreeTierDeploymentManifest(projectId:string,deploymentId:string,commitHash:string,namespace="user-dynamic-apps"):Promise<FreeTierK8DeploymentManifest>{
           const {envs:env,image,containerId} = await this._containerConfUtil.getProdContainerConfig(projectId,deploymentId,commitHash);
            env.push({
            name:"CONTAINER_ID",
            value:containerId
           })

           return {
             namespace,
             body:{
                kind:"Pod",
                apiVersion:"v1",
                metadata:{
                    name:projectId,
                    namespace,
                    labels:{
                        app:projectId
                    }
                },
                spec:{
                    containers:[{
                        name:containerId,
                        image,
                        env
                    }]
                }
             }
           }
     }
}

