import {z, ZodRawShape, ZodType} from "zod"

export const Scopes = z.enum(['PROJECT', 'DEPLOYMENT', 'TEAM', 'TEAM_MEMBER', 'PROJECT_MEMBER', 'TEAM_LINK', "REPOSITORY"]);
export const Permissions = z.enum(['READ', 'CREATE', 'UPDATE', 'DELETE', 'SELF_DELETE', 'SELF_UPDATE', 'TRANSFER_OWNERSHIP']);
export const Providers = z.enum(['GOOGLE', 'GITHUB', 'EMAIL']);
export const Runtimes = z.enum(['NODEJS', 'PYTHON', 'PHP']);
export type ScopeType = z.infer<typeof Scopes>;
export type ProvidersType = z.infer<typeof Providers>;
export type RuntimesType = z.infer<typeof Runtimes>;
export const optNumWithDefaultValue = (defaultNum:number)=>z.number().int().nonnegative().transform(val => val == 0 ? undefined : val ).optional().default(defaultNum);
export const optionalString = ()=> z.string().transform(str=>str.trim() ? str : undefined).optional()
export const optionalArray = <T extends ZodType>(schema:T)=>z.array(schema).transform(arr => arr.length ? arr : undefined).optional()
export const optionalObject = <T extends ZodRawShape>(schema:T)=>z.object(schema).transform(obj=>Object.entries(obj).some(([_, v])=>v === "")?undefined:obj).optional()

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


export const RequestMetaSchema = z.object({
    requestId:z.string().min(10).max(100),
}).strict();

export const BulkResourceRequestSchema = z.object({
   authUserData : UserSchema,
   skip:optNumWithDefaultValue(0),
   limit:optNumWithDefaultValue(5),
  reqMeta:RequestMetaSchema
})

export const InternalEmptyRequestSchema = z.object({
  reqMeta:RequestMetaSchema
}).strict();

export type BulkResourceRequestBodyType = z.infer<typeof BulkResourceRequestSchema>

export const BodyLessRequestSchema = z.object({
  authUserData:UserSchema,
  reqMeta:RequestMetaSchema
}).strict();

export type UserType = z.infer<typeof UserSchema>;
export type PermissionsType = z.infer<typeof Permissions>;
export type ScopesType = z.infer<typeof Scopes>;
export type BodyLessRequestBodyType = z.infer<typeof BodyLessRequestSchema>;
export type InternalEmptyRequestBodyType = z.infer<typeof InternalEmptyRequestSchema>;

