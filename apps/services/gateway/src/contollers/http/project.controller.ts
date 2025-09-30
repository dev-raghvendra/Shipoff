import { ProjectService } from "@/services/project.service";
import { Request, Response } from "express";
import { grpcToHttpResponse } from "@/utils/res-utils";
import { RequestWithMeta } from "@/types/request";

const projectService = new ProjectService();

export async function createProjectController(req:RequestWithMeta, res: Response) {
    const { code, message, res: data } = await projectService.createProject({...req.body,reqMeta:{
        requestId: req.meta
    }});
    grpcToHttpResponse.call(res, code, message, data);
}

export async function getAllUserProjectsController(req:RequestWithMeta, res: Response) {
    const body = {
        ...req.body,
        ...(req.query.skip && { skip: req.query.skip }),
        ...(req.query.limit && { limit: req.query.limit }),
        reqMeta:req.meta
    }
    const { code, message, res: data } = await projectService.getAllUserProjects(body);
    grpcToHttpResponse.call(res, code, message, data);
}

export async function getProjectController(req:RequestWithMeta, res: Response) {
    const { projectId } = req.params;
    const body = { ...req.body, projectId, reqMeta:req.meta };
    const { code, message, res: data } = await projectService.getProject(body);
    grpcToHttpResponse.call(res, code, message, data);
}

export async function updateProjectController(req:RequestWithMeta, res: Response) {
    const { projectId } = req.params;
    const body = { ...req.body, projectId, reqMeta:req.meta };
    const { code, message, res: data } = await projectService.updateProject(body);
    grpcToHttpResponse.call(res, code, message, data);
}

export async function deleteProjectController(req:RequestWithMeta, res: Response) {
    const { projectId } = req.params;
    const body = { ...req.body, projectId, reqMeta:req.meta };
    const { code, message, res: data } = await projectService.deleteProject(body);
    grpcToHttpResponse.call(res, code, message, data);
}

export async function getAllDeploymentsController(req:RequestWithMeta, res: Response) {
    const body = {
        ...req.body,
        projectId: req.params.projectId,
        ...(req.query.skip && { skip: req.query.skip }),
        ...(req.query.limit && { limit: req.query.limit }),
        reqMeta:req.meta
    }
    const { code, message, res: data } = await projectService.getAllDeployments(body);
    grpcToHttpResponse.call(res, code, message, data);
}

export async function getDeploymentController(req:RequestWithMeta, res: Response) {
    const { projectId, deploymentId } = req.params;
    const body = { ...req.body, projectId, deploymentId, reqMeta:req.meta };
    const { code, message, res: data } = await projectService.getDeployment(body);
    grpcToHttpResponse.call(res, code, message, data);
}

export async function deleteDeploymentController(req:RequestWithMeta, res: Response) {
    const { projectId, deploymentId } = req.params;
    const body = { ...req.body, projectId, deploymentId, reqMeta:req.meta };
    const { code, message, res: data } = await projectService.deleteDeployment(body);
    grpcToHttpResponse.call(res, code, message, data);
}

export async function redeployController(req:RequestWithMeta, res: Response) {
    const { projectId, deploymentId } = req.params;
    const body = { ...req.body, projectId, deploymentId, reqMeta:req.meta };
    const { code, message, res: data } = await projectService.redeploy(body);
    grpcToHttpResponse.call(res, code, message, data);
}


export async function getEnvironmentVariablesController(req:RequestWithMeta, res: Response) {
    const { projectId } = req.params;
    const body = { ...req.body, projectId, reqMeta:req.meta };
    const { code, message, res: data } = await projectService.getEnvVars(body);
    grpcToHttpResponse.call(res, code, message, data);
}

export async function createOrUpdateEnvironmentVariableController(req:RequestWithMeta, res: Response) {
    const { projectId } = req.params;
    const body = { ...req.body, projectId, reqMeta:req.meta };
    const { code, message, res: data } = await projectService.createOrUpdateEnvVar(body);
    grpcToHttpResponse.call(res, code, message, data);
}

export async function deleteEnvironmentVariableController(req:RequestWithMeta, res: Response) {
    const {projectId,env_name} = req.params;
    const body = { ...req.body, projectId, env_name, reqMeta:req.meta };
    const { code, message, res: data } = await projectService.deleteEnvVar(body);
    grpcToHttpResponse.call(res, code, message, data);
}

export async function getRepositoryController(req:RequestWithMeta, res: Response) {
    const {projectId} = req.params
    const body = { ...req.body, projectId, reqMeta:req.meta };
    const { code, message, res: data } = await projectService.getRepository(body);
    grpcToHttpResponse.call(res, code, message, data);
}

export async function createRepositoryController(req:RequestWithMeta, res: Response) {
    const {projectId} = req.params;
    const body = { ...req.body, projectId, reqMeta:req.meta };
    const { code, message, res: data } = await projectService.createRepository(body);
    grpcToHttpResponse.call(res, code, message, data);
}

export async function deleteRepositoryController(req:RequestWithMeta, res: Response) {
    const {projectId} = req.params;
    const body = { ...req.body, projectId, reqMeta:req.meta };
    const { code, message, res: data } = await projectService.deleteRepository(body);
    grpcToHttpResponse.call(res, code, message, data);
}

export async function getFrameworksController(req:RequestWithMeta, res: Response) {
    const body = {
        ...req.body,
        ...(req.query.skip && { skip: req.query.skip }),
        ...(req.query.limit && { limit: req.query.limit }),
        reqMeta:req.meta
    }
    const { code, message, res: data } = await projectService.getFrameworks(body);
    grpcToHttpResponse.call(res, code, message, data);
}