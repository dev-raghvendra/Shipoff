export interface Response <T> {
   code: number;
   res: T;
   message: string;
}

export interface ErrResponse extends Response<null> {}

type DeepRequired<T> = {
  [K in keyof T]-?: NonNullable<T[K]> extends object
    ? DeepRequired<NonNullable<T[K]>>
    : NonNullable<T[K]>;
};

export type InferResponse<
  T extends { toObject: () => any }
> = DeepRequired<ReturnType<T["toObject"]>>;

export type InferServiceResponse<T extends (params:any[])=>Promise<any>> = ReturnType<ReturnType<T>["then"]>