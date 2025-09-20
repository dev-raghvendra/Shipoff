import {GetProjectClient} from "@shipoff/grpc-clients"
import { IGetGithubRepoAccessTokenRequest, IGetProjectRequest, ProjectsServiceClient } from "@shipoff/proto"
import { promisifyGrpcCall } from "@shipoff/services-commons";


export class ProjectExternalService {
    private _projectService : ProjectsServiceClient;
    constructor(){
        this._projectService = GetProjectClient();
    }

    async getProjectById(projectId:string,requestId:string){
        try {
            const req = IGetProjectRequest.fromObject({ projectId,reqMeta:{requestId} });
            const res = await promisifyGrpcCall(this._projectService.IGetProject, req );
            return res.res;
        } catch (e:any) {
            throw e
        }
    }

    async getRepositoryAccessToken(githubRepoId:string,requestId:string){
        try {
            const req = IGetGithubRepoAccessTokenRequest.fromObject({githubRepoId,reqMeta:{requestId}});
            const res = await promisifyGrpcCall(this._projectService.IGetGithubRepoAccessToken, req );
            return res.res;
        } catch (e:any) {
            throw e
        }
    }
}