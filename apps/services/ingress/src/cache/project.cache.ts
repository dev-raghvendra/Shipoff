import NodeCache from "node-cache";

export type CachedProject = {
    projectId:string;
    projectType:"STATIC" | "DYNAMIC";
    deploymentRequested:boolean;
    domain:string
}


export class ProjectCache {
    private _cache:NodeCache
    constructor(){
        this._cache = new NodeCache({
            stdTTL:60*15,
            checkperiod:60*5,
        })
    }

    get(domain:string){
        return this._cache.get<CachedProject>(domain)
    }

    set(domain:string,project:Omit<CachedProject,"deploymentRequested">){
        return this._cache.set(domain,{deploymentRequested:false,...project})
    }
    markDeploymentRequested(domain:string){
        const existing = this._cache.get<CachedProject>(domain)
        if(existing){
            existing.deploymentRequested = true;
            return this._cache.set(domain,existing)
        }
        return false
    }
}

export const projectCache = new ProjectCache();