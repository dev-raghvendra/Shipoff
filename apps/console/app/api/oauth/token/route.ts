import { exchangeAuthCode } from "@/utils/auth.utils";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
    const body = await req.formData();

    const grantType = body.get("grant_type");
    const authorizationCode = body.get("code");
    const redirectUri = body.get("redirect_uri");
    const clientId = body.get("client_id");
    const codeVerifier = body.get("code_verifier");

    if (
        grantType !== "authorization_code" ||
        typeof authorizationCode !== "string" ||
        typeof redirectUri !== "string" ||
        typeof clientId !== "string" ||
        typeof codeVerifier !== "string"
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

    const response =
        await exchangeAuthCode({
            authorizationCode,
            clientId,
            redirectUri,
            codeVerifier
        });

    if(!response) return NextResponse.json({error:"Error while creating authorization code"})


    return NextResponse.json({
        access_token: response.accessToken,
        token_type: "Bearer"
    });
}