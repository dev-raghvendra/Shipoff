import { exchangeAuthCode, normalizeLoopback } from "@/utils/auth.utils";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
  try {
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
                code:400,
                message:"Invalid request"
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
            redirectUri:normalizeLoopback(redirectUri),
            codeVerifier
        });

    
    return NextResponse.json({
        access_token: response?.accessToken,
        token_type: "Bearer",
        expires_in:1000*60*60*24*30
    });
  } catch (e:any) {
    return NextResponse.json({
        code:e.code,
        message:e.message
    },{status:e.code})
  }
}