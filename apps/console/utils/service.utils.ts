import { AuthService } from "@/services/auth.service"
import { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from "axios"
import { getSession } from "next-auth/react"

export function serviceReqInterceptor(this:AuthService){
    return async(config:InternalAxiosRequestConfig)=>{
        await getAccessToken.apply(this)
        config.headers.setAuthorization(`Bearer ${this._authToken}`)
        return config
    }
}

export function serviceResIntercepter(this:AuthService){
    return async(res:AxiosResponse)=>{
       if(res.status===401){
           await getAccessToken.apply(this)
           return this._axiosInstance.request(res.config)
       }
       return res;
    }
}

export async function getAccessToken(this:AuthService){
   if(this._isFetching) await new Promise((res)=>setTimeout(res,600));
   if(this._sessionExpired) throw new AxiosError("Session expired","401");
   if(!this._authToken){
      this._isFetching = true
      this._authToken = await getSession().then(s=>s?.error ? null : s?.accessToken as string)
   }
   if(!this._authToken){
      this._sessionExpired = true;
      this._isFetching  = false
      this._authToken = null
      throw new AxiosError("Session Expired","401")
   }
   this._isFetching = false;
   return this._authToken
}