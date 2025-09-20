import { CONFIG } from "@/config/config";
import { GithubService } from "@/services/github.service";
import { RequestWithMeta } from "@/types/request";
import { grpcToHttpResponse } from "@/utils/res-utils";
import { verifyJwt } from "@shipoff/services-commons";
import { Response } from "express";
const githubService = new GithubService();

export async function getUserGithubRepositoriesController(req: RequestWithMeta, res: Response) {
    const body = {
        ...req.body,
        ...(req.query.skip && { skip: req.query.skip }),
        ...(req.query.limit && { limit: req.query.limit }),
        reqMeta: req.meta
    }
    const { code, message, res: data } = await githubService.getUserGithubRepositories(body);
    grpcToHttpResponse.call(res, code, message, data);
}

export async function getGithubRepositoryDetailsController(req: RequestWithMeta, res: Response) {
    const {repoId} = req.params;
    const body = {...req.body, repoId, reqMeta: req.meta};
    const { code, message, res: data } = await githubService.getGithubRepositoryDetails(body);
    grpcToHttpResponse.call(res, code, message, data);
}

export async function githubInstallationCallbackController(req: RequestWithMeta, res: Response) {
    const {installation_id,state} = req.query;
    try {
        const {authUserData} = await verifyJwt(state as string) as any
        const data = await githubService.githubInstallationCallback({ installation_id, authUserData, reqMeta:req.meta });
        if(data.code) return grpcToHttpResponse.call(res, data.code, data.message, null);
        res.redirect(CONFIG.POST_GITHUB_INSTALLATION_FRONTEND_DESTINATION)
    } catch (e:any) {
        grpcToHttpResponse.call(res, 401, "Unauthorized", null);
    }
}

export async function getGithubInstallationController(req: RequestWithMeta, res: Response) {
    const { code, message, res: data } = await githubService.getGithubInstallation({...req.body, reqMeta: req.meta });
    grpcToHttpResponse.call(res, code, message, data);
}
