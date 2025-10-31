export interface Response <T> {
   code: number;
   res: T;
   message: string;
}

export interface ErrResponse extends Response<null> {}

