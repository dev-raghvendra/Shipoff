import { QUERY_KEYS } from "@/lib/tanstack";
import { githubService } from "@/services/github.service";
import { useInfiniteQuery } from "@tanstack/react-query";

export function useGithubRepos({enabled}:{enabled?:boolean}) {
    const {data,...rest} = useInfiniteQuery({
        queryKey:QUERY_KEYS.githubRepos.infinite(5),
        queryFn:({pageParam=0})=>githubService.getUserRepositories({skip:pageParam, limit:5}),
        getNextPageParam:(lastPage, allPages) => {
            if(lastPage.res.length < 5) return undefined
            return (allPages.length * 5)
        },
        initialPageParam:0,
        enabled:enabled,
    })
    return {data: data?.pages.flatMap(page => page.res)|| [],...rest}
}