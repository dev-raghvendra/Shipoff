import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import { decode } from "jsonwebtoken";
import { AxiosError, isAxiosError } from "axios";
import { DecodedToken, refreshAccessToken, returnErrorFromOAuth, syncWithBackend } from "@/utils/auth.utils";
import { NEXT_AUTH_SECRETS } from "@/config/next-auth-secrets";
import { createErrHandler } from "@/utils/error.utils";





const errHandler = createErrHandler({serviceName:"Auth"})

const statusMessages = {
    409 :"User already exists with this email. Please login instead.",
    401 :"Invalid email or password. Please try again.",
    400 :"Bad request. Please check the provided data.",
    500 :"Server error. Please try again later."
}

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "yourname@example.com" },
                password: { label: "Password", type: "password" },
                isSignup: { label: "isSignup", type: "text" }
            },
            authorize: async (credentials) => {
                if (!credentials?.email || !credentials?.password) return null;
                try {
                    const res = await syncWithBackend({
                        provider:"EMAIL",
                        data:{
                            email:credentials.email,
                            password:credentials.password,
                            isSignup:credentials.isSignup === "true"
                        }
                    })
                    if (!res) throw new Error("Internal Error"+res)
                    const {user,accessToken,refreshToken} = res;
                    return {
                        id: user.userId,
                        ...user,
                        accessToken,
                        refreshToken,
                        refreshTokenExpiresAt: Math.floor(Date.now() / 1000) + 6 * 24 * 60 * 60,
                        accessTokenExpiresAt: Math.floor(Date.now() / 1000) + 24 * 60 * 60
                    };
                } catch (e: any) {
                    errHandler(e,"AUTHORIZE_CALLBACK",false);
                    if(isAxiosError(e)){
                       if(Object.keys(statusMessages).includes(String(e.response?.status))) throw new Error(statusMessages[e.response?.status as keyof typeof statusMessages]);
                    }
                    throw new Error("An unexpected error occurred. Please try again.")
                }
            }
        }),
        Google({
            clientId:NEXT_AUTH_SECRETS.GOOGLE_CLIENT_ID,
            clientSecret:NEXT_AUTH_SECRETS.GOOGLE_CLIENT_SECRET,
            profile:async(profile)=>{
                try {
                    const res = await syncWithBackend({
                        provider:"GOOGLE",
                        data:{
                            email:profile.email,
                            fullName:profile.name,
                            avatarUri:profile.picture
                        }
                    })
                    if(!res) return returnErrorFromOAuth ({name:"InternalError"})
                    const {user,accessToken,refreshToken} = res;
                    return {
                        id: user.userId,
                        ...user,
                        accessToken,
                        refreshToken,
                        refreshTokenExpiresAt: Math.floor(Date.now() / 1000) + 6 * 24 * 60 * 60,
                        accessTokenExpiresAt: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
                        error:undefined
                    };
                } catch (e:any) {
                    errHandler(e,"GOOGLE_OAUTH_CALLBACK",false,false);
                    return returnErrorFromOAuth ({name:"InternalError"});
                }
            }
        }),
        GitHub({
            clientId:NEXT_AUTH_SECRETS.GITHUB_CLIENT_ID,
            clientSecret:NEXT_AUTH_SECRETS.GITHUB_CLIENT_SECRET,
            profile:async(profile)=>{
                 try {
                    const res = await syncWithBackend({
                        provider:"GITHUB",
                        data:{
                            email:profile.email,
                            fullName:profile.name,
                            avatarUri:profile.avatar_url
                        }
                    })
                    if(!res) return returnErrorFromOAuth ({name:"InternalError"})
                    const {user,accessToken,refreshToken} = res;
                    return {
                        id: user.userId,
                        ...user,
                        accessToken,
                        refreshToken,
                        refreshTokenExpiresAt: Math.floor(Date.now() / 1000) + 6 * 24 * 60 * 60,
                        accessTokenExpiresAt: Math.floor(Date.now() / 1000) + 24 * 60 * 60
                    };
                } catch (e:any) {
                    return returnErrorFromOAuth ({name:"InternalError"});
                }
            }
        })
    ],
    callbacks: {
        signIn:async({account,user})=>{
             if(account?.provider === "google" || account?.provider === "github") {
                 if(user.error) return `/signin?error=${user.error}`;
             }
             return true;
        },

        jwt: async ({ token, user, account, trigger, session }) => {
            if (account && user) {
                return {
                    ...token,
                    accessToken: user.accessToken,
                    refreshToken: user.refreshToken,
                    refreshTokenExpiresAt: user.refreshTokenExpiresAt,
                    user
                };
            }

            if (trigger === "update" && session) {
                return { ...token, ...session };
            }

            const now = Math.floor(Date.now() / 1000);
            const bufferTime = 5 * 60; 
            
            // If access token is still valid, return it
            if (now < (token.accessTokenExpiresAt - bufferTime)) return token;
            
            // If refresh token has expired, return error
            if (now >= (token.refreshTokenExpiresAt - bufferTime)) {
                return {
                    ...token, 
                    error: "RefreshTokenExpired"
                };
            }

            // Access token expired but refresh token valid - refresh the token
            const newTokens = await refreshAccessToken(token.refreshToken);

            if (!newTokens) {
                return {
                    ...token,
                    error: "RefreshAccessTokenError"
                };
            }

            const decodedUser = decode(newTokens.accessToken) as DecodedToken;
            return {
                ...token,
                accessToken: newTokens.accessToken,
                refreshToken: newTokens.refreshToken,
                refreshTokenExpiresAt: Math.floor(Date.now() / 1000) + 6 * 24 * 60 * 60,
                user: decodedUser.authUserData,
                accessTokenExpiresAt: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
                error: undefined
            };
        },
        session: async ({ session, token }) => {
            session.accessToken = token.accessToken;
            session.user = token.user;
            session.error = token.error;
            return session;
        }
    },
    pages: {
        signIn: "/signin",
        error:"/signin"
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60
    },
    secret: NEXT_AUTH_SECRETS.NEXTAUTH_SECRET,
};




