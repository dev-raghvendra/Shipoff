import { AUTH_API_ROUTES, MAIN_BACKEND_API } from "@/config/service-route-config";
import { GetCurrentUserResponse, GetWSAuthTokenResponse } from "@shipoff/proto";
import { InferResponse } from "@shipoff/types";
import { BaseService } from "./base.service";


export class AuthService extends BaseService{
   constructor(){
      super({
        baseURL:MAIN_BACKEND_API.AUTH_API,
        serviceName:"AUTH"
      })
   }
  
   async getMe(){
        try {
            const res = await this._axiosInstance.get<InferResponse<GetCurrentUserResponse>>(AUTH_API_ROUTES.ME())
            return res.data
        } catch (e:any) {
            return this.handleError(e,undefined,true)
        }
   }

   async getWSAuthToken(){
        try {
            const res = await this._axiosInstance.get<InferResponse<GetWSAuthTokenResponse>>(AUTH_API_ROUTES.GET_WS_AUTH_TOKEN())
            return res.data
        } catch (e:any) {
            return this.handleError(e,undefined,true,true)
        }
   }

   async updateSubscription(type: string){
        try {
            const res = await this._axiosInstance.post(AUTH_API_ROUTES.UPDATE_SUBSCRIPTION(), { type })
            return res.data
        } catch (e:any) {
            return this.handleError(e, undefined, true)
        }
   }

   async updateProfile(payload: { fullName?: string }){
        try {
            const res = await this._axiosInstance.patch(AUTH_API_ROUTES.UPDATE_PROFILE(), payload)
            return res.data
        } catch (e:any) {
            return this.handleError(e, undefined, true)
        }
   }
} 

export const authService = new AuthService()