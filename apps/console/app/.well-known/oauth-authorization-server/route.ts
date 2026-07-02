import { NextResponse } from "next/server";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL!;

export async function GET() {
    return NextResponse.json({
        issuer: BASE_URL,

        authorization_endpoint: `${BASE_URL}/api/oauth/authorize`,

        token_endpoint: `${BASE_URL}/api/oauth/token`,

        response_types_supported: ["code"],

        grant_types_supported: ["authorization_code"],

        code_challenge_methods_supported: ["S256"],

        token_endpoint_auth_methods_supported: ["none"]
    });
}