import {useInfiniteQuery,useQuery,useQueryClient} from '@tanstack/react-query';
import projectService from '@/services/projects.service';
import { useEffect } from 'react';
import { QUERY_KEYS } from '@/lib/tanstack';

export function useInfiniteProjects(limit:number = 10){
    const {setQueriesData} = useQueryClient()
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
        if(isSuccess && data) {
            const allProjects = data.pages.flatMap(page=>page.res)
            allProjects.forEach(project=>{
                setQueriesData({queryKey:QUERY_KEYS.projects.detail(project.projectId)},project)
            })
        }
    },[isSuccess,data])

    return {
        isSuccess,
        data:data?.pages.flatMap(page=>page.res) || [],
        ...rest
    }
}

export function useProject({projectId}:{projectId:string}){
    const {setQueryData,getQueryData} = useQueryClient()
    const {isSuccess,data,...rest} = useQuery({
        queryKey:QUERY_KEYS.projects.detail(projectId),
        queryFn:()=>projectService.getProject({projectId}),
        initialData:()=>{
            return getQueryData(QUERY_KEYS.projects.detail(projectId))
        }
    })
    useEffect(()=>{
        if(isSuccess && data) {
            setQueryData(QUERY_KEYS.projects.detail(projectId),data)
        }
    },[isSuccess])

    return {
        isSuccess,
        data:data?.res!,
        ...rest
    }
}


export function useLatestProjects(limit:number = 10){
    const {setQueriesData} = useQueryClient()
    const {isSuccess, data, ...rest} = useQuery({
        queryKey:QUERY_KEYS.projects.latest,
        queryFn:()=>projectService.getLatestProjects({skip:0,limit}),
    })
    
    useEffect(()=>{
        if(isSuccess && data) {
            data.res.forEach(project=>{
                setQueriesData({queryKey:QUERY_KEYS.projects.detail(project.projectId)},project)
            })
        }
    },[isSuccess,data])

    return {
        isSuccess,
        data:data?.res || [],
        ...rest
    }
}