import { registerOAuthClient } from "@/utils/auth.utils";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest){
    const body =await req.json();
    try {
        const response = await registerOAuthClient({
        clientName:body.client_name,
        redirectUris:body.redirect_uris,
        responseTypes:body.response_types,
        tokenEndpointAuthMethod:body.token_endpoint_auth_method,
        grantTypes:body.grant_types
    })
       return NextResponse.json({
        client_id:response?.clientId,
        client_name:response?.clientName,
        client_issued_at:response?.clientIdIssuedAt,
        redirect_uris:response?.redirectUris,
        response_types:response?.responseTypes,
        token_endpoint_auth_method:response?.tokenEndpointAuthMethod
       })
    } catch (e:any) {
        return NextResponse.json({
            code:e.code,
            message:e.message
    },{status:e.code})
    }
}
