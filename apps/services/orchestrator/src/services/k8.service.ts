import { CONFIG } from "@/config";
import { Database, dbService } from "@/db/db-service";
import { ContainerConfigUtil } from "@/utils/container-config.utils";
import k8 from "@kubernetes/client-node"
import {  createSyncErrHandler } from "@shipoff/services-commons";

export class K8Service {
    private _appsApi : k8.AppsV1Api;
    private _coreApi : k8.CoreV1Api;
    private _batchApi : k8.BatchV1Api;
    private _k8Config : k8.KubeConfig
    private _dbService : Database
    private _containerConfUtil : ContainerConfigUtil
    private _errHandler : ReturnType<typeof createSyncErrHandler>
    constructor(){
        this._k8Config = new k8.KubeConfig();
        CONFIG.ENV === "PRODUCTION"
          ? this._k8Config.loadFromCluster()
          : this._k8Config.loadFromDefault();

        this._appsApi = this._k8Config.makeApiClient(k8.AppsV1Api);
        this._coreApi = this._k8Config.makeApiClient(k8.CoreV1Api);
        this._batchApi = this._k8Config.makeApiClient(k8.BatchV1Api);
        this._dbService = dbService;
        this._containerConfUtil = new ContainerConfigUtil();
        this._errHandler = createSyncErrHandler({serviceName:"K8_SERVICE"});
    }

    async createBuildContainer({projectId}: {projectId:string}){
        try {
        const {envs:env,image,containerId} = await this._containerConfUtil.getBuildContainerConfig(projectId)
        env.push({
            name:"CONTAINER_ID",
            value:containerId
        })

        console.log(`docker run -it --network host --name ${containerId} ${env.map(e=>`-e ${e.name}='${e.value}'`).join(" ")} ${image}`)
        // const res = await this._batchApi.createNamespacedJob({namespace:"default", body:{
        //     apiVersion:"batch/v1",
        //     kind:"Job",
        //     metadata:{
        //         name:containerId,
        //         namespace:"default"
        //     },
        //     spec:{
        //         ttlSecondsAfterFinished:200,
        //         template:{
        //             spec:{
        //                 containers:[{
        //                     name:containerId,
        //                     image:SECRETS.NODE_BUILDER_IMAGE,
        //                     env
        //                 }],
        //                 restartPolicy:"Never"
        //             }
        //         }
        //     }
        // }
        // });
        
        // return res;
        } catch (e:any) {
            this._errHandler(e,"CREATE-BUILD-CONTAINER");
        }
    }

    async createProdContainer({projectId}: {projectId:string}){
        try {
            const {envs:env,image,containerId} = await this._containerConfUtil.getProdContainerConfig(projectId)
        env.push({
            name:"CONTAINER_ID",
            value:containerId
        })
        console.log(`docker run -it --network host --name ${containerId} ${env.map(e=>`-e ${e.name}='${e.value}'`).join(" ")} ${image}`)

        // const res = await this._appsApi.createNamespacedDeployment({namespace:"default",body:{
        //     apiVersion:"apps/v1",
        //     kind:"Deployment",
        //     metadata:{
        //         name:containerId,
        //         namespace:"default"
        //     },
        //     spec:{
        //         replicas:1,
        //         selector:{
        //            matchLabels:{
        //               app:containerId
        //            }
        //         },
        //         template:{
        //             metadata:{
        //                 labels:{
        //                     app:containerId
        //                 }
        //             },
        //             spec:{
        //                 containers:[{
        //                     name:containerId,
        //                     image:SECRETS.NODE_PROD_IMAGE,
        //                     env
        //                 }]
        //             }
        //         }
        //     }
        // }})
        // return res;
        } catch (e:any) {
            this._errHandler(e,"CREATE-PROD-CONTAINER");
        }
    }


     
}

