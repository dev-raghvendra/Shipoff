import { sendUnaryData, ServerUnaryCall, status } from "@grpc/grpc-js";
import { AcceptInvitationRequest, BulkResourceRequest, CreateTeamMemberInvitationRequest, CreateTeamMemberInvitationResponse, CreateTeamMemberInvitationResponseData, CreateTeamRequest, CreateTeamResponse, DeleteTeamMemberRequest, DeleteTeamMemberResponse, DeleteTeamMemberResponseData, DeleteTeamRequest, DeleteTeamResponse, GetAllUserTeamsResponse, GetTeamMemberRequest, GetTeamMemberResponse, GetTeamMemberResponseData, GetTeamRequest, GetTeamResponse, Team } from "@shipoff/proto";
import TeamService from "@/services/team.service";
import { CreateTeamRequestBodyType, DeleteTeamMemberRequestBodyType, DeleteTeamRequestBodyType, GetTeamMemberRequestBodyType, GetTeamRequestBodyType, TeamMemberInvitationRequestBodyType } from "@/types/team";
import { AcceptMemberInviteRequestBodyType } from "@/types/utility";
import { BulkResourceRequestBodyType } from "@shipoff/types";

class TeamHandlers {
    private _teamService : TeamService;
    constructor(){
        this._teamService= new TeamService()
    }

    async handleCreateTeam(call:ServerUnaryCall<CreateTeamRequest & {body:CreateTeamRequestBodyType},CreateTeamResponse>,callback:sendUnaryData<CreateTeamResponse>){
       try {
          const {code,res,message} = await this._teamService.createTeam(call.request.body);
          if(code!==status.OK) return callback({code,message})
          const response = CreateTeamResponse.fromObject({code,message,res})
          callback(null,response);
       } catch (e) {
        return callback({
                code:status.INTERNAL,
                message:"Internal server error"
          }) 
       }
    }

    async handleGetTeam(call:ServerUnaryCall<GetTeamRequest & {body:GetTeamRequestBodyType},GetTeamResponse>,callback:sendUnaryData<GetTeamResponse>){
       try {
          const {code,res,message} = await this._teamService.getTeam(call.request.body);
          if(code!==status.OK) return callback({code,message})
          const response = GetTeamResponse.fromObject({code,message,res})
          callback(null,response);
       } catch (e) {
        return callback({
                code:status.INTERNAL,
                message:"Internal server error"
          }) 
       }
    }

    async handleDeleteTeam(call:ServerUnaryCall<DeleteTeamRequest & {body:DeleteTeamRequestBodyType},DeleteTeamResponse>,callback:sendUnaryData<DeleteTeamResponse>){
       try {
          const {code,res,message} = await this._teamService.deleteTeam(call.request.body);
          if(code!==status.OK) return callback({code,message})
          const response = DeleteTeamResponse.fromObject({code,message,res})
          callback(null,response);
       } catch (e) {
        return callback({
                code:status.INTERNAL,
                message:"Internal server error"
          }) 
       }
    }

    async handleCreateTeamMemberInvitation(call:ServerUnaryCall<CreateTeamMemberInvitationRequest & {body:TeamMemberInvitationRequestBodyType},CreateTeamMemberInvitationResponse>,callback:sendUnaryData<CreateTeamMemberInvitationResponse>){
      try {
         const {code,res,message} = await this._teamService.createTeamMemberInvitation(call.request.body);
         if(code!==status.OK) return callback({code,message});
         const response = CreateTeamMemberInvitationResponse.fromObject({code,message,res});
         return callback(null,response)
      } catch (e) {
          return callback({
                code:status.INTERNAL,
                message:"Internal server error"
          }) 
      }
    }

    async handleAcceptTeamInvitation(call:ServerUnaryCall<AcceptInvitationRequest & {body:AcceptMemberInviteRequestBodyType},GetTeamMemberResponse>,callback:sendUnaryData<GetTeamMemberResponse>){
            try {
                const {code,res,message} = await this._teamService.acceptInvitation(call.request.body);
                 if(code!==status.OK) return callback({code,message})  
                const response = GetTeamMemberResponse.fromObject({code,message,res})
                callback(null,response);
           } catch (e) {
                return callback({
                    code:status.INTERNAL,
                    message:"Internal server error"
              }) 
           }
    }

    async handleGetTeamMember(call:ServerUnaryCall<GetTeamMemberRequest & {body:GetTeamMemberRequestBodyType},GetTeamMemberResponse>,callback:sendUnaryData<GetTeamMemberResponse>){
      try {
         const {code,res,message} = await this._teamService.getTeamMember(call.request.body);
         if(code!==status.OK) return callback({code,message})
         const response = GetTeamMemberResponse.fromObject({code,message,res})
         return callback(null,response);
      } catch (e) {
                return callback({
                    code:status.INTERNAL,
                    message:"Internal server error"
              }) 
      }
    }

    async handleDeleteTeamMember(call:ServerUnaryCall<DeleteTeamMemberRequest & {body:DeleteTeamMemberRequestBodyType},DeleteTeamMemberResponse>,callback:sendUnaryData<DeleteTeamMemberResponse>){
      try {
         const {code,res,message} = await this._teamService.deleteTeamMember(call.request.body);
         if(code!==status.OK) return callback({code,message})
         const response = DeleteTeamMemberResponse.fromObject({code,message,res});
         return callback(null,response);
      } catch (e) {
                return callback({
                    code:status.INTERNAL,
                    message:"Internal server error"
              }) 
      }
    }

    async handleGetAllUserTeams(call:ServerUnaryCall<BulkResourceRequest & {body:BulkResourceRequestBodyType},GetAllUserTeamsResponse>,callback:sendUnaryData<GetAllUserTeamsResponse>){
      try {
         const {code,res,message} = await this._teamService.GetAllUserTeams(call.request.body);
         if(code!==status.OK) return callback({code,message})
         const response = GetAllUserTeamsResponse.fromObject({code,message,res});
         return callback(null,response);
      } catch (e) {
                return callback({
                    code:status.INTERNAL,
                    message:"Internal server error"
              }) 
      }
    }
}

export default TeamHandlers