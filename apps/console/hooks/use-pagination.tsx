// import { Response } from "@/types/response"
// import { useCallback, useEffect, useState } from "react"

// const SAFE_STATUS = [200,201,204]

// export async function useFetch<T extends Response<any>,K extends any[]>({
//     fn,
//     params,
//     deps,
//     pagination
// }:{
//     fn:(...params:K)=>Promise<T>,
//     params:K
//     deps:any[],
//     pagination?:boolean
// }){
//    const [data,setData] = useState<null|T>(null)
//    const [err,setErr] = useState<null|{message:string}>(null)
//    const [fetching,setFetching] = useState(false)

//    const fetchData = useCallback(async(params:K)=>{
//     const res  = await fn(...params)
//         if(!SAFE_STATUS.includes(res.code)) setErr({
//             message:res.message
//         })
//         setData(pagination ? (prevData)=>Array.isArray(prevData?.res) )
//    },[...deps])

//    useEffect(()=>{
//      if(fetching && pagination) return;
//      setFetching(true)
//      fetchData(params).finally(()=>setFetching(false))
//    },[...deps])

//    return {
//     err,
//     result,
//     fetching
//    }
// }