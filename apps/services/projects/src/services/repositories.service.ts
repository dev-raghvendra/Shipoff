import { createGrpcErrorHandler, generateId, GrpcResponse } from "@shipoff/services-commons";
import { Database, dbService } from "@/db/db-service";
import authExternalService, { AuthExternalService } from "@/externals/auth.external.service";
import githubExternalService, { GithubExternalService } from "@/externals/github.external.service";
import { CreateRepositoryRequestBodyType, DeleteRepositoryRequestBodyType, GetRepositoryRequestBodyType } from "@/types/repositories";
import { logger } from "@/libs/winston";
import { console } from "inspector";

export class RepositoriesService {
    private _dbService : Database;
    private _authService : AuthExternalService;
    private _errHandler : ReturnType<typeof createGrpcErrorHandler>;
    private _githubService : GithubExternalService;

    constructor(){
        this._errHandler = createGrpcErrorHandler({subServiceName:"REPOSITORY_SERVICE",logger});
        this._dbService = dbService;
        this._authService = authExternalService;
        this._githubService = githubExternalService
    }


    async getRepository({authUserData, projectId,reqMeta}:GetRepositoryRequestBodyType) {
        try {
            await this._authService.getPermissions({
                authUserData,
                permissions:["READ"],
                scope:"REPOSITORY",
                resourceId: projectId,
                errMsg: "You do not have permission to read this repository",
                reqMeta
            })
            const repository = await this._dbService.findUniqueRepository({
                where:{
                    projectId
                }
            })
            return GrpcResponse.OK(repository,"Repository found");
        } catch (e:any) {
            return this._errHandler(e,"GET-REPOSITORY",reqMeta.requestId);
        }
    }

    async deleteUniqueRepository({authUserData, projectId, reqMeta}:DeleteRepositoryRequestBodyType) {
        try {
            await this._authService.getPermissions({
                authUserData,
                permissions:["DELETE"],
                scope:"REPOSITORY",
                resourceId: projectId,
                errMsg: "You do not have permission to delete this repository",
                reqMeta
            })
            const repository = await this._dbService.deleteUniqueRepository({
                where:{
                    projectId
                }
            })
            return GrpcResponse.OK(repository,"Repository unlinked");
        } catch (e:any) {
            return this._errHandler(e,"DELETE-REPOSITORY",reqMeta.requestId);
        }
    }

    async createRepository({authUserData,reqMeta,...body}:CreateRepositoryRequestBodyType){
       try {
          await this._authService.getPermissions({
            authUserData,
            permissions:["CREATE"],
            scope:"REPOSITORY",
            resourceId:body.projectId,
            reqMeta
          })

          const {githubInstallationId} =  await this._dbService.findUniqueGithubInstallation({
            where:{
                userId:authUserData.userId
            }
          })
          const ghr = await this._githubService.getRepositoryDetails(githubInstallationId,body.githubRepoId);
          const data = {
            repositoryId:generateId("Repository",{Repository:"repo"}),
            githubInstallationId,
            projectId:body.projectId,
            githubRepoFullName: ghr.githubRepoFullName,
            githubRepoId: ghr.githubRepoId,
            githubRepoURI: ghr.githubRepoURI,
            branch: body.branch,
            rootDir: body.rootDir
          }
          await this._dbService.startTransaction(async(tx)=>{
            await tx.repository.deleteMany({
                where:{
                    projectId:body.projectId
                }
            })
            await tx.repository.create({
                data
            })
            await tx.deployment.updateMany({
                where:{
                    projectId:body.projectId
                },
                data:{
                    repositoryId: data.repositoryId
                }
            })
          })
          return GrpcResponse.OK(data,"Repository created");
       } catch (e:any) {
            return this._errHandler(e,"CREATE-REPOSITORY",reqMeta.requestId);
       }
    }
}   

