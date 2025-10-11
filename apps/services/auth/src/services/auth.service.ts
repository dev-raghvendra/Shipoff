import { createJwt } from "@shipoff/services-commons";
import { compare } from "@/libs/bcrypt";
import { EmailPassLoginRequestBodyType, GetUserRequestBodyType, OAuthRequestBodyType, SigninRequestBodyType } from "@/types/user";
import { HasPermissionsRequestBodyType } from "@/types/utility";
import { BodyLessRequestBodyType } from "@shipoff/types";
import { PermissionBase } from "@/utils/rbac-utils";
import { Database, dbService } from "@/db/db-service";
import { createGrpcErrorHandler, GrpcAppError, GrpcResponse } from "@shipoff/services-commons";
import { status } from "@grpc/grpc-js";
import {logger} from "@/libs/winston";


class AuthService {

    private _permissions : PermissionBase
    private _dbService : Database
    private _errorHandler : ReturnType<typeof createGrpcErrorHandler>

    constructor(){
        this._permissions = new PermissionBase()
        this._dbService = dbService;
        this._errorHandler = createGrpcErrorHandler({subServiceName:"AUTH_SERVICE",logger});
    }

    private async createSession(u: any) {
        const [accessToken, refreshToken] = await Promise.all([
            createJwt({authUserData:u}),
            createJwt({authUserData:u}, "7d"),
        ]);
        return GrpcResponse.OK({ accessToken, refreshToken }, "Session created");
    }

    async signIn({reqMeta,...body}: SigninRequestBodyType) {
        try {
            const u = await this._dbService.createEmailUser(body);
            return await this.createSession(u);
        } catch (e : any) {
            return this._errorHandler(e,"SIGNIN",reqMeta.requestId);
        }
    }

    async login({reqMeta,...body}: EmailPassLoginRequestBodyType) {
        try {
            const u = await this._dbService.findUniqueUser({
                where:{email:body.email}
            });
            const isVerified = await compare(body.password,u.password)
            if(!isVerified) throw new GrpcAppError(status.UNAUTHENTICATED,"Invalid credentials",null);
            const {password, ...user} = u;
            return this.createSession(user);
        } catch (e:any) {
            return this._errorHandler(e,"LOGIN",reqMeta.requestId);
        }
    }

    async OAuth({reqMeta,...body}:OAuthRequestBodyType){
        try {
            const u = await this._dbService.createOAuthUser(body);
            return await this.createSession(u);
        } catch (e:any) {
             if (e.code === status.ALREADY_EXISTS){
                const {password, ...user} = await this._dbService.findUniqueUser({where:{email:body.email}});
                return await this.createSession(user);
             }

            return this._errorHandler(e,"OAUTH",reqMeta.requestId);
        }
    }


    async GetUser({reqMeta,...body}:GetUserRequestBodyType){
        try {
            const u = await this._dbService.findUniqueUserById(body.targetUserId,{
                userId:true,
                avatarUri:true,
                fullName:true,
                createdAt:true,
                updatedAt:true,
                email:true
            });
            return GrpcResponse.OK(u,"User found");
        } catch (e:any) {
           return this._errorHandler(e,"GET-USER",reqMeta.requestId);
        }
    }

    async GetMe({reqMeta,authUserData:{userId}}:BodyLessRequestBodyType){
        try {
            const u = await this._dbService.findUniqueUserById(userId,{
                userId:true,
                fullName:true,
                avatarUri:true,
                email:true,
                provider:true,
                createdAt:true,
                updatedAt:true,
                password:true,
                teamMembers:true,
                projectMembers:true
            })
            return GrpcResponse.OK(u,"User found");
        } catch (e:any) {
            return this._errorHandler(e,"GET-ME",reqMeta.requestId);
        }
    }

    async refreshToken({reqMeta,authUserData}:BodyLessRequestBodyType){
      try {
        return this.createSession(authUserData);
      } catch (e:any) {
        return this._errorHandler(e,"REFRESH_TOKEN",reqMeta.requestId);
      }
    }

    async hasPermissions({authUserData:{userId},resourceId,permissions,scope,targetUserId,reqMeta}:HasPermissionsRequestBodyType){
     try {
        const has = await this._permissions.canAccess({
            userId,
            resourceId,
            permission:permissions,
            scope,
            targetUserId
        })
        return GrpcResponse.OK(has,"Permission derived");
     } catch (e:any) {
        return this._errorHandler(e,"HAS-PERMISSIONS",reqMeta.requestId);
     }
    }
}

export default AuthService;