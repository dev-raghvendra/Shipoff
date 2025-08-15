import { GithubService } from "@/services/github.service";
import { grpcToHttpResponse } from "@/utils/res-utils";
import { Request, Response } from "express";
const githubService = new GithubService();

export async function getUserGithubRepositoriesController(req: Request, res: Response) {
    const body = {
        ...req.body,
        skip:req.query.skip,
        limit:req.query.limit
    }
    const { code, message, res: data } = await githubService.getUserGithubRepositories(body);
    grpcToHttpResponse.call(res, code, message, data);
}

export async function getGithubRepositoryDetailsController(req: Request, res: Response) {
    const {repoId} = req.params;
    const body = {...req.body, repoId};
    const { code, message, res: data } = await githubService.getGithubRepositoryDetails(body);
    grpcToHttpResponse.call(res, code, message, data);
}

export async function githubInstallationCallbackController(req: Request, res: Response) {
    const { code, message, res: data } = await githubService.githubInstallationCallback(req.body);
    grpcToHttpResponse.call(res, code, message, data);
}

export async function getGithubInstallationController(req: Request, res: Response) {
    const { code, message, res: data } = await githubService.getGithubInstallation(req.body);
    grpcToHttpResponse.call(res, code, message, data);
}
