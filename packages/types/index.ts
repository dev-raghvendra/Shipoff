import {z, ZodRawShape, ZodType} from "zod"

export const Scopes = z.enum(['PROJECT', 'DEPLOYMENT', 'TEAM', 'TEAM_MEMBER', 'PROJECT_MEMBER', 'TEAM_LINK', "REPOSITORY"]);
export const Permissions = z.enum(['READ', 'CREATE', 'UPDATE', 'DELETE', 'SELF_DELETE', 'SELF_UPDATE', 'TRANSFER_OWNERSHIP']);
export const Providers = z.enum(['GOOGLE', 'GITHUB', 'EMAIL']);
export const TeamRoles = z.enum(['TEAM_DEVELOPER','TEAM_ADMIN', 'TEAM_OWNER', 'TEAM_VIEWER']);
export const ProjectRoles = z.enum(['PROJECT_OWNER', 'PROJECT_ADMIN', 'PROJECT_VIEWER','PROJECT_DEVELOPER']);
export const Subscriptions = z.enum(['PRO','FREE','ENTERPRISE'])

export const Runtimes = z.enum(['NODEJS', 'PYTHON', 'PHP']);
export type ScopeType = z.infer<typeof Scopes>;
export type ProvidersType = z.infer<typeof Providers>;
export type RuntimesType = z.infer<typeof Runtimes>;
export const optNumWithDefaultValue = (defaultNum:number)=>z.number().int().nonnegative().transform(val => val == 0 ? undefined : val ).optional().default(defaultNum);
export const optionalString = ()=> z.string().transform(str=>str.trim() ? str : undefined).optional()
export const optionalArray = <T extends ZodRawShape>(schema:T)=>z.array(z.object(schema)).transform(arr => arr.length==1 ? Object.entries(arr[0]).some(([_, v])=>v === "") ? undefined : arr : undefined).optional()
export const optionalObject = <T extends ZodRawShape>(schema:T)=>z.object(schema).transform(obj=>Object.entries(obj).some(([_, v])=>v === "")?undefined:obj).optional()

export const LogBodySchema = z.object({
  message:z.string(),
  level:z.enum(['INFO','ERROR', 'SUCCESS']),
  timestamp:z.string().min(1),
  type:z.enum(['SYSTEM','BUILD','RUNTIME']),
  envId:z.string().min(1)
}).strict()

export const PerkSchema = z.object({
        perkId:z.string().min(4),
        staticProjects:z.number().min(2),
        dynamicProjects:z.number().min(1)
}).strict()

export const SubscriptionSchema = z.object({
      subscriptionId:z.string().min(4),
      type:z.enum(["PRO","FREE","ENTERPRISE"]),
      perks:PerkSchema,
      startedAt:z.string().min(4),
      endedAt:optionalString()
  }).strict()

export const UserSchema = z.object({
  fullName: z.string(),
  email: z.email(),
  userId: z.string(),
  avatarUri: z.url(),
  createdAt: z.string().min(4),
  emailVerified:z.boolean(),
  subscription:SubscriptionSchema,
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

export const LOGS_WS_EVENTS = {
    STATIC_LOGS_COMPLETE:"STATIC_LOGS_COMPLETE"
} as const;

export type UserType = z.infer<typeof UserSchema>;
export type RequestMetaType = z.infer<typeof RequestMetaSchema>;
export type PermissionsType = z.infer<typeof Permissions>;
export type ScopesType = z.infer<typeof Scopes>;
export type BodyLessRequestBodyType = z.infer<typeof BodyLessRequestSchema>;
export type InternalEmptyRequestBodyType = z.infer<typeof InternalEmptyRequestSchema>;
export type TeamRoleType = z.infer<typeof TeamRoles>
export type ProjectRoleType = z.infer<typeof ProjectRoles>
export type SubscriptionType = z.infer<typeof SubscriptionSchema>
export type LogBodyType = z.infer<typeof LogBodySchema>
export type ExtendLogBodyType = LogBodyType & {logId:string}

export type InferRequest<
  T extends { toObject: (...args: any[]) => any },
  OptionalProp extends keyof ReturnType<T["toObject"]> | undefined = undefined
> =
  Required<
    Omit<
      ReturnType<T["toObject"]>,
      "authUserData" | "reqMeta" | ([OptionalProp] extends [keyof ReturnType<T["toObject"]>] ? OptionalProp : never)
    >
  >
  &
  ([OptionalProp] extends [keyof ReturnType<T["toObject"]>]
    ? Partial<Pick<ReturnType<T["toObject"]>, OptionalProp>>
    : {});

type DeepRequired<T> = {
  [K in keyof T]-?: NonNullable<T[K]> extends object
    ? DeepRequired<NonNullable<T[K]>>
    : NonNullable<T[K]>;
};

export type InferResponse<
  T extends { toObject: () => any }
> = DeepRequired<ReturnType<T["toObject"]>>;

export type InferServiceResponse<T extends (params:any[])=>Promise<any>> = ReturnType<ReturnType<T>["then"]>