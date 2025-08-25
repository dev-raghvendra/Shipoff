import { CONFIG } from "@/config/config";
import { SECRETS } from "@/config/secrets";
import k8 from "@kubernetes/client-node"

export class OrchestratorService {
    private _appsApi : k8.AppsV1Api;
    private _coreApi : k8.CoreV1Api;
    private _batchApi : k8.BatchV1Api;
    private _k8Config : k8.KubeConfig

    constructor(){
        this._k8Config = new k8.KubeConfig();
        CONFIG.ENV === "PRODUCTION"
          ? this._k8Config.loadFromCluster()
          : this._k8Config.loadFromDefault();

        this._appsApi = this._k8Config.makeApiClient(k8.AppsV1Api);
        this._coreApi = this._k8Config.makeApiClient(k8.CoreV1Api);
        this._batchApi = this._k8Config.makeApiClient(k8.BatchV1Api);
    }

    async createBuildContainer({domain}: {domain:string}){
        const res = await this._batchApi.createNamespacedJob({namespace:"default", body:{
            apiVersion:"batch/v1",
            kind:"Job",
            metadata:{
                name:`build-container-${domain}-${Date.now()}`,
                namespace:"default"
            },
            spec:{
                ttlSecondsAfterFinished:200,
                template:{
                    spec:{
                        containers:[{
                            name:`build-container-${domain}-${Date.now()}`,
                            image:SECRETS.NODE_BUILDER_IMAGE,
                        }],
                        restartPolicy:"Never"
                    }
                }
            }
        }
        });
        return res;
    }

    async createProdContainer({domain}: {domain:string}){
        const res = await this._appsApi.createNamespacedDeployment({namespace:"default",body:{
            apiVersion:"apps/v1",
            kind:"Deployment",
            metadata:{
                name:`prod-container-${domain}`,
                namespace:"default"
            },
            spec:{
                replicas:1,
                selector:{
                   matchLabels:{
                      app:`prod-container-${domain}`
                   }
                },
                template:{
                    metadata:{
                        labels:{
                            app:`prod-container-${domain}`
                        }
                    },
                    spec:{
                        containers:[{
                            name:`prod-container-${domain}`,
                            image:SECRETS.NODE_PROD_IMAGE
                        }]
                    }
                }
            }
        }})

        return res;
    }

}