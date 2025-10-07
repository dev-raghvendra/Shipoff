import { AxiosError } from "axios";
import { ErrResponse } from "@/types/response";


export function createErrHandler({serviceName}:{serviceName:string}){
    return (error:any)=>{
        console.error("AN_ERROR_OCCURRED_IN_"+serviceName.toUpperCase(),error)
        if(error instanceof AxiosError){
            return error.response?.data as ErrResponse
        }
        else return {code:500,message:`${serviceName} Service Error`,res:null}
    }
}