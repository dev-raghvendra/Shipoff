import jwt from "jsonwebtoken"
import { JsonWebTokenError } from "jsonwebtoken"

export { JsonWebTokenError }

/**
 * Generates a signed JSON Web Token (JWT) asynchronously.
 * 
 * @template T The type of the payload object.
 * @param payload The payload containing claims to embed in the token.
 * @param expiry Optional expiration time string (e.g. "1d", "5m") or seconds. Defaults to "1d".
 * @param secret Optional JWT signing secret. Defaults to process.env.JWT_SECRET.
 * @returns A promise that resolves to the generated JWT string.
 */
export function createJwt<T extends object>(payload : T,expiry: StringValue | number = "1d",secret?:string):Promise<string>{
    const SECRET = secret || String(process.env.JWT_SECRET)
    return new Promise((res,rej)=>{
        jwt.sign(payload, SECRET, {expiresIn:expiry}, (err, token)=>{
            if(err) return rej(err);
            return res(token as string);
        })
    })
}

/**
 * Verifies a JSON Web Token signature and returns the decoded payload.
 * 
 * @template T The expected type of the decoded token payload.
 * @param token The JWT string to verify.
 * @param secret Optional verification secret. Defaults to process.env.JWT_SECRET.
 * @returns A promise that resolves to the decoded payload object if verification succeeds.
 */
export function verifyJwt<T extends object>(token:string,secret?:string):Promise<T>{
    const SECRET =secret || String(process.env.JWT_SECRET)
    return new Promise((res,rej)=>{
        jwt.verify(token, SECRET, (err, decoded)=>{
            if(err) return rej(err);
            return res(decoded as T)
        })
    })
}

/**
 * Decodes a JSON Web Token payload without verifying the signature or expiration.
 * 
 * @template T The expected type of the decoded token payload.
 * @param token The JWT string to decode.
 * @returns A promise that resolves to the decoded payload.
 */
export function decodeJwt<T extends object>(token:string):Promise<T>{
    return new Promise((res,rej)=>{
        const decoded = jwt.decode(token) as T;
        if(!decoded) return rej(false);
        return res(decoded);
    })
}


 type Unit =
        | "Years"
        | "Year"
        | "Yrs"
        | "Yr"
        | "Y"
        | "Weeks"
        | "Week"
        | "W"
        | "Days"
        | "Day"
        | "D"
        | "Hours"
        | "Hour"
        | "Hrs"
        | "Hr"
        | "H"
        | "Minutes"
        | "Minute"
        | "Mins"
        | "Min"
        | "M"
        | "Seconds"
        | "Second"
        | "Secs"
        | "Sec"
        | "s"
        | "Milliseconds"
        | "Millisecond"
        | "Msecs"
        | "Msec"
        | "Ms";

    type UnitAnyCase = Unit | Uppercase<Unit> | Lowercase<Unit>;

    export type StringValue =
        | `${number}`
        | `${number}${UnitAnyCase}`
        | `${number} ${UnitAnyCase}`;