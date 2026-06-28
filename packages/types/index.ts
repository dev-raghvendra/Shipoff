import {z, ZodRawShape, ZodType} from "zod"

/** Scopes defining resource levels for permissions checks. */
export const Scopes = z.enum(['PROJECT', 'DEPLOYMENT', 'TEAM', 'TEAM_MEMBER', 'PROJECT_MEMBER', 'TEAM_LINK', "REPOSITORY"]);
/** Permissions actions that can be performed on resources. */
export const Permissions = z.enum(['READ', 'CREATE', 'UPDATE', 'DELETE', 'SELF_DELETE', 'SELF_UPDATE', 'TRANSFER_OWNERSHIP']);
/** Supported authentication providers. */
export const Providers = z.enum(['GOOGLE', 'GITHUB', 'EMAIL']);
/** Roles defined within a Team. */
export const TeamRoles = z.enum(['TEAM_DEVELOPER','TEAM_ADMIN', 'TEAM_OWNER', 'TEAM_VIEWER']);
/** Roles defined within a Project. */
export const ProjectRoles = z.enum(['PROJECT_OWNER', 'PROJECT_ADMIN', 'PROJECT_VIEWER','PROJECT_DEVELOPER']);
/** Available subscription tiers. */
export const Subscriptions = z.enum(['PRO','FREE','ENTERPRISE'])
/** Supported project base runtimes. */
export const Runtimes = z.enum(['NODEJS', 'PYTHON', 'PHP']);

export type ScopeType = z.infer<typeof Scopes>;
export type ProvidersType = z.infer<typeof Providers>;
export type RuntimesType = z.infer<typeof Runtimes>;

/**
 * Zod helper to define an optional integer field with a default value.
 * Converts 0 to undefined.
 */
export const optNumWithDefaultValue = (defaultNum:number)=>z.number().int().nonnegative().transform(val => val == 0 ? undefined : val ).optional().default(defaultNum);

/** Zod helper to define an optional string field that trims whitespace and returns undefined if empty. */
export const optionalString = ()=> z.string().transform(str=>str.trim() ? str : undefined).optional()

/** Zod helper to define an optional array of objects, returning undefined if empty. */
export const optionalArray = <T extends ZodRawShape>(schema:T)=>z.array(z.object(schema)).transform(arr => arr.length==1 ? Object.entries(arr[0]).some(([_, v])=>v === "") ? undefined : arr : arr).optional()

/** Zod helper to define an optional object, returning undefined if any property is empty. */
export const optionalObject = <T extends ZodRawShape>(schema:T)=>z.object(schema).transform(obj=>Object.entries(obj).some(([_, v])=>v === "")?undefined:obj).optional()

/** Zod validation schema for system/runtime/build logs. */
export const LogBodySchema = z.object({
  message:z.string(),
  level:z.enum(['INFO','ERROR', 'SUCCESS']),
  timestamp:z.string().min(1),
  type:z.enum(['SYSTEM','BUILD','RUNTIME']),
  envId:z.string().min(1)
}).strict()

/** Zod validation schema defining limits (projects, memory, CPU) associated with a subscription perk. */
export const PerkSchema = z.object({
        perkId:z.string().min(4),
        staticProjects:z.number().min(2),
        dynamicProjects:z.number().min(1),
        memoryLimitMB:z.number().min(128),
        cpuLimitPercent:z.number().min(10).max(100)
}).strict()

/** Zod validation schema for user subscription information. */
export const SubscriptionSchema = z.object({
      subscriptionId:z.string().min(4),
      type:z.enum(["PRO","FREE","ENTERPRISE"]),
      perks:PerkSchema,
      startedAt:z.string().min(4),
      endedAt:optionalString()
  }).strict()

/** Zod validation schema for a User entity. */
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

/** Zod validation schema for standard request tracing/metadata containing the requestId. */
export const RequestMetaSchema = z.object({
    requestId:z.string().min(10).max(100),
}).strict();

/** Zod validation schema for requests fetching resources in bulk with pagination and tracing. */
export const BulkResourceRequestSchema = z.object({
   authUserData : UserSchema,
   skip:optNumWithDefaultValue(0),
   limit:optNumWithDefaultValue(5),
  reqMeta:RequestMetaSchema
})

/** Zod validation schema for internal service calls containing only tracing metadata. */
export const InternalEmptyRequestSchema = z.object({
  reqMeta:RequestMetaSchema
}).strict();

export type BulkResourceRequestBodyType = z.infer<typeof BulkResourceRequestSchema>

/** Zod validation schema for bodyless authenticated client requests. */
export const BodyLessRequestSchema = z.object({
  authUserData:UserSchema,
  reqMeta:RequestMetaSchema
}).strict();

/** WebSocket events used by logs microservice. */
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

/**
 * Utility type to infer incoming request body shape by omitting standard authentication and request metadata fields.
 * Optionally makes specified properties optional.
 * 
 * @template T The type representing the gRPC request class/message.
 * @template OptionalProp Union of keys to mark as optional in the inferred request body.
 */
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

/** Recursively forces all properties of a type to be non-nullable and required. */
type DeepRequired<T> = {
  [K in keyof T]-?: NonNullable<T[K]> extends object
    ? DeepRequired<NonNullable<T[K]>>
    : NonNullable<T[K]>;
};

/** Infers the structure of a gRPC response by stripping nullability. */
export type InferResponse<
  T extends { toObject: () => any }
> = DeepRequired<ReturnType<T["toObject"]>>;

/** Infers the return type of a service method callback function. */
export type InferServiceResponse<T extends (params:any[])=>Promise<any>> = ReturnType<ReturnType<T>["then"]>