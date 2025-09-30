import { status } from "@grpc/grpc-js";
import { GetAuthClient } from "@shipoff/grpc-clients";
import { AuthServiceClient, HasPermissionsRequest } from "@shipoff/proto";
import { promisifyGrpcCall, GrpcAppError } from "@shipoff/services-commons";
import { UserType, PermissionsType, ScopesType } from "@shipoff/types";

export class AuthExternalService {
    private _authServiceClient:AuthServiceClient
    constructor(){
        this._authServiceClient = GetAuthClient()
    }

    async getPermissions({authUserData,permissions,scope,resourceId,errMsg,reqMeta}:{
        authUserData: UserType
        permissions: PermissionsType[],
        scope: ScopesType,
        resourceId: string,
        errMsg?: string,
        reqMeta?: {requestId:string}
    }) {
        try {
            const req = HasPermissionsRequest.fromObject({
                authUserData,
                permissions,
                scope,
                resourceId,
                reqMeta
            })
            const res = await promisifyGrpcCall(this._authServiceClient.HasPermissions,req)
            
            if(!(res as ReturnType<typeof res.toObject>).res) throw new GrpcAppError(status.PERMISSION_DENIED,"")
            return res.res;
        } catch (e:any) {
            if (e.code === status.PERMISSION_DENIED){
                throw new GrpcAppError(status.PERMISSION_DENIED, errMsg || "You do not have permission to perform this action")
          }
          throw new GrpcAppError(status.INTERNAL,"Unexpected error occurred",e)
        }
    } 
}