import { AUTH_API_ROUTES, MAIN_BACKEND_API } from "@/config/service-route-config";
import { GetCurrentUserResponse } from "@shipoff/proto";
import { InferResponse } from "@/types/response";
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
} 

export const authService = new AuthService()