import { responseCache } from "@/libs/node-cache"

export async function withIdempotency<T>(
    key : string,
    userId:string,
    fn:()=>Promise<T>
):Promise<{result:T,cached:boolean}>{
     if(!key) return {result:await fn(),cached:false}
     const cacheKey = `mcp:idempotency:${userId}:${key}`
     const cachedRes = responseCache.get(cacheKey)
     if(cachedRes) return {result:JSON.parse(cachedRes),cached:true}
     const res = await fn()
     responseCache.set(cacheKey,res)
     return {cached:false,result:res}
}

export const formatUptime = (seconds: number) => {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  return [
    days && `${days}d`,
    hours && `${hours}h`,
    minutes && `${minutes}m`,
    `${secs}s`,
  ]
    .filter(Boolean)
    .join(" ");
};
