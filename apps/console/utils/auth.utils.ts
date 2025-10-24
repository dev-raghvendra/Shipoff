import { NEXT_AUTH_SECRETS } from "@/config/next-auth-secrets"
import { AUTH_API_ROUTES, MAIN_BACKEND_API } from "@/config/service-route-config"
import { Response } from "@/types/response"
import axios from "axios"
import { decode } from "jsonwebtoken"
import { createErrHandler } from "./error.utils"
import { User } from "next-auth"
import { SubscriptionType } from "@shipoff/types"

export interface UserData {
    userId: string,
    fullname: string,
    email: string,
    emailVerified: boolean,
    avatarUri: string,
    provider: "GOOGLE" | "GITHUB" | "EMAIL",
    preferredTheme: "dark" | "light" | "system",
    subscriptions: SubscriptionType[],
}

export type ParamsType = {
    provider: "EMAIL",
    data: {
        email: string,
        password: string,
        isSignup: boolean,
    }
} | {
    provider: "GOOGLE" | "GITHUB",
    data: {
        email: string,
        fullname: string,
        avatarUri: string,
    }
}

const errHandler  = createErrHandler({serviceName:"Auth"})

interface BackendAuthResponse extends Response<{ accessToken: string; refreshToken: string }> { }

export interface DecodedToken {
    authUserData: UserData;
}


export async function syncWithBackend({ provider, data }: ParamsType) {
    const route = provider === "EMAIL"
        ? data.isSignup ? AUTH_API_ROUTES.SIGNIN() : AUTH_API_ROUTES.LOGIN()
        : AUTH_API_ROUTES.OAUTH()

    const body = provider === "EMAIL" ? {
        email: data.email,
        password: data.password,
        ...(data.isSignup ? {
            provider: "EMAIL",
            avatarUri: "https://example.com",
            fullName: data.email.split("@")[0] || data.email
        } : {})
    } : {
        email: data.email,
        provider: provider,
        avatarUri: data.avatarUri,
        fullName: data.fullname,
        password: `${data.email}${provider}SECRET-${Date.now()}`
    }

    const res = await axios.post<BackendAuthResponse>(`${MAIN_BACKEND_API.AUTH_API}${route}`, body, {
        headers: {
            "X-Api-Key": NEXT_AUTH_SECRETS.MAIN_BACKEND_API_KEY
        }
    })
    if (!res.data.res.accessToken || !res.data.res.refreshToken) return null;

    const user = decode(res.data.res.accessToken) as DecodedToken;
    if (!user?.authUserData) return null;
    return user.authUserData.avatarUri ? {user:user.authUserData,accessToken:res.data.res.accessToken,refreshToken:res.data.res.refreshToken} : null;
}


export async function refreshAccessToken(token: string) {
    try {
        const res = await axios.get<BackendAuthResponse>(
            `${MAIN_BACKEND_API.AUTH_API}${AUTH_API_ROUTES.REFRESH()}`,
            {
                headers: {
                    "Authorization": `Bearer ${token}` 
                }
            }
        );
        return res.data.res;
    } catch (e: any) {
        errHandler(e,"REFRESH_ACCESS_TOKEN",false);
        return null;
    }
}


export function returnErrorFromOAuth({name}:{name:string}):User{
    return {
        id:"115793986297043625405",
        userId:"115793986297043625405",
        fullname:"name",
        email:"email@example.com",
        emailVerified:true,
        avatarUri:"https://example.com",
        provider:"GOOGLE",
        accessToken:"accessToken",
        refreshToken:"refreshToken",
        refreshTokenExpiresAt:0,
        preferredTheme:"system",
        subscriptions:[],
        error:name
    }
}

