import { sendUnaryData, ServerUnaryCall, status } from "@grpc/grpc-js";
import { AllProjectsResponse, BulkResourceRequest, CreateProjectRequest, DeleteEnvVarsRequest, DeleteEnvVarsResponse, DeleteProjectRequest, EnvVarsResponse, FrameworkResponse, GetAllUserProjectsRequest, GetEnvVarsRequest, GetProjectRequest, IGetProjectRequest, InternalEmptyRequest, ProjectResponse, StaleEnvironmentIdsResponse, UpdateProjectRequest, UpsertEnvVarsRequest, UpsertEnvVarsResponse } from "@shipoff/proto";
import { BulkResourceRequestBodyType, InternalEmptyRequestBodyType } from "@shipoff/types";
import { ProjectsService } from "services/projects.service";
import { CreateProjectRequestBodyType, DeleteEnvVarsRequestBodyType, DeleteProjectRequestBodyType, GetAllUserProjectRequestBodyType, GetEnvVarsRequestBodyType, GetProjectRequestBodyType, IGetProjectRequestBodyType, UpdateProjectRequestBodyType, UpsertEnvVarsRequestBodyType } from "types/projects";

export class ProjectsHandlers {
    private _projectsService : ProjectsService;
    constructor() {
        this._projectsService = new ProjectsService();
    }

    async handleCreateProject(call:ServerUnaryCall<CreateProjectRequest & {body:CreateProjectRequestBodyType}, ProjectResponse>,callback:sendUnaryData<ProjectResponse>) {
        try {
            const {code,res,message} = await this._projectsService.createProject(call.request.body);
        if(code !== status.OK) return callback({code,message});
            const response = ProjectResponse.fromObject({code,message,res})
            return callback(null,response);
        } catch (e:any) {
            return callback({
                code:status.INTERNAL,
                message:"Internal server error"
            })
        }
    }

    async handleGetProject(call:ServerUnaryCall<GetProjectRequest & {body:GetProjectRequestBodyType}, ProjectResponse>,callback:sendUnaryData<ProjectResponse>) {
        try {
            const {code,res,message} = await this._projectsService.getProject(call.request.body);
            if(code !== status.OK) return callback({code,message});
            const response = ProjectResponse.fromObject({code,message,res})
            return callback(null,response);
        } catch (e:any) {
            return callback({
                code:status.INTERNAL,
                message:"Internal server error"
            })
        }
    }


    async handleGetAllUserProjects(call:ServerUnaryCall<GetAllUserProjectsRequest & {body:GetAllUserProjectRequestBodyType}, AllProjectsResponse>,callback:sendUnaryData<AllProjectsResponse>) {
        try {
            const {code,res,message} = await this._projectsService.getAllUserProjects(call.request.body);
            if(code !== status.OK) return callback({code,message});
            const response = AllProjectsResponse.fromObject({code,message,res})
            return callback(null,response);
        } catch (e:any) {
            return callback({
                code:status.INTERNAL,
                message:"Internal server error"
            })
        }
    }

    async handleGetLatestProjects(call:ServerUnaryCall<BulkResourceRequest & {body:BulkResourceRequestBodyType}, AllProjectsResponse>,callback:sendUnaryData<AllProjectsResponse>) {
        try {
            const {code,res,message} = await this._projectsService.getLatestUserProjects(call.request.body);
            if(code !== status.OK) return callback({code,message});
            const response = AllProjectsResponse.fromObject({code,message,res})
            return callback(null,response);
        } catch (e:any) {
            return callback({
                code:status.INTERNAL,
                message:"Internal server error"
            })
        }
    }

    async handleUpdateProject(call:ServerUnaryCall<UpdateProjectRequest & {body:UpdateProjectRequestBodyType}, ProjectResponse>,callback:sendUnaryData<ProjectResponse>) {
        try {
            const {code,res,message} = await this._projectsService.updateProject(call.request.body);
            if(code !== status.OK) return callback({code,message});
            const response = ProjectResponse.fromObject({code,message,res})
            return callback(null,response);
        } catch (e:any) {
            return callback({
                code:status.INTERNAL,
                message:"Internal server error"
            })
        }
    }

    async handleDeleteProject(call:ServerUnaryCall<DeleteProjectRequest & {body:DeleteProjectRequestBodyType}, ProjectResponse>,callback:sendUnaryData<ProjectResponse>) {
        try {
            const {code,res,message} = await this._projectsService.deleteProject(call.request.body);
            if(code !== status.OK) return callback({code,message});
            const response = ProjectResponse.fromObject({code,message,res})
            return callback(null,response);
        } catch (e:any) {
            return callback({
                code:status.INTERNAL,
                message:"Internal server error"
            })
        }
    }

    async handleGetProjectEnvironmentVariables(call: ServerUnaryCall<GetEnvVarsRequest & { body: GetEnvVarsRequestBodyType }, EnvVarsResponse>, callback: sendUnaryData<EnvVarsResponse>) {
        try {
            const { code, res, message } = await this._projectsService.getEnvironmentVariables(call.request.body);
            if (code !== status.OK) return callback({ code, message });
            const response = EnvVarsResponse.fromObject({ code, message, res });
            return callback(null, response);
        } catch (e: any) {
            return callback({
                code: status.INTERNAL,
                message: "Internal server error"
            });
        }
    }

    async handleUpsertProjectEnvironmentVariables(call: ServerUnaryCall<UpsertEnvVarsRequest & { body: UpsertEnvVarsRequestBodyType }, UpsertEnvVarsResponse>, callback: sendUnaryData<UpsertEnvVarsResponse>) {
        try {
            const { code, message } = await this._projectsService.upsertEnvironmentVariables(call.request.body);
            if (code !== status.OK) return callback({ code, message });
            const response = UpsertEnvVarsResponse.fromObject({ code, message });
            return callback(null, response);
        } catch (e: any) {
            return callback({
                code: status.INTERNAL,
                message: "Internal server error"
            });
        }
    }

    async handleDeleteProjectEnvironmentVariables(call: ServerUnaryCall<DeleteEnvVarsRequest & { body: DeleteEnvVarsRequestBodyType }, DeleteEnvVarsResponse>, callback: sendUnaryData<DeleteEnvVarsResponse>) {
        try {
            const { code,res, message } = await this._projectsService.deleteEnvironmentVariable(call.request.body);
            if (code !== status.OK) return callback({ code, message });
            const response = DeleteEnvVarsResponse.fromObject({ code, message, res });
            return callback(null, response);
        } catch (e: any) {
            return callback({
                code: status.INTERNAL,
                message: "Internal server error"
            });
        }
    }

    async handleGetFrameworks(call: ServerUnaryCall<BulkResourceRequest & {body:BulkResourceRequestBodyType}, FrameworkResponse>, callback: sendUnaryData<FrameworkResponse>) {
        try {
            const { code, res, message } = await this._projectsService.getFrameworks(call.request.body);
            if (code !== status.OK) return callback({ code, message });
            const response = FrameworkResponse.fromObject({ code, message, res });
            return callback(null, response);
        } catch (e: any) {
            return callback({
                code: status.INTERNAL,
                message: "Internal server error"
            });
        }
    }
    
    async handleIGetProject(call:ServerUnaryCall<IGetProjectRequest & {body:IGetProjectRequestBodyType},ProjectResponse>,callback:sendUnaryData<ProjectResponse>) {
        try {
            const {code,res,message} = await this._projectsService.IGetProject(call.request.body);
            if(code !== status.OK) return callback({code,message});
            const response = ProjectResponse.fromObject({code,message,res})
            return callback(null,response);
        } catch (e:any) {
            return callback({
                code:status.INTERNAL,
                message:"Internal server error"
            })
        }
    }

    async handleIGetStaleEnvironmentIds(call:ServerUnaryCall<InternalEmptyRequest & {body:InternalEmptyRequestBodyType},StaleEnvironmentIdsResponse>,callback:sendUnaryData<StaleEnvironmentIdsResponse>) {
        try {
            const {code,res,message} = await this._projectsService.IGetStaleEnvironmentIds(call.request.body);
            if(code !== status.OK) return callback({code,message});
            const response = StaleEnvironmentIdsResponse.fromObject({code,message,res})
            return callback(null,response);
        } catch (e:any) {
            return callback({
                code:status.INTERNAL,
                message:"Internal server error"
            })
        }
    }
}