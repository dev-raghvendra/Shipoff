import { ProjectService } from "@/services/project.service";
import {  Response } from "express";
import { grpcToHttpResponse } from "@/utils/res-utils";
import { RequestWithMeta } from "@/types/request";

const projectService = new ProjectService();

export async function createProjectController(req:RequestWithMeta, res: Response) {
    const { code, message, res: data } = await projectService.createProject({...req.body,reqMeta:req.meta});
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


export async function getLatestProjectsController(req:RequestWithMeta, res: Response) {
    const body = {
        ...req.body,
        ...(req.query.skip && { skip: req.query.skip }),
        ...(req.query.limit && { limit: req.query.limit }),
        reqMeta:req.meta
    }
    const { code, message, res: data } = await projectService.getLatestProjects(body);
    grpcToHttpResponse.call(res, code, message, data);
}
export async function getLatestDeploymentsController(req:RequestWithMeta, res: Response) {
    const body = {
        ...req.body,
        ...(req.query.skip && { skip: req.query.skip }),
        ...(req.query.limit && { limit: req.query.limit }),
        reqMeta:req.meta
    }
    const { code, message, res: data } = await projectService.getLatestDeployments(body);
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
    const {projectId} = req.params;
    const {"keys[]":keys} = req.query;
    const body = { ...req.body, envVarKeys:keys, projectId, reqMeta:req.meta };
    const { code, message, res:data } = await projectService.deleteEnvVar(body);
    grpcToHttpResponse.call(res, code, message, data);
}
export async function getProjectsLinkedToTeamController(req:RequestWithMeta, res: Response) {
    const {teamId} = req.params;
    const body = { ...req.body, teamId, reqMeta:req.meta };
    const { code, message, res: data } = await projectService.getProjectsLinkedToTeam(body);
    grpcToHttpResponse.call(res, code, message, data);
}

export async function checkDomainAvailabilityController(req:RequestWithMeta, res: Response) {
    const {domain} = req.params;
    const body = { ...req.body, domain, reqMeta:req.meta };
    const { code, message, res: data } = await projectService.checkDomainAvailability(body);
    grpcToHttpResponse.call(res, code, message, data);
}



export async function linkRepositoryController(req:RequestWithMeta, res: Response) {
    const {projectId} = req.params;
    const body = { ...req.body, projectId, reqMeta:req.meta };
    const { code, message, res: data } = await projectService.linkRepository(body);
    grpcToHttpResponse.call(res, code, message, data);
}

export async function unlinkRepositoryController(req:RequestWithMeta, res: Response) {
    const {projectId} = req.params;
    const body = { ...req.body, projectId, reqMeta:req.meta }
    const { code, message, res: data } = await projectService.unlinkRepository(body);
    grpcToHttpResponse.call(res, code, message, data);
}

export async function getFrameworksController(req:RequestWithMeta, res: Response) {
    const body = {
        ...req.body,
        reqMeta:req.meta
    }
    const { code, message, res: data } = await projectService.getFrameworks(body);
    grpcToHttpResponse.call(res, code, message, data);
}