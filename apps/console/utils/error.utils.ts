import { AxiosError } from "axios";
import { ErrResponse } from "@/types/response";


export function createErrHandler({ serviceName }: { serviceName: string }) {
    return (error: any, message?: string, shouldStringify=false,shouldReturn = true) => {
        const e = typeof error === "object" ? shouldStringify ? JSON.stringify(error) : error : error;
        console.error("AN_ERROR_OCCURRED_IN_" + serviceName.toUpperCase(), ": ", message || "", e === "{}" ? error : e);
        if (shouldReturn) {
            if (error instanceof AxiosError) {
                return error.response?.data as ErrResponse
            }
            else return { code: 500, message: `${serviceName} Service Error`, res: null }
        }
    }
}