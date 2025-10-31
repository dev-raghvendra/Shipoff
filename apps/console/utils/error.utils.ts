import { AxiosError } from "axios";
import { ErrResponse } from "@/types/response";


export function createErrHandler({ serviceName }: { serviceName: string}) {
    return (error: any, message?: string, shouldStringify?: boolean,throwError=true) :never =>  {
        const e = typeof error === "object" ? shouldStringify ? JSON.stringify(error) : error : error;
        console.error("AN_ERROR_OCCURRED_IN_" + serviceName.toUpperCase(), ": ", message || "", e === "{}" ? error : e);
        if (!throwError) return {} as never;
        if (error instanceof AxiosError) {
                throw error.response?.data as ErrResponse
        } else {
            throw { code: 500, message: `${serviceName} Service Error`, res: null }
        }
    }
}