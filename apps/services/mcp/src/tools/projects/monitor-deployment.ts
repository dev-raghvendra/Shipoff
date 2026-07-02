import { getUser } from "@/libs/context";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import z from "zod";
import { ProjectService } from "@/services/projects.service";
import { mapGrpcCode, unwrapGrpcResponse } from "@/utils/response.utils";
import de from "zod/v4/locales/de.js";
import { McpError, ServerNotification, ServerRequest } from "@modelcontextprotocol/sdk/types.js";
import { sleep } from "@shipoff/services-commons/index";
import { RequestHandlerExtra } from "@modelcontextprotocol/sdk/shared/protocol";
import { promiseHooks } from "node:v8";

export interface ProgressState {
  progress: number;
  message: string;
}
const projectServiceClient = new ProjectService()

export function registerMonitorDeploymentTool(server:McpServer){
    server.registerTool(
        "monitor_deployment",
        {
            title:"Monitor Deployment",
            description:`Monitors a deployment until it reaches a terminal state.

This tool sends progress updates while the deployment is executing and returns the
final deployment details when the deployment completes or fails.

Use this after creating or redeploying a deployment when the user wants to
monitor its progress.`,
          inputSchema: {
                  deploymentId: z
                    .string()
                    .min(1)
                    .describe("Identifier of the deployment to monitor."),
          
                  projectId: z
                    .string()
                    .min(1)
                    .describe("Identifier of the project that owns the deployment."),
                
                idempotencyKey: z
            .string()
            .min(1)
            .describe("Unique key for this operation. Use a UUID generated once per user intent and reuse it on retries. Prevents duplicate operations if the request is retried."),
              }},
            async(body,extra)=>{
               const user = getUser()
               let prevStatus : string | undefined 
               try {
                  while(!extra.signal.aborted){
                   const deployment = unwrapGrpcResponse(await projectServiceClient.getDeployment({
                      authUserData:user,
                      projectId:body.projectId,
                      deploymentId:body.deploymentId,
                      reqMeta:{requestId:`rid-${extra.sessionId}:${extra.requestId}`}
                   }))
                   
                   if(deployment.status !== prevStatus){
                      prevStatus=deployment.status
                      
                      const progress = getDeploymentProgress(deployment.status,deployment.project.framework.applicationType)
                      await notify(extra,progress)
                   }

                   if(deployment.status === "PRODUCTION") return {
                     content:[{
                        type:"text",
                        text:JSON.stringify({
                            message:"Deployment completed successfully."
                        })
                     },{
                        type:"resource",
                        resource:{
                            uri:`shipoff://projects/${body.projectId}/deployments/${body.deploymentId}`,
                            mimeType:"application/json",
                            text:JSON.stringify({
                                liveUrl:`https://${deployment.project.domain}`
                            })
                        }
                     }]
                   }
                   else if(["INACTIVE","FAILED"].includes(deployment.status)){
                       return {
                          content:[{
                            type:"text",
                            text:JSON.stringify({message:"Deployment failed"},null,2)
                          },{
                            type:"resource",
                            resource:{
                               uri:`shipoff://projects/${body.projectId}/deployments/${body.deploymentId}`,
                            text:JSON.stringify({
                                deploymentId:deployment.deploymentId,
                                status:"FAILED",
                                message:"Deployment failed. Check the deployment details for more information."
                            })
                            }
                          }]
                       }
                   }
                   await sleep(2000)
               }
               return {
                 content:[{
                    type:"text",
                    text:"Failed to monitor deployment"
                 }],
                 isError:true
               }
               } catch (e:any) {
                  return {
                content:[{
                    type:"text",
                    text:JSON.stringify({
                        error:e.message ?? "UNKWNOWN_ERROR"
                    },null,2)
                }],
                isError:true
        }
               }
            }
        
    )
}


export function getDeploymentProgress(
 status: "BUILDING" | "QUEUED" | "INACTIVE" | "PROVISIONING" | "PRODUCTION" | "FAILED" | string,
  projectType?: "STATIC" | "DYNAMIC" | string,
): ProgressState {
  switch (status) {
    case "QUEUED":
      return {
        progress: 5,
        message: "Deployment queued. Waiting for build environment...",
      };

    case "PROVISIONING":
      return {
        progress: 25,
        message: "Build environment is ready. Preparing build...",
      };

    case "BUILDING":
      return {
        progress: 60,
        message:
          projectType === "STATIC"
            ? "Building and publishing static assets..."
            : "Building application...",
      };

    case "PRODUCTION":
      return {
        progress: 100,
        message:
          projectType === "STATIC"
            ? "Deployment completed successfully. Your static site is now available."
            : "Deployment completed successfully. Your application is now running.",
      };

    case "FAILED":
      return {
        progress: 100,
        message: "Deployment failed.",
      };

    case "INACTIVE":
      return {
        progress: 100,
        message: "Deployment became inactive.",
      };

    default:
      return {
        progress: 0,
        message: "Preparing deployment...",
      };
  }
}

async function notify(extra:RequestHandlerExtra<ServerRequest, ServerNotification>,progress:ProgressState){
    if(!extra._meta?.progressToken) return
    await extra.sendNotification({
        method:"notifications/progress",
        params:{
            progressToken:extra._meta.progressToken,
            progress:progress.progress,
            total:100,
            message:progress.message
        }
    })
}