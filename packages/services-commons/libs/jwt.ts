import jwt from "jsonwebtoken"
import { JsonWebTokenError } from "jsonwebtoken"

export { JsonWebTokenError }
export function createJwt<T extends object>(payload : T,expiry: StringValue | number = "1d",secret?:string):Promise<string>{
    const SECRET = secret || String(process.env.JWT_SECRET)
    return new Promise((res,rej)=>{
        jwt.sign(payload, SECRET, {expiresIn:expiry}, (err, token)=>{
            if(err) return rej(err);
            return res(token as string);
        })
    })
}

export function verifyJwt<T extends object>(token:string,secret?:string):Promise<T>{
    const SECRET =secret || String(process.env.JWT_SECRET)
    return new Promise((res,rej)=>{
        jwt.verify(token, SECRET, (err, decoded)=>{
            if(err) return rej(err);
            return res(decoded as T)
        })
    })
}

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

    type StringValue =
        | `${number}`
        | `${number}${UnitAnyCase}`
        | `${number} ${UnitAnyCase}`;