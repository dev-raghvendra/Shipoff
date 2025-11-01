import { authService } from "@/services/auth.service"
import { createErrHandler } from "@/utils/error.utils"
import { signOut, useSession as useNextSession } from "next-auth/react"
import { useEffect, useRef, useState } from "react"
import { toast } from "sonner"

export function useSession(){
    const [status,setStatus] = useState<"loading" | "authenticated" | "unauthenticated">("loading")
    const [error,setError] = useState<string | null>(null)
    const {data,status:nextStatus,update,...rest} = useNextSession({
        required:true,
        onUnauthenticated() {
            window.location.href = "/signin"
        },
    })
    const statusesToReturn = ["loading","unauthenticated"]
    const errHandler = createErrHandler({serviceName:"SESSION"})
    const hasUserFetched = useRef(false)
    const isFetching = useRef(false)

    const getUser = async()=>{
        try {   
            if(isFetching.current) return
            isFetching.current = true
            const res = await authService.getMe()
            const hasChanged = JSON.stringify(res.res) !== JSON.stringify(data?.user)
            if(hasChanged) await update({...data,user:res.res})
            setStatus("authenticated")
        } catch (e:any) {
            if(e.code===401) return window.location.href = "/signin"
            if(e.code===404) return await signOut({callbackUrl:"/login"})
            errHandler(e,"GET_USER",false,false)
            setStatus("unauthenticated")
            setError(e.message || "An unexpected error occurred. Please try again.")
        } finally {
            hasUserFetched.current = true
            isFetching.current = false
        }
    }
    
    useEffect(()=>{
        if(statusesToReturn.includes(nextStatus)) return setStatus(nextStatus)
        if(!hasUserFetched.current) getUser()
    },[nextStatus])
    
    useEffect(()=>{
        if(error) {
            toast.error(error)
        }
    },[error])

    return {
        data,
        status,
        update,
        ...rest
    }
}
