import {AuthServiceClient, ProjectsServiceClient} from "@shipoff/proto";
import {credentials} from "@grpc/grpc-js"
import { CONFIG } from "./config/config";
 let AuthClientInstance : AuthServiceClient | null = null ;
 let ProjectClientInstance : ProjectsServiceClient | null = null;


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
 