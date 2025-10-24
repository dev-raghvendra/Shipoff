import { QUERY_KEYS } from "@/lib/tanstack";
import { teamsService } from "@/services/teams.service";
import { useInfiniteQuery, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

export function useLinkedTeams({projectId}:{projectId:string}) {
    const {setQueriesData} = useQueryClient()
    const {data, isSuccess, ...rest} = useQuery({
        queryKey:QUERY_KEYS.teams.detail(projectId),
        queryFn:()=>teamsService.getTeamsLinkedToProject({projectId}),
    })

    useEffect(()=>{
        if(isSuccess && data){
            data.res.forEach(team=>{
                setQueriesData({queryKey:QUERY_KEYS.teams.detail(team.teamId)},team)
            })
        }
    },[isSuccess,data])
    
    return {
        data:data?.res || [],
        isSuccess,
        ...rest
    }
}

export function useInfiniteTeams({limit}:{limit:number}) {
    const {setQueriesData} = useQueryClient()
    const {data, isSuccess, ...rest} = useInfiniteQuery({
        queryKey:QUERY_KEYS.teams.infinite(limit),
        queryFn:({pageParam=0})=>teamsService.getAllTeams({limit,skip:pageParam}),
        getNextPageParam:(lastPage, allPages) => {
            if(lastPage.res.length < limit) return undefined
            return (allPages.length * limit)
        },
        initialPageParam:0,
    })

    useEffect(()=>{
        if(isSuccess && data){
            const allTeams = data.pages.flatMap(page=>page.res)
            allTeams.forEach(team=>{
                setQueriesData({queryKey:QUERY_KEYS.teams.detail(team.teamId)},team)
            })
        }
    },[isSuccess,data])
    
    return {
        data:data?.pages.flatMap(page=>page.res) || [],
        isSuccess,
        ...rest
    }
}

export function useInfiteTeamMembers({teamId, limit}:{teamId:string, limit:number}) {
    const {data, isSuccess, ...rest} = useInfiniteQuery({
        queryKey:QUERY_KEYS.teamMembers.infinite(teamId, limit),
        queryFn:({pageParam=0})=>teamsService.getTeamMembers({teamId, limit, skip:pageParam}),
        getNextPageParam:(lastPage, allPages) => {
            if(lastPage.res.length < limit) return undefined
            return (allPages.length * limit)
        },
        initialPageParam:0,
    })

    return {
        data:data?.pages.flatMap(page=>page.res) || [],
        isSuccess,
        ...rest
    }
}