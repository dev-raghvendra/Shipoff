import { GetProjectClient } from "@shipoff/grpc-clients";
import { BulkResourceRequest, CreateProjectRequest, CreateRepositoryRequest, DeleteDeploymentRequest, DeleteEnvVarsRequest, DeleteProjectRequest, DeleteRepositoryRequest, GetAllDeploymentsRequest, GetAllUserProjectsRequest, GetDeploymentRequest, GetEnvVarsRequest, GetProjectRequest, GetRepositoryRequest, ProjectsServiceClient, RedeployRequest, UpdateProjectRequest, UpsertEnvVarsRequest } from "@shipoff/proto";
import { promisifyGrpcCall } from "@shipoff/services-commons/utils/rpc-utils";

export class ProjectService {
    private _projectService: ProjectsServiceClient;

    constructor() {
        this._projectService = GetProjectClient();
    }   

    async createProject(data: any) {
        try {
            const req = CreateProjectRequest.fromObject(data);
            const response = await promisifyGrpcCall(this._projectService.CreateProject.bind(this._projectService), req);
            return response;
        } catch (e:any) {
            return e;
        }
    }

    async getAllUserProjects(data: any) {
        try {
            const req = GetAllUserProjectsRequest.fromObject(data);
            const response = await promisifyGrpcCall(this._projectService.GetAllUserProjects.bind(this._projectService), req);
            return response;
        } catch (e:any) {
            return e;
        }
    }

    async getProject(data: any) {
        try {
            const req = GetProjectRequest.fromObject(data);
            const response = await promisifyGrpcCall(this._projectService.GetProject.bind(this._projectService), req);
            return response;
        } catch (e:any) {
            return e;
        }
    }

    async updateProject(data: any) {
        try {
            const req = UpdateProjectRequest.fromObject(data);
            const response = await promisifyGrpcCall(this._projectService.UpdateProject.bind(this._projectService), req);
            return response;
        } catch (e:any) {
            return e;
        }
    }

    async deleteProject(data: any) {
        try {
            const req = DeleteProjectRequest.fromObject(data);
            const response = await promisifyGrpcCall(this._projectService.DeleteProject.bind(this._projectService), req);
            return response;
        } catch (e:any) {
            return e;
        }
    }

    async getAllDeployments(data: any) {
        try {
            const req = GetAllDeploymentsRequest.fromObject(data);
            const response = await promisifyGrpcCall(this._projectService.GetAllDeployments.bind(this._projectService), req);
            return response;
        } catch (e:any) {
            return e;
        }
    }

    async getDeployment(data: any) {
        try {
            const req = GetDeploymentRequest.fromObject(data);
            const response = await promisifyGrpcCall(this._projectService.GetDeployment.bind(this._projectService), req);
            return response;
        } catch (e:any) {
            return e;
        }
    }

    async deleteDeployment(data: any) {
        try {
            const req = DeleteDeploymentRequest.fromObject(data);
            const response = await promisifyGrpcCall(this._projectService.DeleteDeployment.bind(this._projectService), req);
            return response;
        } catch (e:any) {
            return e;
        }
    }

    async redeploy(data: any) {
        try {
            const req = RedeployRequest.fromObject(data);
            const response = await promisifyGrpcCall(this._projectService.Redeploy.bind(this._projectService), req);
            return response;
        } catch (e:any) {
            return e;
        }
    }

    async getEnvVars(data: any) {
        try {
            const req = GetEnvVarsRequest.fromObject(data);
            const response = await promisifyGrpcCall(this._projectService.GetEnvVars.bind(this._projectService), req);
            return response;
        } catch (e:any) {
            return e;
        }
    }

    async createOrUpdateEnvVar(data: any) {
        try {
            const req = UpsertEnvVarsRequest.fromObject(data);
            const response = await promisifyGrpcCall(this._projectService.UpsertEnvVars.bind(this._projectService), req);
            return response;
        } catch (e:any) {
            return e;
        }
    }

    async deleteEnvVar(data: any) {
        try {
            const req = DeleteEnvVarsRequest.fromObject(data);
            const response = await promisifyGrpcCall(this._projectService.DeleteEnvVars.bind(this._projectService), req);
            return response;
        } catch (e:any) {
            return e;
        }
    }

    async getRepository(data: any) {
        try {
            const req = GetRepositoryRequest.fromObject(data);
            const response = await promisifyGrpcCall(this._projectService.GetRepository.bind(this._projectService), req);
            return response;
        } catch (e:any) {
            return e;
        }
    }

    async deleteRepository(data: any) {
        try {
            const req = DeleteRepositoryRequest.fromObject(data);
            const response = await promisifyGrpcCall(this._projectService.DeleteRepository.bind(this._projectService), req);
            return response;
        } catch (e:any) {
            return e;
        }
    }

    async createRepository(data: any) {
        try {
            const req = CreateRepositoryRequest.fromObject(data);
            const response = await promisifyGrpcCall(this._projectService.CreateRepository.bind(this._projectService), req);
            return response;
        } catch (e:any) {
            return e;
        }
    }

    async getFrameworks(data: any) {
        try {
            const req = BulkResourceRequest.fromObject(data);
            const response = await promisifyGrpcCall(this._projectService.GetFrameworks.bind(this._projectService), req);
            return response;
        } catch (e:any) {
            return e;
        }
    }
}


