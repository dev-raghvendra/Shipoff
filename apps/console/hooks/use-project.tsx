import {useInfiniteQuery,useQuery,useQueryClient} from '@tanstack/react-query';
import projectService from '@/services/projects.service';
import { useEffect } from 'react';
import { QUERY_KEYS } from '@/lib/tanstack';

export function useInfiniteProjects(limit:number = 10){
    const queryClient = useQueryClient()
    const {isSuccess, data, ...rest} = useInfiniteQuery({
        queryKey:QUERY_KEYS.projects.infinite(limit),
        queryFn:({pageParam=0})=>projectService.getAllProjects({skip:pageParam,limit}),
        getNextPageParam:(lastPage, allPages) => {
            if(lastPage.res.length < limit) return undefined
            return (allPages.length * limit)
        },
        initialPageParam:0,
    })
    
    useEffect(()=>{
        if(isSuccess && data && queryClient){
            try {
                const allProjects = data.pages.flatMap(page=>page.res)
                allProjects.forEach(project=>{
                    queryClient.setQueriesData({queryKey:QUERY_KEYS.projects.detail(project.projectId)},project)
                })
            } catch (error) {
                console.warn('Failed to set queries data for projects:', error)
            }
        }
    },[isSuccess, data, queryClient])

    return {
        isSuccess,
        data:data?.pages.flatMap(page=>page.res) || [],
        ...rest
    }
}

export function useProject({projectId}:{projectId:string}){
    const queryClient = useQueryClient()
    const {isSuccess,data,...rest} = useQuery({
        queryKey:QUERY_KEYS.projects.detail(projectId),
        queryFn:()=>projectService.getProject({projectId}),
        initialData:()=>{
            return queryClient.getQueryData(QUERY_KEYS.projects.detail(projectId))
        }
    })
    useEffect(()=>{
        if(isSuccess && data && queryClient){
            try {
                queryClient.setQueryData(QUERY_KEYS.projects.detail(projectId),data)
            } catch (error) {
                console.warn('Failed to set query data for project:', error)
            }
        }
    },[isSuccess, data, projectId, queryClient])

    return {
        isSuccess,
        data:data?.res!,
        updateProjectState:(body:Partial<Omit<typeof data,"code"|"message">>)=>{
           queryClient.setQueryData(QUERY_KEYS.projects.detail(projectId),(old:any)=>{
            console.log(old)
             return {
                ...old,
                res:{
                    ...old.res,
                    ...body
                }
             }
           })
        },
        ...rest
    }
}


export function useLatestProjects(limit:number = 10){
    const queryClient = useQueryClient()
    const {isSuccess, data, ...rest} = useQuery({
        queryKey:QUERY_KEYS.projects.latest,
        queryFn:()=>projectService.getLatestProjects({skip:0,limit})
    })
    
    useEffect(()=>{
        if(isSuccess && data && queryClient){
            try {
                data.res.forEach(project=>{
                    queryClient.setQueriesData({queryKey:QUERY_KEYS.projects.detail(project.projectId)},project)
                })
            } catch (error) {
                console.warn('Failed to set queries data for latest projects:', error)
            }
        }
    },[isSuccess, data, queryClient])

    return {
        isSuccess,
        data:data?.res || [],
        ...rest
    }
}

export function useFrameworks({fetchNow}:{fetchNow?:boolean}) {
    const {data,...rest} = useQuery({
        queryKey:QUERY_KEYS.frameworks.all,
        queryFn:()=>projectService.getFrameworks(),
        enabled:fetchNow
    })

    return {
        data:data?.res || [],
        ...rest
    }
}