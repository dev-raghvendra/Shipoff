import { LOGS_API_ROUTES, MAIN_BACKEND_API } from "@/config/service-route-config";
import { ExportLogsRequest, ExportLogsResponse, StreamLogsRequest } from "@shipoff/proto";
import { BaseService } from "./base.service";
import { InferResponse, InferRequest } from "@shipoff/types";


export class LogsService extends BaseService {
   constructor(){
      super({
         baseURL:MAIN_BACKEND_API.LOGS_API,
         serviceName:"LOGS"
      })
   }

    streamLogs({projectId,environmentId,accessToken}:InferRequest<StreamLogsRequest>&{accessToken:string}){
          return new WebSocket(`${MAIN_BACKEND_API.WS_API}/${LOGS_API_ROUTES.STREAM_LOGS({projectId,envId:environmentId,accessToken})}`)
    }

    async exportLogs({projectId,deploymentId}:InferRequest<ExportLogsRequest>){
       try {
           const res = await this._axiosInstance.get<InferResponse<ExportLogsResponse>>(LOGS_API_ROUTES.EXPORT_LOGS({projectId,deploymentId}));
           return res.data
       } catch (e:any) {
          return this.handleError(e,undefined,true)
       }
    }
   
} 

export const logsService = new LogsService()

