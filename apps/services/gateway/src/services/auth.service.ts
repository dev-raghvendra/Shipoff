import {AcceptInvitationRequest, AuthServiceClient, BodyLessRequest, BulkResourceRequest, CreateProjectMemberInvitationRequest, CreateTeamMemberInvitationRequest, CreateTeamRequest, DeleteProjectMemberRequest, DeleteTeamMemberRequest, DeleteTeamRequest, GetProjectMemberRequest, GetTeamMemberRequest, GetTeamRequest, LoginRequest, OAuthRequest, SigninRequest, User} from "@shipoff/proto";
import {GetAuthClient} from "@shipoff/grpc-clients";
import {promisifyGrpcCall} from "@shipoff/services-commons"
import logger from "@shipoff/services-commons/libs/winston";

export class AuthService {
    private _authService:AuthServiceClient;
    constructor(){
        this._authService = GetAuthClient();
    }
    
    async login(data:any){
        try {
            const req =  LoginRequest.fromObject(data);
            const response = await promisifyGrpcCall(this._authService.Login.bind(this._authService), req);
            return response;
        } catch (e:any) {
            return e;
        }

    }
    
    async signin(data:any){
        try {
            const req =  SigninRequest.fromObject(data);
            const response = await promisifyGrpcCall(this._authService.Signin.bind(this._authService), req);
            return response;
        } catch (e:any) {
            return e;
        }
    }

    async OAuth(data:any){
        try {
            const req =  OAuthRequest.fromObject(data);
            const response = await promisifyGrpcCall(this._authService.OAuth.bind(this._authService), req);
            return response;
        } catch (e:any) {
            return e;
        }
    }

    async getMe(data:any){
        try {
            const req = BodyLessRequest.fromObject(data);
            const response = await promisifyGrpcCall(this._authService.GetMe.bind(this._authService), req);
            return response;
        } catch (e:any) {
            (e);
            return e;
        }
    }

    async refreshToken(data:any){
        try {
            const req = BodyLessRequest.fromObject(data);
            const response = await promisifyGrpcCall(this._authService.RefreshToken.bind(this._authService), req);
            return response;
        } catch (e:any) {
            return e;
        }
    }

    async createTeam(data:any){
        try {
            const req =  CreateTeamRequest.fromObject(data);
            const response = await promisifyGrpcCall(this._authService.CreateTeam.bind(this._authService), req);
            return response;
        } catch (e:any) {
            return e;
        }
    }
 
    async getAllUserTeams(data:any){
        try {
            const req =  BulkResourceRequest.fromObject(data);
            const response = await promisifyGrpcCall(this._authService.GetAllUserTeams.bind(this._authService), req);
            return response;
        } catch (e:any) {
            return e;
        }
    }

    async getTeam(data:any){
        try {
            const req =  GetTeamRequest.fromObject(data);
            const response = await promisifyGrpcCall(this._authService.GetTeam.bind(this._authService), req);
            return response;
        } catch (e:any) {
            return e;
        }
    }

    async deleteTeam(data:any){
        try {
            const req =  DeleteTeamRequest.fromObject(data);
            const response = await promisifyGrpcCall(this._authService.DeleteTeam.bind(this._authService), req);
            return response;
        } catch (e:any) {
            return e;
        }
    }

    async createTeamMemberInvitation(data:any){
        try {
            const req =  CreateTeamMemberInvitationRequest.fromObject(data);
            const response = await promisifyGrpcCall(this._authService.CreateTeamMemberInvitation.bind(this._authService), req);
            return response;
        } catch (e:any) {
            return e;
        }
    }

    async getTeamMember(data:any){
        try {
            const req =  GetTeamMemberRequest.fromObject(data);
            const response = await promisifyGrpcCall(this._authService.GetTeamMember.bind(this._authService), req);
            return response;
        } catch (e:any) {
            return e;
        }
    }

    async deleteTeamMember(data:any){
        try {
            const req =  DeleteTeamMemberRequest.fromObject(data);
            const response = await promisifyGrpcCall(this._authService.DeleteTeamMember.bind(this._authService), req);
            return response;
        } catch (e:any) {
            return e;
        }
    }

    async acceptTeamInvitation(data:any){
        try {
            const req =  AcceptInvitationRequest.fromObject(data);
            const response = await promisifyGrpcCall(this._authService.AcceptTeamInvitation.bind(this._authService), req);
            return response;
        } catch (e:any) {
            return e;
        }
    }

    async createProjectMemberInvitation(data:any){
        try {
            const req =  CreateProjectMemberInvitationRequest.fromObject(data);
            const response = await promisifyGrpcCall(this._authService.CreateProjectMemberInvitation.bind(this._authService), req);
            return response;
        } catch (e:any) {
            return e;
        }
    }

    async getProjectMember(data:any){
        try {
            const req =  GetProjectMemberRequest.fromObject(data);
            const response = await promisifyGrpcCall(this._authService.GetProjectMember.bind(this._authService), req);
            return response;
        } catch (e:any) {
            return e;
        }
    }

    async deleteProjectMember(data:any){
        try {
            const req =  DeleteProjectMemberRequest.fromObject(data);
            const response = await promisifyGrpcCall(this._authService.DeleteProjectMember.bind(this._authService), req);
            return response;
        } catch (e:any) {
            return e;
        }
    }

    async acceptProjectInvitation(data:any){
        try {
            const req =  AcceptInvitationRequest.fromObject(data);
            const response = await promisifyGrpcCall(this._authService.AcceptProjectInvitation.bind(this._authService), req);
            return response;
        } catch (e:any) {
            return e;
        }
    }
}