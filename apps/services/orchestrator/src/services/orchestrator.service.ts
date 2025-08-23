import { CONFIG } from "@/config/config";
import k8 from "@kubernetes/client-node"
import { ProjectExternalService } from "@/externals/project.external.service";

export class OrchestratorService {
    private _appsApi : k8.AppsV1Api;
    private _coreApi : k8.CoreV1Api;
    private _batchApi : k8.BatchV1Api;
    private _k8Config : k8.KubeConfig
    private _projectExternalService: ProjectExternalService;

    constructor(){
        this._k8Config = new k8.KubeConfig();
        CONFIG.ENV === "PRODUCTION"
          ? this._k8Config.loadFromCluster()
          : this._k8Config.loadFromDefault();

        this._appsApi = this._k8Config.makeApiClient(k8.AppsV1Api);
        this._coreApi = this._k8Config.makeApiClient(k8.CoreV1Api);
        this._batchApi = this._k8Config.makeApiClient(k8.BatchV1Api);
        this._projectExternalService = new ProjectExternalService();
    }

    async createBuildContainer({projectId,cloneURI}: {projectId: string, cloneURI: string}){
        const project  = await this._projectExternalService.getProjectById(projectId);
        const env = [...project.environmentVars?.map(ev=>({
            name:ev.envName,
            value:ev.envValue
        })),{
            name:"cloneURI",
            value:cloneURI
        },{
            name:"buildCommand",
            value:project.buildCommand
        }];
        const res = await this._batchApi.createNamespacedJob({namespace:"default", body:{
            apiVersion:"batch/v1",
            kind:"Job",
            metadata:{
                name:`build-container-${project.domain}-${Date.now()}`,
                namespace:"default"
            },
            spec:{
                ttlSecondsAfterFinished:200,
                template:{
                    spec:{
                        containers:[{
                            name:`build-container-${project.domain}-${Date.now()}`,
                            image:CONFIG.NODE_BUILDER_IMAGE,
                            env
                        }],
                        restartPolicy:"Never"
                    }
                }
            }
        }
        });
        return res;
    }

    async createProdContainer({projectId,cloneURI}: {projectId: string, cloneURI: string}){
        const project  = await this._projectExternalService.getProjectById(projectId);
        const env = [...project.environmentVars?.map(ev=>({
            name:ev.envName,
            value:ev.envValue
        })),{
            name:"cloneURI",
            value:cloneURI
        },{
            name:"prodCommand",
            value:project.prodCommand
        },{
            name:"buildCommand",
            value:project.buildCommand
        }];

        const res = await this._appsApi.createNamespacedDeployment({namespace:"default",body:{
            apiVersion:"apps/v1",
            kind:"Deployment",
            metadata:{
                name:`prod-container-${project.domain}`,
                namespace:"default"
            },
            spec:{
                replicas:1,
                selector:{
                   matchLabels:{
                      app:`prod-container-${project.domain}`
                   }
                },
                template:{
                    metadata:{
                        labels:{
                            app:`prod-container-${project.domain}`
                        }
                    },
                    spec:{
                        containers:[{
                            name:`prod-container-${project.domain}`,
                            image:CONFIG.NODE_PROD_IMAGE,
                            env
                        }]
                    }
                }
            }
        }})

        return res;
    }

}