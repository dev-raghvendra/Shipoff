import { NEXT_AUTH_SECRETS } from "@/config/next-auth-secrets";
import { createAuthCode } from "@/utils/auth.utils";
import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest){
    try {
        const search = req.nextUrl.searchParams
        const decision  = search.get("accept")
        const request = search.get("request")

        if(decision!=="true") return NextResponse.redirect("/dashboard")
        else if(!request) return NextResponse.json({code:400,message:"Request param not found,  Invalid Request"})
        const data = await jwtVerify<{
        clientId:string,
        redirectUri:string,
        codeChallenge:string,
        codeChallengeMethod:string,
        scope:Array<string>
        state:string,
        userId:string
    }>(request,new TextEncoder().encode(NEXT_AUTH_SECRETS.NEXTAUTH_SECRET))
    const response = await createAuthCode({
        userId: data.payload.userId,
        clientId:data.payload.clientId,
        redirectUri:data.payload.redirectUri,
        codeChallenge:data.payload.codeChallenge,
        codeChallengeMethod: data.payload.codeChallengeMethod,
        scopes:data.payload.scope
    });

    const callback = new URL(data.payload.redirectUri);

    callback.searchParams.set(
        "code",
        response?.authorizationCode!
    );

    callback.searchParams.set("state", data.payload.state);
    return NextResponse.redirect(callback);
    } catch (e:any) {
        return NextResponse.json({code:e.code,message:e.message},{status:e.code})
    }
}