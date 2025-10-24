import { QUERY_KEYS } from "@/lib/tanstack"
import projectService from "@/services/projects.service"
import { useInfiniteQuery, useQuery, useQueryClient } from "@tanstack/react-query"
import { useEffect } from "react"

export function useInfiniteDeployments({projectId}:{projectId:string}){
    const LIMIT = 10
    const {setQueriesData} = useQueryClient()
    const {isSuccess, data, ...rest} = useInfiniteQuery({
        queryKey:QUERY_KEYS.deployments.infinite(projectId,LIMIT),
        queryFn:({pageParam=0})=>projectService.getAllDeployments({projectId,skip:pageParam,limit:LIMIT}),
        getNextPageParam:(lastPage, allPages) => {
            if(lastPage.res.length < LIMIT) return undefined
            return (allPages.length * LIMIT)
        },
        initialPageParam:0,
    })
    
    useEffect(()=>{
        if(isSuccess && data) {
            const allDeployments = data.pages.flatMap(page=>page.res)
            allDeployments.forEach(deployment=>{
                setQueriesData({queryKey:QUERY_KEYS.deployments.detail(projectId,deployment.deploymentId)},deployment)
            })
        }
    },[isSuccess])

    return {
        isSuccess,
        data: data?.pages.flatMap(page=>page.res) || [],
        ...rest
    }
}

export function useDeployment({projectId,deploymentId}:{projectId:string,deploymentId:string}){
    const {setQueryData,getQueryData} = useQueryClient()
    const {isSuccess,data,...rest} = useQuery({
        queryKey:QUERY_KEYS.deployments.detail(projectId,deploymentId),
        queryFn:()=>projectService.getDeployment({projectId,deploymentId}),
        initialData:()=>{
            return getQueryData(QUERY_KEYS.deployments.detail(projectId,deploymentId))
        }
    })
    useEffect(()=>{
        if(isSuccess && data) {
            setQueryData(QUERY_KEYS.deployments.detail(projectId,deploymentId),data)
        }
    },[isSuccess])

    return {
        isSuccess,
        data:data?.res!,
        ...rest
    }
}

export function useLatestDeployments(limit:number = 10){
    const {setQueriesData} = useQueryClient()
    const {isSuccess, data, ...rest} = useQuery({
        queryKey:QUERY_KEYS.deployments.latest("all"),
        queryFn:()=>projectService.getLatestDeployments({skip:0,limit}),
    })
    
    useEffect(()=>{
        if(isSuccess && data) {
            const allDeployments = data.res
            allDeployments.forEach(deployment=>{
                setQueriesData({queryKey:QUERY_KEYS.deployments.detail(deployment.projectId,deployment.deploymentId)},deployment)
            })
        }
    },[isSuccess,data])

    return {
        isSuccess,
        data:data?.res || [],
        ...rest
    }
}