import { AUTH_API_ROUTES, MAIN_BACKEND_API } from "@/config/service-route-config";
import { GetAllUserTeamsResponse, GetCurrentUserResponse, CreateTeamRequest, CreateTeamResponse, GetTeamRequest, GetTeamResponse, DeleteTeamRequest, DeleteTeamResponse, CreateTeamMemberInvitationRequest, CreateTeamMemberInvitationResponseData, AcceptInvitationRequest, GetTeamMemberResponse, TransferTeamOwnershipRequest, DeleteTeamMemberRequest, DeleteTeamMemberResponse, BulkResourceRequest, GetTeamsLinkedToProjectRequest } from "@shipoff/proto";
import { TeamRoleType } from "@shipoff/types";
import { InferRequest } from "@/types/request";
import { InferResponse } from "@/types/response";
import { BaseService } from "./base.service";


export class TeamsService extends BaseService {
   constructor(){
      super({
         baseURL:MAIN_BACKEND_API.AUTH_API,
         serviceName:"TEAMS"
      })
   }

   async getAllTeams({skip, limit}:InferRequest<BulkResourceRequest>){
        try {
            const res = await this._axiosInstance.get<InferResponse<GetAllUserTeamsResponse>>(AUTH_API_ROUTES.GET_TEAMS({skip, limit}))
            return res.data
        } catch (e:any) {
            return this.handleError(e,undefined,true)
        }
   }

   async getMe(){
        try {
            const res = await this._axiosInstance.get<InferResponse<GetCurrentUserResponse>>(AUTH_API_ROUTES.ME())
            return res.data
        } catch (e:any) {
            return this.handleError(e,undefined,true)
        }
   }

   async createTeam({teamName,description}:InferRequest<CreateTeamRequest,"description">){
        try {
            const res = await this._axiosInstance.post<InferResponse<CreateTeamResponse>>(AUTH_API_ROUTES.CREATE_TEAM(),{
                teamName,
                description
            })
            return res.data
        } catch (e:any) {
            return this.handleError(e,undefined,true)
        }
   }

   async getTeam({teamId}:InferRequest<GetTeamRequest>){
       try {
          const res = await this._axiosInstance.get<InferResponse<GetTeamResponse>>(AUTH_API_ROUTES.GET_TEAM({teamId}))
          return res.data 
       } catch (e:any) {
          return this.handleError(e,undefined,true)
       }
   }

   async getTeamsLinkedToProject({projectId}:InferRequest<GetTeamsLinkedToProjectRequest>){
       try {
          const res = await this._axiosInstance.get<InferResponse<GetAllUserTeamsResponse>>(AUTH_API_ROUTES.GET_TEAMS_LINKED_TO_PROJECT({projectId}))
          return res.data 
       } catch (e:any) {
          return this.handleError(e,undefined,true)
       }
   }

   async deleteTeam({teamId}:InferRequest<DeleteTeamRequest>){
       try {
          const res = await this._axiosInstance.delete<InferResponse<DeleteTeamResponse>>(AUTH_API_ROUTES.DELETE_TEAM({teamId}))
          return res.data 
       } catch (e:any) {
          return this.handleError(e,undefined,true)
       }
   }

   async inviteTeamMember({teamId,role}:InferRequest<CreateTeamMemberInvitationRequest,"role">&{role:Omit<TeamRoleType,"TEAM_OWNER">}){
     try {
        const res = await this._axiosInstance.post<InferResponse<CreateTeamMemberInvitationResponseData>>(AUTH_API_ROUTES.CREATE_TEAM_MEMBER_INVITE({
            teamId
        }),{
            role
        })
        return res.data
     } catch (e:any) {
        return this.handleError(e,undefined,true)
     }
   }

   async deleteTeamMember({teamId,targetUserId}:InferRequest<DeleteTeamMemberRequest>){
     try {
        const res  = await this._axiosInstance.delete<InferResponse<DeleteTeamMemberResponse>>(AUTH_API_ROUTES.DELETE_TEAM_MEMBER({
            teamId,
            targetUserId
        }))
        return res.data
     } catch (e:any) {
        return this.handleError(e,undefined,true)  
     }
   }

   async acceptTeamMemberInvite({inviteId}:InferRequest<AcceptInvitationRequest>){
      try {
         const res = await this._axiosInstance.get<InferResponse<GetTeamMemberResponse>>(AUTH_API_ROUTES.ACCEPT_TEAM_MEMBER_INVITE({inviteId}))
         return res.data
      } catch (e:any) {
        return this.handleError(e,undefined,true)
      }
   }

   async transferTeamOwnership({newOwnerId,teamId}:InferRequest<TransferTeamOwnershipRequest>){
       try {
           const res = await this._axiosInstance.patch<{}>(AUTH_API_ROUTES.TRANSFER_TEAM_OWNERSHIP({newOwnerId,teamId}))
           return res.data
       } catch (e:any) {
           return this.handleError(e,undefined,true)
       }
   }
} 

export const teamsService = new TeamsService()