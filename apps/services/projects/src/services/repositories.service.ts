import { createGrpcErrorHandler, generateId, GrpcAppError, GrpcResponse } from "@shipoff/services-commons";
import { Database, dbService } from "@/db/db-service";
import authExternalService, { AuthExternalService } from "@/externals/auth.external.service";
import githubExternalService, { GithubExternalService } from "@/externals/github.external.service";
import { LinkRepositoryRequestBodyType, UnlinkRepositoryRequestBodyType } from "@/types/repositories";
import { logger } from "@/libs/winston";
import { status } from "@grpc/grpc-js";

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

    
    async unlinkRepository({authUserData, projectId, reqMeta}:UnlinkRepositoryRequestBodyType) {
        try {
            await this._authService.getPermissions({
                authUserData,
                permissions:["DELETE"],
                scope:"REPOSITORY",
                resourceId: projectId,
                errMsg: "You do not have permission to delete this repository",
                reqMeta
            })
            const repository = await this._dbService.updateManyRepository({
                where:{
                    projectId,
                    isConnected:true
                },
                data:{
                    isConnected:false
                }
            })
            if(!repository.count) throw new GrpcAppError(status.NOT_FOUND, "This project has no repositories linked", {
                projectId
            }); 
            return GrpcResponse.OK(repository,"Repository unlinked");
        } catch (e:any) {
            return this._errHandler(e,"DELETE-REPOSITORY",reqMeta.requestId);
        }
    }

    async linkRepository({authUserData,reqMeta,...body}:LinkRepositoryRequestBodyType){
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
            githubInstallationId,
            projectId:body.projectId,
            githubRepoFullName: ghr.githubRepoFullName,
            githubRepoId: ghr.githubRepoId,
            githubRepoURI: ghr.githubRepoURI,
            branch: body.branch,
            rootDir: body.rootDir,
            isConnected:true
          }
          await this._dbService.createRepository(data);
          return GrpcResponse.OK(data,"Repository created");
       } catch (e:any) {
            return this._errHandler(e,"CREATE-REPOSITORY",reqMeta.requestId);
       }
    }
}   

