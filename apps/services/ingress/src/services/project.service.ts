import { projectCache } from "@/cache/project.cache";
import { logger } from "@/libs/winston";
import { GetProjectClient } from "@shipoff/grpc-clients";
import { IGetProjectRequest, ProjectsServiceClient } from "@shipoff/proto";
import { promisifyGrpcCall, createSyncErrHandler } from "@shipoff/services-commons";
import {RequestMetaType} from "@shipoff/types"

export class ProjectsService {
    private _projectClient : ProjectsServiceClient
    private _errHandler : ReturnType<typeof createSyncErrHandler>

    constructor(){
        this._projectClient = GetProjectClient()
        this._errHandler = createSyncErrHandler({subServiceName:"PROJECTS_SERVICE",logger})
    }

    async getProjectByDomain(domain:string,reqMeta:RequestMetaType){
        try {
            const project = projectCache.get(domain)
            if(project) return project;
            const req = IGetProjectRequest.fromObject({domain,reqMeta})
            const res = await  promisifyGrpcCall(this._projectClient.IGetProject.bind(this._projectClient),req)
            const payload = {
                projectId:res.res?.projectId!,
                projectType:res.res?.framework?.applicationType as "STATIC" | "DYNAMIC",
                deploymentRequested:false,
                domain,
                name:res.res?.name!,
            }
            projectCache.set(domain,payload)
            return payload
        } catch (e:any) {
            if(e.code === 5) return null;
            this._errHandler(e,"GET-PROJECT-BY-DOMAIN",reqMeta.requestId)
            throw e
        }
    }
}