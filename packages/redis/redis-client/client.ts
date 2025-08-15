import Redis from "ioredis";
import { SECRETS } from "../config/config";
let RedisClientInstance : Redis | null = null;

export const GetRedisClient = () => {
    if(!RedisClientInstance){
        RedisClientInstance = new Redis({
            host:SECRETS.REDIS_HOST,
            port:SECRETS.REDIS_PORT,
            password:SECRETS.REDIS_PASSWORD
        });
    }
    return RedisClientInstance;
}

