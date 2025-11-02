import { QUERY_KEYS } from "@/lib/tanstack"
import projectService from "@/services/projects.service"
import { useInfiniteQuery, useQuery, useQueryClient } from "@tanstack/react-query"
import { useEffect, useRef } from "react"

// Exponential backoff configuration
const BASE_INTERVAL = 5000 // 5 seconds
const MAX_INTERVAL_INFINITE = 60000 // 60 seconds for infinite deployments list
const MAX_BACKOFF_MULTIPLIER_INFINITE = 12 // Cap at 60s (2^12 * 5s would be huge, but we cap at MAX_INTERVAL)
const MAX_INTERVAL_DETAIL = 20000 // 20 seconds for single deployment detail
const MAX_BACKOFF_MULTIPLIER_DETAIL = 4 // Cap at 20s (2^4 * 5s = 20s)

// Helper to create status signature from deployments
function getStatusSignature(deployments: any[]): string {
    return deployments
        .map(d => `${d.deploymentId}:${d.status}`)
        .sort()
        .join('|')
}

// Helper to check if deployments have active statuses
function hasActiveDeployments(deployments: any[]): boolean {
    return deployments.some(d => 
        d.status !== 'FAILED' && d.status !== 'INACTIVE'
    )
}

export function useInfiniteDeployments({projectId}:{projectId:string}) {
    const LIMIT = 10
    const queryClient = useQueryClient()
    
    // Track backoff state
    const backoffRef = useRef({ multiplier: 1, lastSignature: '' })
    
    const {isSuccess, data, ...rest} = useInfiniteQuery({
        queryKey:QUERY_KEYS.deployments.infinite(projectId,LIMIT),
        queryFn:({pageParam=0})=>projectService.getAllDeployments({projectId,skip:pageParam,limit:LIMIT}),
        getNextPageParam:(lastPage, allPages) => {
            if(lastPage.res.length < LIMIT) return undefined
            return (allPages.length * LIMIT)
        },
        initialPageParam:0,
        refetchInterval: (query) => {
            const deployments = query.state.data?.pages.flatMap((page: any) => page.res) || []
            const currentSignature = getStatusSignature(deployments)
            const active = hasActiveDeployments(deployments)
            
            // If no active deployments, don't poll
            if (!active) {
                backoffRef.current.multiplier = 1
                backoffRef.current.lastSignature = currentSignature
                return false
            }
            
            // Check if status changed
            if (backoffRef.current.lastSignature !== currentSignature) {
                // Status changed, reset backoff
                backoffRef.current.multiplier = 1
                backoffRef.current.lastSignature = currentSignature
            } else {
                // Status unchanged, increase backoff (exponential, capped)
                backoffRef.current.multiplier = Math.min(
                    backoffRef.current.multiplier * 2,
                    MAX_BACKOFF_MULTIPLIER_INFINITE
                )
            }
            
            // Calculate interval with exponential backoff
            const interval = Math.min(
                BASE_INTERVAL * backoffRef.current.multiplier,
                MAX_INTERVAL_INFINITE
            )
            
            return interval
        },
        refetchIntervalInBackground: true,
    })
    
    // Listen for manual reset events (e.g., after redeploy/delete)
    useEffect(() => {
        function onReset(e: any) {
            try {
                const { projectId: pid } = e?.detail || {}
                if (pid === projectId) {
                    backoffRef.current.multiplier = 1
                    backoffRef.current.lastSignature = ''
                }
            } catch {}
        }
        window.addEventListener('reset-deploy-backoff', onReset as any)
        return () => window.removeEventListener('reset-deploy-backoff', onReset as any)
    }, [projectId])

    

    // Reset backoff when query is invalidated (e.g., after actions)
    useEffect(() => {
        const unsubscribe = queryClient.getQueryCache().subscribe((event) => {
            if (event?.type === 'updated' && 
                event.query.queryKey[0] === 'deployments' && 
                event.query.queryKey.includes('infinite') &&
                event.query.queryKey.includes(projectId)) {
                // Query was invalidated/reset, reset backoff
                backoffRef.current.multiplier = 1
            }
        })
        return unsubscribe
    }, [queryClient, projectId])
      
    useEffect(()=>{
        if(isSuccess && data && queryClient){
            try {
                const allDeployments = data.pages.flatMap(page=>page.res)
                allDeployments.forEach(deployment=>{
                    queryClient.setQueriesData({queryKey:QUERY_KEYS.deployments.detail(projectId,deployment.deploymentId)},deployment)
                })
            } catch (error) {
                console.warn('Failed to set queries data for deployments:', error)
            }
        }
    },[isSuccess, data, projectId, queryClient])

    return {
        isSuccess,
        data: data?.pages.flatMap(page=>page.res) || [],
        ...rest
    }
}

export function useDeployment({projectId,deploymentId}:{projectId:string,deploymentId:string}){
    const queryClient = useQueryClient()
    
    // Track backoff state
    const backoffRef = useRef({ multiplier: 1, lastStatus: '' })
    
    const {isSuccess,data,...rest} = useQuery({
        queryKey:QUERY_KEYS.deployments.detail(projectId,deploymentId),
        queryFn:()=>projectService.getDeployment({projectId,deploymentId}),
        initialData:()=>{
            return queryClient.getQueryData(QUERY_KEYS.deployments.detail(projectId,deploymentId))
        },
        refetchInterval: (query) => {
            const deployment = query.state.data as any
            const currentStatus = deployment?.res?.status || ''
            const isActive = currentStatus && 
                currentStatus !== 'FAILED' && 
                currentStatus !== 'INACTIVE'
            
            // If not active, don't poll
            if (!isActive) {
                backoffRef.current.multiplier = 1
                backoffRef.current.lastStatus = currentStatus
                return false
            }
            
            // Check if status changed
            if (backoffRef.current.lastStatus !== currentStatus) {
                // Status changed, reset backoff
                backoffRef.current.multiplier = 1
                backoffRef.current.lastStatus = currentStatus
            } else {
                // Status unchanged, increase backoff (exponential, capped)
                backoffRef.current.multiplier = Math.min(
                    backoffRef.current.multiplier * 2,
                    MAX_BACKOFF_MULTIPLIER_DETAIL
                )
            }
            
            // Calculate interval with exponential backoff
            const interval = Math.min(
                BASE_INTERVAL * backoffRef.current.multiplier,
                MAX_INTERVAL_DETAIL
            )
            
            return interval
        },
        refetchIntervalInBackground: true,
    })
    
    // Reset backoff que when query is invalidated (e.g., after actions)
    useEffect(() => {
        const unsubscribe = queryClient.getQueryCache().subscribe((event) => {
            if (event?.type === 'updated' && 
                event.query.queryKey[0] === 'deployments' && 
                event.query.queryKey.includes('detail') &&
                event.query.queryKey.includes(projectId) &&
                event.query.queryKey.includes(deploymentId)) {
                // Query was invalidated/reset, reset backoff
                backoffRef.current.multiplier = 1
            }
        })
        return unsubscribe
    }, [queryClient, projectId, deploymentId])
    useEffect(()=>{
        if(isSuccess && data && queryClient){
            try {
                queryClient.setQueryData(QUERY_KEYS.deployments.detail(projectId,deploymentId),data)
            } catch (error) {
                console.warn('Failed to set query data for deployment:', error)
            }
        }
    },[isSuccess, data, projectId, deploymentId, queryClient])

    return {
        isSuccess,
        data:data?.res!,
        ...rest
    }
}

export function useLatestDeployments(limit:number = 10) {
    const queryClient = useQueryClient()
    const {isSuccess, data, ...rest} = useQuery({
        queryKey:QUERY_KEYS.deployments.latest("all"),
        queryFn:()=>projectService.getLatestDeployments({skip:0,limit})
    })
    
    useEffect(()=>{
        if(isSuccess && data && queryClient){
            try {
                const allDeployments = data.res
                allDeployments.forEach(deployment=>{
                    queryClient.setQueriesData({queryKey:QUERY_KEYS.deployments.detail(deployment.projectId,deployment.deploymentId)},deployment)
                })
            } catch (error) {
                console.warn('Failed to set queries data for latest deployments:', error)
            }
        }
    },[isSuccess, data, queryClient])

    return {
        isSuccess,
        data:data?.res || [],
        ...rest
    }
}