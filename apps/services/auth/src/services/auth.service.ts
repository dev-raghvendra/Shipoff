import { createJwt, verifyJwt } from "@shipoff/services-commons";
import { compare } from "@/libs/bcrypt";
import { EmailPassLoginRequestBodyType, GetUserRequestBodyType, OAuthRequestBodyType, SigninRequestBodyType, VerifyEmailRequestBodyType } from "@/types/user";
import { HasPermissionsRequestBodyType } from "@/types/utility";
import { BodyLessRequestBodyType } from "@shipoff/types";
import { PermissionBase } from "@/utils/rbac-utils";
import { Database, dbService } from "@/db/db-service";
import { createGrpcErrorHandler, GrpcAppError, GrpcResponse } from "@shipoff/services-commons";
import { status } from "@grpc/grpc-js";
import {logger} from "@/libs/winston";
import { normalizeSubscriptionData } from "@/utils/db-utils";


class AuthService {

    private _permissions : PermissionBase
    private _dbService : Database
    private _errorHandler : ReturnType<typeof createGrpcErrorHandler>
    private _userSelect = {
            userId:true,
            email:true,
            fullName:true,
            avatarUri:true,
            provider:true,
            createdAt:true,
            updatedAt:true,
            emailVerified:true,
            subscription:{
              select:{
                subscriptionId:true,
                type:true,
                startedAt:true,
                endedAt:true,
                freePerks:true,
                proPerks:true
            },
           }
    }

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
            const res = await this._dbService.createEmailUser(body,this._userSelect);
            const u = normalizeSubscriptionData(res)
            return await this.createSession(u);
        } catch (e : any) {
            return this._errorHandler(e,"SIGNIN",reqMeta.requestId);
        }
    }



    async login({reqMeta,...body}: EmailPassLoginRequestBodyType) {
        try {
            const res = await this._dbService.findUniqueUser({
                where:{email:body.email},
                select:{...this._userSelect,password:true}
            });
            const isVerified = await compare(body.password,res.password)
            if(!isVerified) throw new GrpcAppError(status.UNAUTHENTICATED,"Invalid credentials",null);
            const {password, ...user} = res;
            const u = normalizeSubscriptionData(user);
            return this.createSession(u);
        } catch (e:any) {
            return this._errorHandler(e,"LOGIN",reqMeta.requestId);
        }
    }

    async OAuth({reqMeta,...body}:OAuthRequestBodyType){
        try {
            const res = await this._dbService.createOAuthUser(body,this._userSelect);
            const u = normalizeSubscriptionData(res)
            return await this.createSession(u);
        } catch (e:any) {
            console.log("OAuth Error:", e);
             if (e.code === status.ALREADY_EXISTS){
                const res = await this._dbService.findUniqueUser({
                    where:{email:body.email},
                    select:this._userSelect
                })
                const u = normalizeSubscriptionData(res)
            return this.createSession(u);
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
            const res = await this._dbService.findUniqueUser({
                where:{userId},
                select:this._userSelect
            })
            const u = normalizeSubscriptionData(res)
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

    async getWSAuthToken({reqMeta,authUserData}:BodyLessRequestBodyType){
        try {
            const wsAuthToken = await createJwt({authUserData},"5m")
            return GrpcResponse.OK({wsAuthToken},"WS Auth Token generated");
        } catch (e:any) {
            return this._errorHandler(e,"GET-WS-AUTH-TOKEN",reqMeta.requestId);
        }
    }

    async verifyEmail({reqMeta,token}:VerifyEmailRequestBodyType){
       try {
          const {email} = await verifyJwt<{email:string}>(token)
          await this._dbService.updateUser({
            where:{email},
            data:{
              emailVerified:true
            }
          })
          return GrpcResponse.OK({},"Email verified");
       } catch (e:any) {
         return this._errorHandler(e,"VERIFY-EMAIL",reqMeta.requestId);
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