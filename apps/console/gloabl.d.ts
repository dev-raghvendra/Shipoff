// global.d.ts
import { DefaultSession } from "next-auth";
import { UserData } from "./utils/auth.utils";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user:UserData
    accessToken: string;
    error?:string
  }

  interface User extends UserData {
     accessToken:string,
     refreshToken:string,
     refreshTokenExpiresAt:number
  }
}

declare module "next-auth/jwt" {
    interface JWT {
        user:UserData,
        accessToken:string,
        refreshToken:string,
        refreshTokenExpiresAt:number,
        error?:string
    }
}

