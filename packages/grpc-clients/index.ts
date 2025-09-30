import {AuthServiceClient, LogServiceClient, OrchestratorServiceClient, ProjectsServiceClient} from "@shipoff/proto";
import {credentials} from "@grpc/grpc-js"
import { CONFIG } from "./config/config";
 let AuthClientInstance : AuthServiceClient | null = null ;
 let ProjectClientInstance : ProjectsServiceClient | null = null;
 let OrchestratorClientInstance : OrchestratorServiceClient | null = null;
 let LogClientInstance : LogServiceClient | null = null;


 export const GetAuthClient = () => {
    if(!AuthClientInstance){
      AuthClientInstance = new AuthServiceClient(CONFIG.GRPC_AUTH_SERVICE_URL,credentials.createInsecure())
    }
    return AuthClientInstance;
 }

export const GetProjectClient = () => {
  if(!ProjectClientInstance){
     ProjectClientInstance = new ProjectsServiceClient(CONFIG.GRPC_PROJECT_SERVICE_URL, credentials.createInsecure());
  }
  return ProjectClientInstance;
}

export const GetOrchestratorClient = () => {
  if(!OrchestratorClientInstance){
     OrchestratorClientInstance = new OrchestratorServiceClient(CONFIG.GRPC_ORCHESTRATOR_SERVICE_URL, credentials.createInsecure());
  }
  return OrchestratorClientInstance;
}

export const GetLogClient = () =>{
  if(!LogClientInstance){
    LogClientInstance = new LogServiceClient(CONFIG.GRPC_LOG_SERVICE_URL, credentials.createInsecure());
  }
  return LogClientInstance;
}