import { CreateAuthorizationCodeRequestBodyType } from "@/types/user";
import NodeCache from "node-cache";

export type AuthCodeStoreEntry = Omit<CreateAuthorizationCodeRequestBodyType,"reqMeta">

export class AuthCodeCache {
    private _cache:NodeCache
    constructor(){
        this._cache = new NodeCache({
            stdTTL:60,
            checkperiod:60*2,
        })
    }

    get(authCodeKey:string){
        return this._cache.get<string>(`oauth:authorization-code:${authCodeKey}`)
    }

    set(authCode:string,authCodeEntry:string){
        return this._cache.set(`oauth:authorization-code:${authCode}`,authCodeEntry)
    }

    delete(authCode:string){
        return this._cache.del(`oauth:authorization-code:${authCode}`)
    }
}

export const authCodeCache = new AuthCodeCache();