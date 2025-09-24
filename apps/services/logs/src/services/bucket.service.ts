import { SECRETS } from "@/config";
import { _Object, GetObjectCommand, ListObjectsV2Command, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { logBody } from "@/types/Logs";
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
        const command = new GetObjectCommand({
            Bucket:SECRETS.BUCKET_NAME,
            Key:fileKey,
        })
        return this._bucketClient.send(command)
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
        return null
    }

}


// new BucketService().getFile('test670fc34f49b8b7b272bd929a_AD_4nXdUoPz1oo8QaOY7vTmoGQBUun9zg0tNrrromF7VMnrTLcwk3meeL00DEaE2C6DwVkzUB3esjEFIpLlR1Hj4zG6L4Rgco4HJFAbmPcEx8uCzYUt2JNKrp1zmWu4SdJIQ6H4wmx2vWAuoPSpKn2LwzC4e1165.gif').then(res=>console.log(res.$metadata.)).catch(err=>console.log(err))