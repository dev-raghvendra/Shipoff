import { QUERY_KEYS } from "@/lib/tanstack";
import { teamsService } from "@/services/teams.service";
import { useInfiniteQuery, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

export function useLinkedTeams({projectId,enabled}:{projectId:string,enabled?:boolean}) {
    const queryClient = useQueryClient()
    const {data, isSuccess, ...rest} = useQuery({
        queryKey:QUERY_KEYS.teams.detail(projectId),
        queryFn:()=>teamsService.getTeamsLinkedToProject({projectId}),
        enabled
    })

    useEffect(()=>{
        if(isSuccess && data && queryClient){
            try {
                data.res.forEach(team=>{
                    queryClient.setQueriesData({queryKey:QUERY_KEYS.teams.detail(team.teamId)},team)
                })
            } catch (error) {
                console.warn('Failed to set queries data for linked teams:', error)
            }
        }
    },[isSuccess, data, queryClient])
    
    return {
        data:data?.res || [],
        isSuccess,
        ...rest
    }
}

export function useInfiniteTeams({limit}:{limit:number}) {
    const queryClient = useQueryClient()
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
        if(isSuccess && data && queryClient){
            try {
                const allTeams = data.pages.flatMap(page=>page.res)
                allTeams.forEach(team=>{
                    queryClient.setQueriesData({queryKey:QUERY_KEYS.teams.detail(team.teamId)},team)
                })
            } catch (error) {
                console.warn('Failed to set queries data for teams:', error)
            }
        }
    },[isSuccess, data, queryClient])


    
    return {
        data:data?.pages.flatMap(page=>page.res) || [],
        isSuccess,
        ...rest
    }
}

export function useInfiniteTeamMembers({teamId, limit, fetchNow}:{teamId:string, limit:number, fetchNow?:boolean}) {
    const queryClient = useQueryClient()
    const {data, isSuccess, ...rest} = useInfiniteQuery({
        queryKey:QUERY_KEYS.teamMembers.infinite(teamId, limit),
        queryFn:({pageParam=0})=>teamsService.getTeamMembers({teamId, limit, skip:pageParam}),
        getNextPageParam:(lastPage, allPages) => {
            if(lastPage.res.length < limit) return undefined
            return (allPages.length * limit)
        },
        initialPageParam:0,
        enabled:fetchNow
    })

    useEffect(()=>{
        if(isSuccess && data && queryClient){
            try {
                const allTeamMembers = data.pages.flatMap(page=>page.res)
                allTeamMembers.forEach(member=>{
                    queryClient.setQueriesData({queryKey:QUERY_KEYS.teamMembers.detail(teamId, member.userId)},member)
                })
            } catch (error) {
                console.warn('Failed to set queries data for team members:', error)
            }
        }
    },[isSuccess, data, queryClient, teamId])

    return {
        data:data?.pages.flatMap(page=>page.res) || [],
        isSuccess,
        ...rest
    }
}