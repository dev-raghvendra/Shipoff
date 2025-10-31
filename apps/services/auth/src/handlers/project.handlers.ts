import { sendUnaryData, ServerUnaryCall, status } from "@grpc/grpc-js";
import { CreateProjectMemberInvitationResponse, CreateProjectMemberInvitationRequest, AcceptInvitationRequest, GetProjectMemberResponse, DeleteProjectMemberRequest, DeleteProjectMemberResponse, BodyLessRequest, GetAllUserProjectIdsResponse, TransferProjectOwnershipRequest, google, GetProjectIdsLinkedToTeamRequest } from "@shipoff/proto";
import { BodyLessRequestBodyType } from "@shipoff/types";
import ProjectService from "@/services/project.service";
import { DeleteProjectMemberRequestBodyType, GetProjectIdsLinkedToTeamRequestBodyType, ProjectMemberInvitationRequestBodyType, TransferProjectOwnershipRequestBodyType } from "@/types/project";
import { AcceptMemberInviteRequestBodyType } from "@/types/utility";

class ProjectHandlers {
    private _projectService : ProjectService;
    constructor(){
        this._projectService= new ProjectService()
    }

    async handleCreateProjectMemberInvitation(call:ServerUnaryCall<CreateProjectMemberInvitationRequest & {body:ProjectMemberInvitationRequestBodyType},CreateProjectMemberInvitationResponse>,callback:sendUnaryData<CreateProjectMemberInvitationResponse>){
       try {
          const {code,res,message} = await this._projectService.createProjectMemberInvitation(call.request.body);
          if(code!==status.OK) return callback({code,message})
          const response = CreateProjectMemberInvitationResponse.fromObject({res,code,message})
          callback(null,response);
       } catch (e) {
        return callback({
                code:status.INTERNAL,
                message:"Internal server error"
          }) 
       }
    }

    async handleAcceptInvitation(call:ServerUnaryCall<AcceptInvitationRequest & {body:AcceptMemberInviteRequestBodyType},GetProjectMemberResponse>,callback:sendUnaryData<GetProjectMemberResponse>){
        try {
            const {code,res,message} = await this._projectService.acceptInvitation(call.request.body);
             if(code!==status.OK) return callback({code,message})  
            const response = GetProjectMemberResponse.fromObject({code,message,res})
            callback(null,response);
       } catch (e) {
            return callback({
                code:status.INTERNAL,
                message:"Internal server error"
          }) 
       }
    }

    
    async handleDeleteProjectMember(call:ServerUnaryCall<DeleteProjectMemberRequest & {body:DeleteProjectMemberRequestBodyType},DeleteProjectMemberResponse>,callback:sendUnaryData<DeleteProjectMemberResponse>){
          try {
             const {code,res,message} = await this._projectService.deleteProjectMember(call.request.body);
             if(code!==status.OK) return callback({code,message})
             const response = DeleteProjectMemberResponse.fromObject({code,message,res})
             return callback(null,response);
         } catch (e) {
            return callback({
               code:status.INTERNAL,
               message:"Internal server error"
            }) 
         }
      }
      
      async handleGetAllUserProjectIds(call:ServerUnaryCall<BodyLessRequest & {body:BodyLessRequestBodyType},GetAllUserProjectIdsResponse>,callback:sendUnaryData<GetAllUserProjectIdsResponse>){
         try {
            const {code,res,message} = await this._projectService.GetAllUserProjectIds(call.request.body);
            if(code!==status.OK) return callback({code,message})
            const response = GetAllUserProjectIdsResponse.fromObject({code,message,res})
            return callback(null,response)
         } catch (e) {
            return callback({
               code:status.INTERNAL,
               message:"Internal server error"
            }) 
         }
    }

      async handleIGetAllProjectIdsLinkedToTeam(call:ServerUnaryCall<GetProjectIdsLinkedToTeamRequest & {body:GetProjectIdsLinkedToTeamRequestBodyType},GetAllUserProjectIdsResponse>,callback:sendUnaryData<GetAllUserProjectIdsResponse>){
         try {
             const {code,res,message} = await this._projectService.IGetAllProjectIdsLinkedToTeam(call.request.body);
             if(code!==status.OK) return callback({code,message})
             const response = GetAllUserProjectIdsResponse.fromObject({code,message,res})
             return callback(null,response);
          } catch (e) {
                    return callback({
                        code:status.INTERNAL,
                        message:"Internal server error"
                  }) 
          } 
      }

      async handleTransferProjectOwnership(call:ServerUnaryCall<TransferProjectOwnershipRequest & {body:TransferProjectOwnershipRequestBodyType},google.protobuf.Empty>,callback:sendUnaryData<google.protobuf.Empty>){
         try {
            const {code,message} = await this._projectService.tansferProjectOwnership(call.request.body);
            if(code!==status.OK) return callback({code,message})
            const response = google.protobuf.Empty.fromObject({})
            return callback(null,response)
         } catch (e) {
            return callback({
               code:status.INTERNAL,
               message:"Internal server error"
            }) 
         }
      }
}

export default ProjectHandlers