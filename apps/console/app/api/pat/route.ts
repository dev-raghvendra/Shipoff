// app/api/pat/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { SignJWT } from "jose";

import { authOptions } from "@/lib/auth";
import { NEXT_AUTH_SECRETS } from "@/config/next-auth-secrets";

const VALID_EXPIRIES = [
  "1h",
  "1d",
  "7d",
  "30d",
  "90d",
  "365d",
] as const;

type Expiry = (typeof VALID_EXPIRIES)[number];

function toSeconds(expiry: Expiry) {
  switch (expiry) {
    case "1h":
      return 60 * 60;
    case "1d":
      return 60 * 60 * 24;
    case "7d":
      return 60 * 60 * 24 * 7;
    case "30d":
      return 60 * 60 * 24 * 30;
    case "90d":
      return 60 * 60 * 24 * 90;
    case "365d":
      return 60 * 60 * 24 * 365;
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json(
      {
        message: "Unauthorized",
      },
      {
        status: 401,
      }
    );
  }

  const { expiry,name } = await req.json();

  if (!VALID_EXPIRIES.includes(expiry)) {
    return NextResponse.json(
      {
        message: "Invalid expiry",
      },
      {
        status: 400,
      }
    );
  }

  const now = Math.floor(Date.now() / 1000);

  const token = await new SignJWT({
    authUserData: session.user,
    type: "pat",
  })
    .setProtectedHeader({
      alg: "HS256",
    })
    .setIssuedAt(now)
    .setExpirationTime(now + toSeconds(expiry))
    .setAudience(name)
    .sign(new TextEncoder().encode(NEXT_AUTH_SECRETS.NEXTAUTH_SECRET));

  return NextResponse.json({
    accessToken: token,
    expiresIn: toSeconds(expiry),
    expiresAt: now + toSeconds(expiry),
  });
}