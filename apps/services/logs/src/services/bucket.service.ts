import { SECRETS } from "@/config";
import { _Object, DeleteObjectCommand, DeleteObjectsCommand, GetObjectCommand, ListObjectsV2Command, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { logBody } from "@/types/Logs";
import { GrpcAppError } from "@shipoff/services-commons";
import { status } from "@grpc/grpc-js";
export class BucketService {
    private _bucketClient : S3Client;

    constructor(){
        this._bucketClient = new S3Client({
            region: SECRETS.BUCKET_REGION,
            endpoint: SECRETS.BUCKET_ENDPOINT,
            credentials:{
                accessKeyId: SECRETS.BUCKET_SECRET_ACCESS_KEY_ID,     
                secretAccessKey: SECRETS.BUCKET_SECRET_ACCESS_KEY      
            },
            forcePathStyle: true
        })
    }



    async pushLogs(logs:logBody[],fileKey:string){
        const command = new PutObjectCommand({
            Bucket:SECRETS.BUCKET_NAME,
            Key:`${fileKey}-${Date.now()}.json`,
            Body:JSON.stringify(logs)
        })
        return this._bucketClient.send(command)
    }

    
    async getLogs(fileKey:string){
        try {
            const command = new GetObjectCommand({
            Bucket:SECRETS.BUCKET_NAME,
            Key:fileKey,
        })
        return this._bucketClient.send(command)
        } catch (e:any) {
            if(e.$metadata.httpStatusCode === 404) throw new GrpcAppError(status.NOT_FOUND,"No logs found for the given key")
            throw e;
        }
    }

    async getNextLogKey(prefix:string,startAfter?:string){
        const command = new ListObjectsV2Command({
            Bucket:SECRETS.BUCKET_NAME,
            MaxKeys:1,
            Prefix:prefix,
            StartAfter:startAfter
        })
        const res = await this._bucketClient.send(command)
        if(res.Contents) return res.Contents[0].Key as string
        else throw new GrpcAppError(status.NOT_FOUND,"No logs found for the given environment")
    }

    async getAllLogKeys(prefix:string,continuationToken?:string){
        const command = new ListObjectsV2Command({
              Bucket:SECRETS.BUCKET_NAME,
              Prefix:prefix,
              ContinuationToken:continuationToken
          })
          return await this._bucketClient.send(command)
    }

    async deleteLogs(fileKeys:string[]){
        const command = new DeleteObjectsCommand({
            Bucket:SECRETS.BUCKET_NAME,
            Delete:{
                Objects:fileKeys.map(key=>({Key:key})),
                Quiet:true
            }
        })
        return await this._bucketClient.send(command)
    }

}


