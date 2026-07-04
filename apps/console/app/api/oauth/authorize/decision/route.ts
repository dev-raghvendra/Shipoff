import { NEXT_AUTH_SECRETS } from "@/config/next-auth-secrets";
import { createAuthCode, normalizeLoopback } from "@/utils/auth.utils";
import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest){
    try {
        const search = req.nextUrl.searchParams
        const decision  = search.get("accept")
        const request = search.get("request")

        if(!request) return NextResponse.json({code:400,message:"Request param not found,  Invalid Request"})
            const data = await jwtVerify<{
        clientId:string,
        redirectUri:string,
        codeChallenge:string,
        codeChallengeMethod:string,
        scope:Array<string>
        state:string,
        userId:string
    }>(request,new TextEncoder().encode(NEXT_AUTH_SECRETS.NEXTAUTH_SECRET))

    const callback = new URL(decodeURIComponent(data.payload.redirectUri));
    callback.searchParams.set("state", data.payload.state);
    
    if(decision!=="true"){
      callback.searchParams.set("error","access_denied")
      return NextResponse.redirect(callback)
    } 

    const response = await createAuthCode({
        userId: data.payload.userId,
        clientId:data.payload.clientId,
        redirectUri:normalizeLoopback(decodeURIComponent(data.payload.redirectUri)),
        codeChallenge:data.payload.codeChallenge,
        codeChallengeMethod: data.payload.codeChallengeMethod,
        scopes:data.payload.scope
    });


    callback.searchParams.set(
        "code",
        response?.authorizationCode!
    );

    return NextResponse.redirect(callback);
    } catch (e:any) {
        return NextResponse.json({code:e.code,message:e.message},{status:e.code})
    }
}