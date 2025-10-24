export const MAIN_BACKEND_API = {
    AUTH_API:String(process.env.NEXT_PUBLIC_AUTH_API_URL),
    PROJECTS_API:String(process.env.NEXT_PUBLIC_PROJECTS_API_URL),
    LOGS_API:String(process.env.NEXT_PUBLIC_LOGS_API_URL),
    GITHUB_API:String(process.env.NEXT_PUBLIC_GITHUB_API_URL),
    WS_API:String(process.env.NEXT_PUBLIC_WS_API_URL)
} as const

export const AUTH_API_ROUTES = {
    LOGIN:()=>`/login`,
    SIGNIN:()=>`/signin`,
    OAUTH:()=>`/oauth`,
    ME:()=>`/me`,
    REFRESH:()=>`/refresh`,
    GET_TEAMS:({skip,limit}:{skip:number,limit:number})=>`/teams?skip=${skip}&limit=${limit}`,
    GET_TEAMS_LINKED_TO_PROJECT:({projectId}:{projectId:string})=>`/teams/projects/link/${projectId}`,
    GET_TEAM:({teamId}:{teamId:string})=>`/teams/${teamId}`,
    CREATE_TEAM:()=>`/teams`,
    DELETE_TEAM:({teamId}:{teamId:string})=>`/teams/${teamId}`,
    CREATE_TEAM_MEMBER_INVITE:({teamId}:{teamId:string})=>`/teams/${teamId}/invitations`,
    ACCEPT_TEAM_MEMBER_INVITE:({inviteId}:{inviteId:string})=>`/teams/invitations/${inviteId}/accept`,
    TRANSFER_TEAM_OWNERSHIP:({newOwnerId: newOwnerId,teamId}:{newOwnerId:string,teamId:string})=>`/teams/${teamId}/owner/${newOwnerId}`,
    GET_TEAM_MEMBER:({teamId,userId}:{teamId:string,userId:string})=>`/teams/${teamId}/members/${userId}`,
    DELETE_TEAM_MEMBER:({teamId,targetUserId}:{teamId:string,targetUserId:string})=>`/teams/${teamId}/members/${targetUserId}`,
    CREATE_PROJECT_MEMBER_INVITE:({projectId}:{projectId:string})=>`/projects/${projectId}/invitations`,
    ACCEPT_PROJECT_MEMBER_INVITE:({inviteId,projectId}:{inviteId:string,projectId:string})=>`/projects/${projectId}/invitations/${inviteId}/accept`,
    GET_PROJECT_MEMBER:({projectId,userId}:{projectId:string,userId:string})=>`/projects/${projectId}/members/${userId}`,
    DELETE_PROJECT_MEMBER:({projectId,userId}:{projectId:string,userId:string})=>`/projects/${projectId}/members/${userId}`,
} as const


export const PROJECTS_API_ROUTES = {
    CREATE_PROJECT:()=>`/`,
    GET_LATEST_PROJECTS:({skip,limit}:{skip?:number,limit:number})=>`/latest?limit=${limit}&skip=${skip||0}`,
    GET_PROJECTS:({skip,limit}:{skip:number,limit:number})=>`/?skip=${skip}&limit=${limit}`,
    GET_PROJECT:({projectId}:{projectId:string})=>`${projectId}`,
    DELETE_PROJECT:({projectId}:{projectId:string})=>`${projectId}`,
    UPDATE_PROJECT:({projectId}:{projectId:string})=>`${projectId}`,
    GET_FRAMEWORKS:()=>`/frameworks`,
    GET_DEPLOYMENTS:({projectId,limit,skip}:{projectId:string,limit:number,skip:number})=>`${projectId}/deployments?limit=${limit}&skip=${skip}`,
    GET_LATEST_DEPLOYMENTS:({limit,skip}:{limit:number,skip?:number})=>`/all/deployments/latest?limit=${limit}&skip=${skip||0}`,
    GET_DEPLOYMENT:({projectId, deploymentId}:{projectId:string,deploymentId:string})=>`/${projectId}/deployments/${deploymentId}`,
    DELETE_DEPLOYMENT:({projectId, deploymentId}:{projectId:string,deploymentId:string})=>`/${projectId}/deployments/${deploymentId}`,
    REDEPLOY_DEPLOYMENT:({projectId, deploymentId}:{projectId:string,deploymentId:string})=>`/${projectId}/deployments/${deploymentId}/redeploy`,
    GET_ENV_VARS:({projectId}:{projectId:string})=>`/${projectId}/env-vars`,
    UPSERT_ENV_VAR:({projectId}:{projectId:string})=>`/${projectId}/env-vars`,
    DELETE_ENV_VAR:({projectId,envVarKey}:{projectId:string,envVarKey:string})=>`/${projectId}/env-vars/${envVarKey}`,
    GET_REPO:({projectId}:{projectId:string})=>`/${projectId}/repository`,
    CREATE_REPO:({projectId}:{projectId:string})=>`/${projectId}/repository`,
    DELETE_REPO:({projectId}:{projectId:string})=>`/${projectId}/repository`
} as const


export const LOGS_API_ROUTES = {
    GET_LOGS:({projectId,envId}:{projectId:string,envId:string})=>`/${projectId}/${envId}`,
    STREAM_LOGS:({envId,projectId}:{envId:string,projectId:string})=>`/logs/stream?projectId=${projectId}&envId=${envId}`,
} as const

export const GITHUB_API_ROUTES = {
    GET_USER_GITHUB_INSTALLATION:()=>`/installation`,
    GET_USER_REPOS:()=>`/repos`,
    GET_REPO_DETAILS:({repoId}:{repoId:string})=>`/repos/${repoId}`,
} as const