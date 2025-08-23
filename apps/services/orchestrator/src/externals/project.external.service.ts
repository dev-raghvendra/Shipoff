import {GetProjectClient} from "@shipoff/grpc-clients"
import { IGetProjectRequest, ProjectsServiceClient } from "@shipoff/proto"
import { promisifyGrpcCall } from "@shipoff/services-commons";


export class ProjectExternalService {
    private _projectService : ProjectsServiceClient;
    constructor(){
        this._projectService = GetProjectClient();
    }

    async getProjectById(projectId:string){
        try {
            const req = IGetProjectRequest.fromObject({ projectId });
            const res = await promisifyGrpcCall(this._projectService.IGetProject, req );
            return res.res;
        } catch (e:any) {
            throw new Error(`Failed to get project by ID: ${e.message}`);
        }
    }
}