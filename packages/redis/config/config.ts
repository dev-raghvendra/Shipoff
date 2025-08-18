import { configDotenv } from "dotenv";
import path from "path";
import { cwd } from "process";

configDotenv({path:path.join(cwd(),"../../../packages/redis",".env")});
export const TOPICS  = Object.freeze({
    DEPLOYMENT_TOPIC:"deployment:topic",
    CONTAINER_TOPIC:"container:topic",
    USER_TOPIC:"user:topic",
    PROJECT_TOPIC:"project:topic"
}) 

export const CONTAINER_TOPIC_CONSUMER_GROUPS = Object.freeze({
    PROJECT_SERVICE:"project-service-group"
})

export const DEPLOYMENT_TOPIC_CONSUMER_GROUPS = Object.freeze({
    ORCHESTRATOR_SERVICE:"orchestrator-service-group",
})

export const USER_TOPIC_CONSUMER_GROUPS = Object.freeze({
    USER_SERVICE:"user-service-group",
})

export const PROJECT_TOPIC_CONSUMER_GROUPS = Object.freeze({
    AUTH_SERVICE:"auth-service-group"
})

export const SECRETS = Object.freeze({
    REDIS_HOST: String(process.env.REDIS_HOST),
    REDIS_PORT: Number(process.env.REDIS_PORT),
    REDIS_PASSWORD: String(process.env.REDIS_PASSWORD),
})

