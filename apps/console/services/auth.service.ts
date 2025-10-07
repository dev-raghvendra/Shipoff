import { AUTH_API_ROUTES, MAIN_BACKEND_API } from "@/config/service-route-config";
import { serviceReqInterceptor, serviceResIntercepter } from "@/utils/service.utils";
import { createErrHandler } from "@/utils/error.utils";
import axios, { AxiosInstance } from "axios";
import {GetAllUserTeamsResponse} from "@shipoff/proto"

export class AuthService {
   _axiosInstance : AxiosInstance
   _isFetching = false
   _authToken: string | null = null
   _sessionExpired = false
   private handleError : ReturnType<typeof createErrHandler>

   constructor(){
      this._axiosInstance = axios.create({
           baseURL:`${MAIN_BACKEND_API.AUTH_API}`,
      })
      this._axiosInstance.interceptors.request.use(serviceReqInterceptor.apply(this))
      this._axiosInstance.interceptors.response.use((res)=>res,serviceResIntercepter.apply(this))
      this.handleError = createErrHandler({serviceName:"AUTH"})
   }
  
   async getAllTeams(){
        try {
            const res = await this._axiosInstance.get(AUTH_API_ROUTES.GET_TEAMS())
            return res.data as Required<ReturnType<GetAllUserTeamsResponse["toObject"]>>
        } catch (e:any) {
            return this.handleError(e)
        }
   }

} 

export const authService = new AuthService()