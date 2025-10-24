import {z} from "zod"

export const UpdateSessionRequestSchema = z.object({
    accessToken:z.string().min(1),
    refreshToken:z.string().min(1)
}).strict()

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