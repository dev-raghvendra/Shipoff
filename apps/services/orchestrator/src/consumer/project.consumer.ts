import { $ProjectEvent, ProjectEvent } from "@shipoff/redis";
import { ProjectConsumer as Consumer } from "@shipoff/redis";
import { PROJECT_TOPIC_CONSUMER_GROUPS } from "@shipoff/redis/config/config";
import { DeploymentConsumer } from "./deployment.consumer";
import { K8Service } from "@/services/k8.service";

type IProjectConsumer = {
    [$ProjectEvent.DELETED]: (e:ProjectEvent<"DELETED">) => Promise<boolean>;
}

export class ProjectConsumer implements IProjectConsumer {
    private _consumer: Consumer;
    private _deploymentConsumer:DeploymentConsumer
    private _k8Service: K8Service;
    constructor(serviceName: keyof typeof PROJECT_TOPIC_CONSUMER_GROUPS,consumer:DeploymentConsumer) {
        this._consumer = new Consumer(serviceName);
        this._deploymentConsumer = consumer;
        this._k8Service = new K8Service();
    }
    
    DELETED = async(e:ProjectEvent<"DELETED">) =>{
        this._deploymentConsumer.removeProjectEventsFromQueue(e.projectId)
        if(e.projectType === "STATIC"){
          await this._k8Service.deleteFreeTierDeployment(e.projectId,"user-static-apps")
        }
        else{
          await this._k8Service.deleteFreeTierDeployment(e.projectId,"user-dynamic-apps")
        }
        return true
    }

    async startConsumer(){
        await this._consumer.initializeConsumerGroup();
        await this._consumer.readUnackedMessages(async(event)=>{
            if(event.event === "DELETED"){
              await this.DELETED(event as ProjectEvent<"DELETED">);
            }
        })
        await this._consumer.readNewMessages(async(event)=>{
            if(event.event === "DELETED"){
              await this.DELETED(event as ProjectEvent<"DELETED">);
            }
        })
    }
    
}
