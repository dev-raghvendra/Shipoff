import { GetProjectClient } from "@shipoff/grpc-clients";
import { InternalEmptyRequest, ProjectsServiceClient } from "@shipoff/proto";
import { promisifyGrpcCall } from "@shipoff/services-commons";
import { InternalEmptyRequestBodyType } from "@shipoff/types";

export class ProjectsExternalService {
    private _projectsService : ProjectsServiceClient;
    constructor(){
        this._projectsService = GetProjectClient()
    }

    async getStaleEnvironmentIds(body:InternalEmptyRequestBodyType){
            const req = InternalEmptyRequest.fromObject(body)
            const res = await promisifyGrpcCall(this._projectsService.IGetStaleEnvironmentIds.bind(this._projectsService),req)
            return res.res
    }
}