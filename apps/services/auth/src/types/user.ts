import z from "zod";
import {Providers, RequestMetaSchema, UserSchema} from "@shipoff/types"


export const SigninRequestSchema = z.object({
  fullName: z.string().min(4,"fullName must be 4 chars long"),
  email: z.email(),
  password: z.string().min(8,"Password must be atleast 8 chars long"),
  avatarUri: z.url(),
  reqMeta:RequestMetaSchema,
}).strict();


export const OAuthRequestSchema = SigninRequestSchema.extend({
  provider:Providers.exclude(["EMAIL"])
})
export const EmailPassLoginRequestSchema = z.object({
    email: z.email(),
    password: z.string(),
    reqMeta:RequestMetaSchema
}).strict();


export type UserSchemaType = z.infer<typeof UserSchema>;
export type UserBody = z.infer<typeof UserSchema>;
export type EmailPassLoginRequestBodyType = z.infer<typeof EmailPassLoginRequestSchema>;
export type SigninRequestBodyType = z.infer<typeof SigninRequestSchema>
export type SigninRequestDBBodyType = Omit<SigninRequestBodyType,"reqMeta">
export type OAuthRequestBodyType = z.infer<typeof OAuthRequestSchema>
export type OAuthRequestDBBodyType = Omit<OAuthRequestBodyType,"reqMeta">

export const GetUserRequestSchema = z.object({
  targetUserId: z.string(),
  authUserData:UserSchema,
  reqMeta:RequestMetaSchema
}).strict();

export type GetUserRequestBodyType = z.infer<typeof GetUserRequestSchema>;
export type GetUserRequestDBBodyType = Omit<z.infer<typeof GetUserRequestSchema>,"authUserData" | "reqMeta">


export const TokensSchema = z.object({
  refreshToken: z.string(),
  accessToken: z.string(),
}).strict();
export type TokensBodyType = z.infer<typeof TokensSchema>;

