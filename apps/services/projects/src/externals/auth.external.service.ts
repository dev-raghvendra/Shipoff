import { status } from "@grpc/grpc-js";
import { GetAuthClient } from "@shipoff/grpc-clients";
import { AuthServiceClient , HasPermissionsRequest, BodyLessRequest, GetProjectIdsLinkedToTeamRequest} from "@shipoff/proto";
import { GrpcAppError, promisifyGrpcCall } from "@shipoff/services-commons";
import { UserType, ScopesType, PermissionsType } from "@shipoff/types";

export class AuthExternalService {
    private _authService: AuthServiceClient;

    constructor() {
        this._authService = GetAuthClient();
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
            const res = await promisifyGrpcCall(this._authService.HasPermissions,req)
            if(!(res as ReturnType<typeof res.toObject>).res) throw new GrpcAppError(status.PERMISSION_DENIED,"")   
            return res.res;
        } catch (e:any) {
            if (e.code === status.PERMISSION_DENIED){
                new GrpcAppError(status.PERMISSION_DENIED, errMsg || "You do not have permission to perform this action")
          }
          throw new GrpcAppError(status.INTERNAL,"Unexpected error occurred",e)
        }
    }

    async getUserProjectIds(authUserData: UserType,reqMeta:{requestId:string}) {
        try {
            const req = BodyLessRequest.fromObject({
                authUserData,
                reqMeta
            })
        const res = await promisifyGrpcCall(this._authService.GetAllUserProjectIds, req);
        return res.res as string[];
        } catch (e:any) {
            throw new GrpcAppError(status.INTERNAL, "Unexpected error occurred", e);
        }
    }

    async getUserProjectIdsLinkedToTeam({authUserData,teamId,reqMeta}:{authUserData:UserType,teamId:string,reqMeta:{requestId:string}}){
        try {
            const req = GetProjectIdsLinkedToTeamRequest.fromObject({
                authUserData,
                teamId,
                reqMeta
            })
            const res = await promisifyGrpcCall(this._authService.IGetAllProjectIdsLinkedToTeam,req)
            return res.res as string[];
        } catch (e:any) {
            if(e.code === status.PERMISSION_DENIED){
                throw new GrpcAppError(status.PERMISSION_DENIED,"You do not have permission to access projects linked to this team");
            }
            throw new GrpcAppError(status.INTERNAL,"Unexpected error occurred",e)
        }
    }
}

const authExternalService = new AuthExternalService();
export default authExternalService;
