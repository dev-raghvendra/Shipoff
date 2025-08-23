import { Database } from "@/db/db-service";
import { createGrpcErrorHandler, GrpcResponse } from "@shipoff/services-commons";

export class ContainerService {
    private _dbService: Database;
    private _errHandler : ReturnType<typeof createGrpcErrorHandler>
    constructor(){
        this._dbService = new Database();
        this._errHandler = createGrpcErrorHandler({serviceName:"CONTAINER_SERVICE"});
    }

    async getContainerByDomain(domain:string){
        try {
            const container = await this._dbService.findContainer({
                domain
            })
            return GrpcResponse.OK(container, "Container found");
        } catch (e:any) {
            return this._errHandler(e, "GET-CONTAINER")
        }
    }
}