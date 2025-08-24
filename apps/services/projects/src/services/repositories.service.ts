import { createGrpcErrorHandler, GrpcResponse } from "@shipoff/services-commons";
import { Database, dbService } from "@/db/db-service";
import authExternalService, { AuthExternalService } from "@/externals/auth.external.service";
import githubExternalService, { GithubExternalService } from "@/externals/github.external.service";
import { CreateRepositoryRequestBodyType, DeleteRepositoryRequestBodyType, GetRepositoryRequestBodyType } from "@/types/repositories";

export class RepositoriesService {
    private _dbService : Database;
    private _authService : AuthExternalService;
    private _errHandler : ReturnType<typeof createGrpcErrorHandler>;
    private _githubService : GithubExternalService;

    constructor(){
        this._errHandler = createGrpcErrorHandler({serviceName:"REPOSITORY_SERVICE"});
        this._dbService = dbService;
        this._authService = authExternalService;
        this._githubService = githubExternalService
    }


    async getRepository({authUserData, projectId}:GetRepositoryRequestBodyType) {
        try {
            await this._authService.getPermissions({
                authUserData,
                permissions:["READ"],
                scope:"REPOSITORY",
                resourceId: projectId,
                errMsg: "You do not have permission to read this repository"
            })
            const repository = await this._dbService.findUniqueRepository({
                where:{
                    projectId
                }
            })
            return GrpcResponse.OK(repository,"Repository found");
        } catch (e:any) {
            return this._errHandler(e,"GET-REPOSITORY");
        }
    }

    async deleteUniqueRepository({authUserData, projectId }:DeleteRepositoryRequestBodyType) {
        try {
            await this._authService.getPermissions({
                authUserData,
                permissions:["DELETE"],
                scope:"REPOSITORY",
                resourceId: projectId,
                errMsg: "You do not have permission to delete this repository"
            })
            const repository = await this._dbService.deleteUniqueRepository({
                where:{
                    projectId
                }
            })
            return GrpcResponse.OK(repository,"Repository unlinked");
        } catch (e:any) {
            return this._errHandler(e,"DELETE-REPOSITORY")
        }
    }

    async createRepository({authUserData,...body}:CreateRepositoryRequestBodyType){
       try {
          await this._authService.getPermissions({
            authUserData,
            permissions:["CREATE"],
            scope:"REPOSITORY",
            resourceId:body.projectId
          })
          const {githubInstallationId} =  await this._dbService.findUniqueGithubInstallation({
            where:{
                userId:authUserData.userId
            }
          })
          const createdRepo = await this._dbService.createRepository({
              githubInstallationId,
              projectId:body.projectId,
              githubRepoFullName: body.githubRepoFullName,
              githubRepoId: body.githubRepoId,
              githubRepoURI: body.githubRepoURI,
              branch: body.branch
          })
          return GrpcResponse.OK(createdRepo,"Repository created");
       } catch (e:any) {
            return this._errHandler(e,"CREATE-REPOSITORY");
       }
    }
}   

