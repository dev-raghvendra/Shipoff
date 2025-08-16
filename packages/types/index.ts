import {z} from "zod"

export const Scopes = z.enum(['PROJECT', 'DEPLOYMENT', 'TEAM', 'TEAM_MEMBER', 'PROJECT_MEMBER', 'TEAM_LINK', "REPOSITORY"]);
export const Permissions = z.enum(['READ', 'CREATE', 'UPDATE', 'DELETE', 'SELF_DELETE', 'SELF_UPDATE', 'TRANSFER_OWNERSHIP']);
export const Providers = z.enum(['GOOGLE', 'GITHUB', 'EMAIL']);
export type ScopeType = z.infer<typeof Scopes>;
export type ProvidersType = z.infer<typeof Providers>;

export const UserSchema = z.object({
  fullName: z.string(),
  email: z.email(),
  userId: z.string(),
  avatarUri: z.url(),
  createdAt: z.string(),
  emailVerified:z.boolean(),
  updatedAt: z.string(),
  provider:Providers
}).strict();

export const BulkResourceRequestSchema = z.object({
   authUserData : UserSchema,
   skip:z.number().nonnegative().optional().default(0),
   limit:z.number().nonnegative().min(1).optional().default(5)
})

export type BulkResourceRequestBodyType = z.infer<typeof BulkResourceRequestSchema>

export const BodyLessRequestSchema = z.object({
  authUserData:UserSchema
}).strict();
export type UserType = z.infer<typeof UserSchema>;
export type PermissionsType = z.infer<typeof Permissions>;
export type ScopesType = z.infer<typeof Scopes>;
export type BodyLessRequestBodyType = z.infer<typeof BodyLessRequestSchema>;

