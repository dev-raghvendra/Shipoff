import { SECRETS } from "@/config/secrets";
import { Database } from "@/db/db-service";
import { ProjectExternalService } from "@/externals/project.external.service";
import { createGrpcErrorHandler, createJwtErrHandler, GrpcResponse, JsonWebTokenError, verifyJwt } from "@shipoff/services-commons";

export class ContainerService {
    private _dbService: Database;
    private _errHandler : ReturnType<typeof createGrpcErrorHandler>
    private _projectService : ProjectExternalService
    private _jwtErrHandler : ReturnType<typeof createJwtErrHandler>
    constructor(){
        this._dbService = new Database();
        this._errHandler = createGrpcErrorHandler({serviceName:"CONTAINER_SERVICE"});
        this._projectService = new ProjectExternalService();
        this._jwtErrHandler = createJwtErrHandler({
            expiredErrMsg:"Time limit exceeded.",
            invalidErrMsg:"Malformed build request."
        });
    }

    async IGetContainerByDomain(domain:string){
        try {
            const container = await this._dbService.findContainer({
                domain
            })
            return GrpcResponse.OK(container, "Container found");
        } catch (e:any) {
            return this._errHandler(e, "GET-CONTAINER")
        }
    }

    async IGetBuildContainerCreds(jwt:string){
        try {
            const {projectId} = await verifyJwt<{projectId:string}>(jwt)
            const project = await this._projectService.getProjectById(projectId);
            const accesToken = await this._projectService.getRepositoryAccessToken(project.repository.githubRepoId);
            const envs = [...project.environmentVars,{
                envName: "OUT_DIR",
                envValue: project.outDir
            },{
                envName: "REPO_URI",
                envValue: `https://x-access-token:${accesToken}@github.com/${project.repository.githubRepoFullName}`
            },{
                envName: "BUILD_COMMAND",
                envValue: project.buildCommand
            },{
                envName: "S3_URI",
                envValue: `${SECRETS.S3_BUCKET_URI}/${project.domain}`
            },{
                envName: "ENDPOINT_URI",
                envValue: SECRETS.S3_ENDPOINT
            },{
                envName:"DOMAIN",
                envValue: project.domain
            },{
                envName:"REPO_BRANCH",
                envValue: project.repository.branch
            },{
                envName:"AWS_ACCESS_KEY_ID",
                envValue: SECRETS.S3_ACCESS_KEY
            },{
                envName:"AWS_SECRET_ACCESS_KEY",
                envValue: SECRETS.S3_SECRET_KEY
            },{
                envName:"AWS_DEFAULT_REGION",
                envValue: SECRETS.S3_REGION
            },{
                envName:"GITHUB_REPO_FULLNAME",
                envValue:project.repository.githubRepoFullName
            }]
            return GrpcResponse.OK(envs, "Access token retrieved");
        } catch (e:any) {
            if(e instanceof JsonWebTokenError){
                return this._jwtErrHandler(e)
            }
            return this._errHandler(e, "GET-BUILD-CONTAINER-CREDS");
        }
    }

    async IGetProdContainerCreds(jwt:string){
        try {
            const {projectId} = await verifyJwt<{projectId:string}>(jwt)
            const project = await this._projectService.getProjectById(projectId);
            const accessToken = await this._projectService.getRepositoryAccessToken(project.repository.githubRepoId);
            const envs = [...project.environmentVars,{
                envName: "REPO_URI",
                envValue: `https://x-access-token:${accessToken}@github.com/${project.repository.githubRepoFullName}`
            },{
                envName: "PROD_COMMAND",
                envValue: project.prodCommand
            },{
                envName: "BUILD_COMMAND",
                envValue: project.buildCommand
            },{
                envName: "DOMAIN",
                envValue: project.domain
            },{
                envName: "REPO_BRANCH",
                envValue: project.repository.branch
            },{
                envName:"GITHUB_REPO_FULLNAME",
                envValue:project.repository.githubRepoFullName
            }]
            return GrpcResponse.OK(envs, "Production container credentials retrieved");
        } catch (e:any) {
            if(e instanceof JsonWebTokenError){
                return this._jwtErrHandler(e)
            }
            return this._errHandler(e, "GET-PROD-CONTAINER-CREDS"); 
        }
    }

    
}