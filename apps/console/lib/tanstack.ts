export const QUERY_KEYS = {
    projects:{
        latest:['projects'] as const,
        infinite:(limit:number)=> [...QUERY_KEYS.projects.latest, 'infinite',  limit ] as const,
        detail:(projectId:string)=> [...QUERY_KEYS.projects.latest, 'detail', projectId ] as const,
    },
    deployments:{
        latest:(projectId:string)=> ['projects', projectId, 'deployments', 'latest'] as const,
        detail:(projectId:string, deploymentId:string)=> ['projects', projectId, 'deployments', deploymentId] as const,
        infinite:(projectId:string, limit:number)=> ['projects', projectId, 'deployments', 'infinite', limit ] as const,
    },
    teams:{
        detail:(teamId:string)=> ['teams', teamId ] as const,
        infinite:(limit:number)=> ['teams', 'infinite', limit ] as const,
    },
    teamMembers:{
        infinite:(teamId:string, limit:number)=> ['teams', teamId, 'members', 'infinite', limit ] as const,
        detail:(teamId:string, userId:string)=> ['teams', teamId, 'members', userId] as const,
    },
    githubRepos:{
        infinite:(limit:number)=> ['github','repos','infinite', limit ] as const,
    },
    frameworks:{
        all: ['frameworks'] as const,
    }
}
