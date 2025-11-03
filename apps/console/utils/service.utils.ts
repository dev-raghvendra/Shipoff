import { BaseService } from "@/services/base.service"
import { InternalAxiosRequestConfig, AxiosError } from "axios"
import { getSession } from "next-auth/react"

export function serviceReqInterceptor(this:BaseService){
    return async(config:InternalAxiosRequestConfig)=>{
        await getAccessToken.apply(this)
        config.headers.setAuthorization(`Bearer ${this._authToken}`)
        return config
    }
}

export function serviceResIntercepter(this:BaseService){
    return async(res:AxiosError)=>{
       if(res.status===401){
           this._authToken = null
           this._tokenExpiresAt = 0
           await getAccessToken.apply(this)
           return this._axiosInstance.request(res.config!)
       }
       if((res.response?.data as any)?.message){
         const msg = (res.response?.data as any).message.match(/^[0-9]+\s+[A-Z_]+:\s*(.*)$/)?.[1]
         if(msg) res.response!.data = { ...(res.response!.data as object), message: msg }
       }
       return Promise.reject(res);
    }
}

export async function getAccessToken(this:BaseService){
   if(this._sessionExpired) return window.location.href = "/login";

   const now = Math.floor(Date.now() / 1000);
   const bufferTime = 5 * 60;
   
   if(this._authToken && this._tokenExpiresAt && now < (this._tokenExpiresAt - bufferTime)) {
      return this._authToken; // Return cached token if still valid
   }
   
   // Token expired or doesn't exist, fetch fresh one
   if(this._isFetching) return await new Promise((res)=>setTimeout(()=>res(""),1000));
   if(this._isFetching) return await new Promise((res)=>setTimeout(()=>res(""),1000));
   if(this._sessionExpired) return window.location.href = "/login";
   this._isFetching = true;
   const session = await getSession();
   this._isFetching = false;
   
   if(session?.error || !session?.accessToken) {
      this._sessionExpired = true;
      this._authToken = null;
      this._tokenExpiresAt = 0;
      return window.location.href = "/login";
   }
   
   this._authToken = session.accessToken;
   this._tokenExpiresAt = Math.floor(Date.now() / 1000) + (24 * 60 * 60); // 24 hours
   
   return this._authToken;
}