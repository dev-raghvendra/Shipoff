import {EventEmitter} from "node:events"

export type ProjectCreatedLocalEventData = {projectId:string,reqId:string,branch:string,githubInstallationId:string,repoName:string,repositoryId:string,domain:string,projectType:"STATIC"|"DYNAMIC"}

export interface ProjectLocalEvents {
    "PROJECT_CREATED":ProjectCreatedLocalEventData
}


export class ProjectLocalEvent extends EventEmitter {
    override on<K extends keyof ProjectLocalEvents>(event:K,listener:(payload:ProjectLocalEvents[K])=>void):this{
       return super.on(event,listener)
    }
    override emit<K extends keyof ProjectLocalEvents>(event:K,payload:ProjectLocalEvents[K]):boolean{
       return super.emit(event,payload)
    }
    
    override once<K extends keyof ProjectLocalEvents>(event:K,listener:(payload:ProjectLocalEvents[K])=>void):this{
       return super.once(event,listener)
    }
    override off<K extends keyof ProjectLocalEvents>(event:K,listener:(payload:ProjectLocalEvents[K])=>void):this{
       return super.off(event,listener)
    }

    
}

export const ProjectCreatedEvent = new ProjectLocalEvent()
