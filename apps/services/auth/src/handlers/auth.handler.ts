import { sendUnaryData, ServerUnaryCall, status } from "@grpc/grpc-js";
import AuthService from "@/services/auth.service";
import { GetCurrentUserResponse, GetUserRequest, GetUserResponse, HasPermissionsRequest, HasPermissionsResponse, LoginRequest, LoginResponse, SigninRequest, BodyLessRequest } from "@shipoff/proto";
import { EmailPassLoginRequestBodyType, GetUserRequestBodyType, OAuthRequestBodyType, SigninRequestBodyType } from "@/types/user";
import { HasPermissionsRequestBodyType } from "@/types/utility";
import { BodyLessRequestBodyType } from "@shipoff/types";

class AuthHandlers {
    private _authService;
    constructor (){
       this._authService = new AuthService();
    }

    async handleLogin(call:ServerUnaryCall<LoginRequest & {body:EmailPassLoginRequestBodyType},LoginResponse>,callback:sendUnaryData<LoginResponse>){
        try {
            const {code,res,message} = await this._authService.login(call.request.body);
            if(code!==status.OK) return callback({ code,message })
            const response = LoginResponse.fromObject({code,message,res})
            return callback(null,response)
        } catch (e) {
             return callback({
                code:status.INTERNAL,
                message:"Internal server error"
              })
        }
    }
    
    async handleSignin(call:ServerUnaryCall<SigninRequest & {body:SigninRequestBodyType},LoginResponse>,callback:sendUnaryData<LoginResponse>){
        try {
            const {code,message,res} = await this._authService.signIn(call.request.body);
            if(code!==status.OK)return callback({code,message})
            const response = LoginResponse.fromObject({code,message,res})
            return callback(null,response)
        } catch (e) {
             return callback({
                code:status.INTERNAL,
                message:"Internal server error"
              })
        }
    } 

    async handleOAuth(call:ServerUnaryCall<SigninRequest & {body:OAuthRequestBodyType},LoginResponse>,callback:sendUnaryData<LoginResponse>){
        try {
            const {code,message,res} = await this._authService.OAuth(call.request.body);
            if(code!==status.OK) return callback({code,message})
            const response = LoginResponse.fromObject({code,message,res})
            return callback(null,response)
        } catch (e) {
             return callback({
                code:status.INTERNAL,
                message:"Internal server error"
              })
        }
    }

    async handleGetUser(call:ServerUnaryCall<GetUserRequest & {body:GetUserRequestBodyType},GetUserResponse>,callback:sendUnaryData<GetUserResponse>){
        try {
            const {code,message,res} = await this._authService.GetUser(call.request.body);
            if(code!==status.OK) return callback({code,message})
            const response = GetUserResponse.fromObject({code,message,res})
            callback(null,response)
        } catch (e) {
          return callback({
                code:status.INTERNAL,
                message:"Internal server error"
          })  
        }
    }

    async handleGetMe(call:ServerUnaryCall<BodyLessRequest & {body:BodyLessRequestBodyType},GetCurrentUserResponse>,callback:sendUnaryData<GetCurrentUserResponse>){
       try {
          const {code,res,message} = await this._authService.GetMe(call.request.body);
          if(code!==status.OK) return callback({code,message});
          const response = GetCurrentUserResponse.fromObject({code,message,res})
          callback(null,response)
        } catch (e) {
          return callback({
                code:status.INTERNAL,
                message:"Internal server error"
          })  
        }

    }

    async handleRefreshToken(call:ServerUnaryCall<BodyLessRequest & {body:BodyLessRequestBodyType},LoginResponse>,callback:sendUnaryData<LoginResponse>){
        try {
            const {res,code,message} = await this._authService.refreshToken(call.request.body);
            if(code!==status.OK) return callback({code,message});
            const response = LoginResponse.fromObject({code,message,res});
            return callback(null,response)
        } catch (e) {
             return callback({
                code:status.INTERNAL,
                message:"Internal server error"
            })
        }
    }

    async handleHasPermissions(call:ServerUnaryCall<HasPermissionsRequest & {body:HasPermissionsRequestBodyType},HasPermissionsResponse>,callback:sendUnaryData<HasPermissionsResponse>){
        try {
            const {code,res,message} = await this._authService.hasPermissions(call.request.body);
            if(code!==status.OK) return callback({message,code});
            const response = HasPermissionsResponse.fromObject({code,message,res});
            return callback(null,response)
        } catch (e) {
          return callback({
                code:status.INTERNAL,
                message:"Internal server error"
          })  
        }
    }
}

export default AuthHandlers