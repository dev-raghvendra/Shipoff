import { IPutLogRequestBodyType } from "@/types/Logs";

export class LogsService {
    async IPutLog(body:IPutLogRequestBodyType){
       console.log("Log Received:",body)
         return {code:0,message:"Log Stored"}
    }    
}