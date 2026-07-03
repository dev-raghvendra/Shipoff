import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createAuthCode } from "@/utils/auth.utils";
import { SignJWT } from "jose";
import { NEXT_AUTH_SECRETS } from "@/config/next-auth-secrets";

export async function GET(req: NextRequest) {
    try {
        const search = req.nextUrl.searchParams;

    const clientId = search.get("client_id");
    const redirectUri = search.get("redirect_uri");
    const responseType = search.get("response_type");
    const state = search.get("state");
    const codeChallenge = search.get("code_challenge");
    const codeChallengeMethod = search.get("code_challenge_method");
    const scope = search.get("scope")

    if (
        !clientId ||
        !redirectUri ||
        responseType !== "code" ||
        !state ||
        !codeChallenge ||
        codeChallengeMethod !== "S256"
    ) {
        return NextResponse.json(
            {
               code:400,
               message:"Invalid Request"
            },
            {
                status: 400
            }
        );
    }

    const session = await getServerSession(authOptions);
    console.log("REDIRECT_URI",redirectUri)

    if (!session) {
        const signin = new URL("/signin", req.url);
        signin.searchParams.set("callbackUrl", req.url);

        return NextResponse.redirect(signin);
    }

    const now = Math.floor(Date.now()/1000)
    const request = await new SignJWT({type:"consent",clientId,redirectUri,codeChallenge,codeChallengeMethod,scope,state,userId:session.user.userId})
    .setProtectedHeader({alg:"HS256"})
    .setIssuedAt(now)
    .setExpirationTime( now + 60*10)
    .sign(new TextEncoder().encode(NEXT_AUTH_SECRETS.NEXTAUTH_SECRET))
    const callback = new URL(`/dashboard/account/oauth/consent?request=${request}`,req.url)
    return NextResponse.redirect(callback)

    // const response = await createAuthCode({
    //     userId: session.user.userId,
    //     clientId,
    //     redirectUri,
    //     codeChallenge,
    //     codeChallengeMethod: "S256",
    //     scopes:[scope ?? "*"]
    // });

    // const callback = new URL(redirectUri);

    // callback.searchParams.set(
    //     "code",
    //     response?.authorizationCode!
    // );

    // callback.searchParams.set("state", state);

    // return NextResponse.redirect(callback);
    } catch (e:any) {
        return NextResponse.json({
            code:e.code,
            message:e.message
        },{status:e.code})
    }
}