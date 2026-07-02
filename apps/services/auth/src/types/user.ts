import z from "zod";
import {Providers, RequestMetaSchema, UserSchema} from "@shipoff/types"


export const SigninRequestSchema = z.object({
  fullName: z.string().min(4,"fullName must be 4 chars long"),
  email: z.email(),
  password: z.string().min(8,"Password must be atleast 8 chars long"),
  avatarUri: z.url(),
  reqMeta:RequestMetaSchema,
}).strict();

export const VerifyEmailRequestSchema = z.object({
  token: z.string(),
  reqMeta:RequestMetaSchema,
}).strict();

export const CreateAuthorizationCodeRequestSchema = z.object({
  userId: z.string().min(5),

  clientId: z.string().min(1),

  redirectUri: z.string().url(),

  codeChallenge: z
    .string()
    .min(43)
    .max(128),

  codeChallengeMethod: z.literal("S256"),
  scopes:z.array(z.string()).min(1),
  reqMeta:RequestMetaSchema
}).strict()

export type CreateAuthorizationCodeRequestBodyType = z.infer<typeof CreateAuthorizationCodeRequestSchema>

export const ExchangeAuthorizationCodeRequestSchema = z.object({
  authorizationCode: z.string().min(1),
  
  clientId: z.string().min(1),

  redirectUri: z.string().url(),

  codeVerifier: z
    .string()
    .min(43)
    .max(128),
    reqMeta:RequestMetaSchema
  }).strict()
  
  export type ExchangeAuthorizationCodeRequestBodyType = z.infer<typeof ExchangeAuthorizationCodeRequestSchema>
export const OAuthRequestSchema = SigninRequestSchema.extend({
  provider:Providers.exclude(["EMAIL"])
})
export const EmailPassLoginRequestSchema = z.object({
    email: z.email(),
    password: z.string(),
    reqMeta:RequestMetaSchema
}).strict();

export type VerifyEmailRequestBodyType = z.infer<typeof VerifyEmailRequestSchema>;
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

