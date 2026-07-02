import { CONFIG } from "@/config/config";
import NodeCache from "node-cache";

export type CachedResponse<T> = {
    cached:boolean,
    result:T
}


export class ResponseCache {
    private _cache:NodeCache
    constructor(){
        this._cache = new NodeCache({
            stdTTL:CONFIG.REQ_IDEMPOTENCY_KEY_TTL
        })
    }

    get(key:string){
        return this._cache.get<string>(key)
    }

    set(key:string,result:any){
        return this._cache.set(key,JSON.stringify(result))
    }
}

export const responseCache = new ResponseCache();
//will move this cache to redis when replica set of the service increases