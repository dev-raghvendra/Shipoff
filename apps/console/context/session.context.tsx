// contexts/SessionContext.tsx
import { createContext, useContext, ReactNode } from 'react'
import { useSession as useNextSession } from "next-auth/react"
import { authService } from "@/services/auth.service"
import { createErrHandler } from "@/utils/error.utils"
import { useEffect, useRef, useState, useCallback } from "react"

// Use the exact return type from useNextSession
type SessionContextType = ReturnType<typeof useNextSession>

const SessionContext = createContext<SessionContextType | null>(null)

export function SessionProvider({ children }: { children: ReactNode }) {
    const [status, setStatus] = useState<"loading" | "authenticated" | "unauthenticated">("loading")
    const sessionData = useNextSession({
        required: false, 
    })
    
    const { data, status: nextStatus, update } = sessionData
    
    const errHandler = createErrHandler({ serviceName: "SESSION" })
    const hasUserFetched = useRef(false)
    const isFetching = useRef(false)

    const getUser = useCallback(async () => {
        if (isFetching.current) return
        isFetching.current = true

        try {
            const res = await authService.getMe()
            const hasChanged = JSON.stringify(res.res) !== JSON.stringify(data?.user)
            if (hasChanged) {
                await update({ ...data, user: res.res })
            }
            setStatus("authenticated")
            hasUserFetched.current = true
        } catch (e: any) {
            errHandler(e, "GET_USER", false, false)
            setStatus("unauthenticated")
        } finally {
            isFetching.current = false
        }
    }, [data, update, errHandler])
    
    useEffect(() => {
        if (nextStatus === "loading" || nextStatus === "unauthenticated") {
            setStatus(nextStatus)
            hasUserFetched.current = false
            return
        }

        if (nextStatus === "authenticated" && !hasUserFetched.current) {
            getUser()
        }
    }, [nextStatus, getUser])

    return (
        <SessionContext.Provider value={{...sessionData,status:status as any}}>
            {children}
        </SessionContext.Provider>
    )
}

export function useSession() {
    const context = useContext(SessionContext)
    if (!context) {
        throw new Error('useSession must be used within SessionProvider')
    }
    return context
}