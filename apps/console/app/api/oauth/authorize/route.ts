import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createAuthCode } from "@/utils/auth.utils";

export async function GET(req: NextRequest) {
    const search = req.nextUrl.searchParams;

    const clientId = search.get("client_id");
    const redirectUri = search.get("redirect_uri");
    const responseType = search.get("response_type");
    const state = search.get("state");
    const codeChallenge = search.get("code_challenge");
    const codeChallengeMethod = search.get("code_challenge_method");

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
                error: "invalid_request"
            },
            {
                status: 400
            }
        );
    }

    const session = await getServerSession(authOptions);

    if (!session) {
        const signin = new URL("/signin", req.url);
        signin.searchParams.set("callbackUrl", req.url);

        return NextResponse.redirect(signin);
    }

    const response = await createAuthCode({
        userId: session.user.userId,
        clientId,
        redirectUri,
        codeChallenge,
        codeChallengeMethod: "S256",
        scopes:["*"]
    });

    if(!response) return NextResponse.json({error:"Error while creating authorization code"})
    const callback = new URL(redirectUri);

    callback.searchParams.set(
        "code",
        response.authorizationCode
    );

    callback.searchParams.set("state", state);

    return NextResponse.redirect(callback);
}