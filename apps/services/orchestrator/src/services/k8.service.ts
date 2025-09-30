import { CONFIG, SECRETS } from "@/config";
import { logger } from "@/libs/winston";
import { ContainerConfigUtil } from "@/utils/container-config.utils";
import { status } from "@grpc/grpc-js";
import k8 from "@kubernetes/client-node"
import {  createSyncErrHandler, GrpcAppError } from "@shipoff/services-commons";

type PaidTierK8DeploymentManifest = {new:k8.AppsV1ApiCreateNamespacedDeploymentRequest , replacement: k8.AppsV1ApiReplaceNamespacedDeploymentRequest}

type FreeTierK8DeploymentManifest = {
    manifest: k8.CoreV1ApiCreateNamespacedPodRequest,
    env:{name:string,value:string}[]
}
type namespace = "user-static-apps" | "user-dynamic-apps"

export class K8Service {
    private _appsApi : k8.AppsV1Api;
    private _k8Config : k8.KubeConfig 
    private _coreApi : k8.CoreV1Api
    private _containerConfUtil : ContainerConfigUtil
    private _errHandler : ReturnType<typeof createSyncErrHandler>
    public INITALIZED = false;
    constructor(){
        this._k8Config = new k8.KubeConfig();
        CONFIG.ENV === "PRODUCTION"
          ? this._k8Config.loadFromCluster()
          : this._k8Config.loadFromDefault();

        this._appsApi = this._k8Config.makeApiClient(k8.AppsV1Api);
        this._coreApi = this._k8Config.makeApiClient(k8.CoreV1Api);
        this._containerConfUtil = new ContainerConfigUtil();
        this._errHandler = createSyncErrHandler({subServiceName:"K8_SERVICE",logger});
    }

    async createFreeTierStaticDeployment({projectId,deploymentId,commitHash,requestId}:{projectId:string,deploymentId:string,commitHash:string,requestId:string}){
        let manifest : FreeTierK8DeploymentManifest
        try {
            manifest = await this._getFreeTierDeploymentManifest(projectId,deploymentId,commitHash,requestId,"user-static-apps")
        } catch (e:any) {
            return this._errHandler(e,"GET-FREE-TIER-STATIC-MANIFEST",requestId);
        }
        try {
            const deleteExisting = await this.deleteFreeTierDeployment(projectId,"user-static-apps",requestId);
            if(!deleteExisting) throw new GrpcAppError(status.INTERNAL,"Failed to delete existing pod",deleteExisting)
            const res = await this._coreApi.createNamespacedPod(manifest.manifest);
            return res;
        } catch (e:any) {
            return this._errHandler(e,"CREATE-FREE-TIER-STATIC-DEPLOYMENT",requestId);
        }
    }

    async createFreeTierDynamicDeployment({projectId,deploymentId,commitHash,requestId}:{projectId:string,deploymentId:string,commitHash:string,requestId:string}){
        let manifest : FreeTierK8DeploymentManifest
        try {
            manifest = await this._getFreeTierDeploymentManifest(projectId,deploymentId,commitHash,requestId,"user-dynamic-apps")
        } catch (e:any) {
            return this._errHandler(e,"GET-FREE-TIER-DYNAMIC-MANIFEST",requestId);
        }
        try {
            const deleteExisting = await this.deleteFreeTierDeployment(projectId,"user-dynamic-apps",requestId);
            if(!deleteExisting) throw new GrpcAppError(status.INTERNAL,"Failed to delete existing pod",deleteExisting)
            const res = await this._coreApi.createNamespacedPod(manifest.manifest);
            const port = parseInt(manifest.env.find(e=>e.name==="PORT")?.value!);
            await this.createDynamicDeploymentService({projectId,requestId,port});
            return res;
        } catch (e:any) {
            return this._errHandler(e,"CREATE-FREE-TIER-DYNAMIC-DEPLOYMENT",requestId);
        }
    }

    async createDynamicDeploymentService({projectId,requestId,port}:{projectId:string,requestId:string,port:number}){
        const manifest : k8.CoreV1ApiCreateNamespacedServiceRequest = {
            namespace:"user-dynamic-apps",
            body:{
                apiVersion:"v1",
                kind:"Service",
                metadata:{
                    name:projectId,
                    namespace:"user-dynamic-apps"
                },
                spec:{
                    selector:{
                        app:projectId
                    },
                    ports:[{
                        protocol:"TCP",
                        targetPort:port,
                        port:80
                    }]
                }
            }            
        }
        try {
            await this._coreApi.replaceNamespacedService({name:projectId,...manifest});
            return true
        } catch (e:any) {
            if(e.code === 404) await this._coreApi.createNamespacedService(manifest);
            else return this._errHandler(e,"CREATE-DYNAMIC-DEPLOYMENT-SERVICE",requestId);
        }
    }

    async tryCreatingFreeTierDeployment({projectId,deploymentId,commitHash,projectType,requestId}:{projectId:string,deploymentId:string,commitHash:string,projectType:"STATIC"|"DYNAMIC",requestId:string}){
        let manifest : FreeTierK8DeploymentManifest
        try {
            manifest = await this._getFreeTierDeploymentManifest(projectId,deploymentId,commitHash,requestId,projectType==="STATIC"?"user-static-apps":"user-dynamic-apps")
        } catch (e:any) {
            return this._errHandler(e,"GET-FREE-TIER-DEPLOYMENT-MANIFEST",requestId);
        }
        try {
          await this._coreApi.createNamespacedPod(manifest.manifest);
          projectType === "DYNAMIC" && await this.createDynamicDeploymentService({projectId,requestId,port:parseInt(manifest.env.find(e=>e.name==="PORT")?.value!)});
          return true
        } catch (e:any) {
          if(e.code === 409){
             true
          }
          return this._errHandler(e,"TRY-CREATING-FREE-TIER-DEPLOYMENT",requestId);
       }
    }

    async deleteFreeTierDeployment(projectId:string,namespace:namespace,requestId:string){
        try {      
            await this._coreApi.deleteNamespacedPod({name:projectId,namespace})
            await this._waitForFreeTierDeletion(projectId,namespace);
            return true;
        } catch (e:any) {
            if(e.code === 404) return true;
            return this._errHandler(e,"DELETE-FREE-TIER-CONTAINER",requestId);
        }
     }

     async deletePaidTierDeployment(projectId:string,requestId:string){
        try {
            const res = await this._appsApi.deleteNamespacedDeployment({name:projectId,namespace:"default"})
            await this._waitForPaidTierDeletion(projectId);
            return res;
        } catch (e:any) {
            if(e.code === 404) return true;
            return this._errHandler(e,"DELETE-PROD-CONTAINER",requestId);
        }
     }

     private async _waitForFreeTierDeletion(podName:string,namespace:namespace="user-static-apps"){
        while(true){
            try {
                await this._coreApi.readNamespacedPod({name:podName,namespace})
                await new Promise(res=>setTimeout(res,2000))
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

     private async _getFreeTierDeploymentManifest(projectId:string,deploymentId:string,commitHash:string,requestId:string,namespace="user-dynamic-apps"):Promise<FreeTierK8DeploymentManifest>{
           const {envs:env,image,containerId} = namespace==="user-dynamic-apps"
           ? await this._containerConfUtil.getProdContainerConfig(projectId,deploymentId,commitHash,requestId)
           : await this._containerConfUtil.getBuildContainerConfig(projectId,deploymentId,commitHash,requestId);
            env.push({
            name:"CONTAINER_ID",
            value:containerId
           })
           const manifest : k8.CoreV1ApiCreateNamespacedPodRequest = {
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
                    }],
                    imagePullSecrets:[{
                        name:SECRETS.BASE_IMAGE_REGISTRY_SECRET
                    }],
                    restartPolicy:"Never"
                },
             }
           }

           return {
              manifest,
              env
           }
     }

     async initializeK8(){
        try {
            const res = await Promise.all([
                this._coreApi.createNamespace({
                body:{
                    apiVersion:"v1",
                    kind:"Namespace",
                    metadata:{
                        name:"user-static-apps"
                    }
                }
            }),
            this._coreApi.createNamespace({
                body:{
                    apiVersion:"v1",
                    kind:"Namespace",
                    metadata:{
                        name:"user-dynamic-apps"
                    }
                }
            })
            ])
            this.INITALIZED = true;
            return res;
        } catch (e:any) {
            if(e.code === 409){
                this.INITALIZED = true;
                return true
            };
            return false
        }
     }
}

export const K8ServiceClient = new K8Service();