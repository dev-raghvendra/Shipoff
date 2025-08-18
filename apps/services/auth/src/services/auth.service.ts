import { createJwt } from "@shipoff/services-commons";
import { compare } from "@/libs/bcrypt";
import { EmailPassLoginRequestBodyType, GetUserRequestBodyType, OAuthRequestBodyType, SigninRequestBodyType } from "@/types/user";
import { HasPermissionsRequestBodyType } from "@/types/utility";
import { BodyLessRequestBodyType } from "@shipoff/types";
import { PermissionBase } from "@/utils/rbac-utils";
import { Database, dbService } from "@/db/db-service";
import { createGrpcErrorHandler, GrpcAppError, GrpcResponse } from "@shipoff/services-commons";
import { status } from "@grpc/grpc-js";


class AuthService {

    private _permissions : PermissionBase
    private _dbService : Database
    private _errorHandler : ReturnType<typeof createGrpcErrorHandler>

    constructor(){
        this._permissions = new PermissionBase()
        this._dbService = dbService;
        this._errorHandler = createGrpcErrorHandler({serviceName:"AUTH_SERVICE"});
    }

    private async createSession(u: any) {
        const [accessToken, refreshToken] = await Promise.all([
            createJwt({authUserData:u}),
            createJwt({authUserData:u}, "7d"),
        ]);
        return GrpcResponse.OK({ accessToken, refreshToken }, "Session created");
    }

    async signIn(body: SigninRequestBodyType) {
        try {
            const u = await this._dbService.createEmailUser(body);
            return await this.createSession(u);
        } catch (e : any) {
            return this._errorHandler(e,"SIGNIN");
        }
    }

    async login(body: EmailPassLoginRequestBodyType) {
        try {
            const u = await this._dbService.findUniqueUser({
                where:{email:body.email}
            });
            const isVerified = await compare(body.password,u.password)
            if(!isVerified) throw new GrpcAppError(status.NOT_FOUND,"Invalid credentials",null);
            const {password, ...user} = u;
            return this.createSession(user);
        } catch (e:any) {
            return this._errorHandler(e,"LOGIN");
        }
    }

    async OAuth(body:OAuthRequestBodyType){
        try {
            const u = await this._dbService.createOAuthUser(body);
            return await this.createSession(u);
        } catch (e:any) {
             if (e.code === status.ALREADY_EXISTS){
                const {password, ...user} = await this._dbService.findUniqueUser({where:{email:body.email}});
                return await this.createSession(user);
             }
            
            return this._errorHandler(e,"OAUTH");
        }
    }
    
    
    async GetUser(body:GetUserRequestBodyType){
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
           return this._errorHandler(e,"GET-USER");
        }
    }

    async GetMe(userId:string){
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
            return this._errorHandler(e,"GET-ME");
        }
    }

    async refreshToken(body:BodyLessRequestBodyType){
      try {
        return this.createSession(body.authUserData);
      } catch (e:any) {
        return this._errorHandler(e,"REFRESH_TOKEN");
      }
    }

    async hasPermissions({authUserData:{userId},resourceId,permissions,scope,targetUserId}:HasPermissionsRequestBodyType){
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
        return this._errorHandler(e,"HAS-PERMISSIONS");
     }
    }
}

export default AuthService;