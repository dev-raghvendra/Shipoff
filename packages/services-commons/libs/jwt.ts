import jwt from "jsonwebtoken"
import { JsonWebTokenError } from "jsonwebtoken"

export { JsonWebTokenError }
export function createJwt(payload : object,expiry: StringValue | number = "1d"  ):Promise<string>{
    const secret = String(process.env.JWT_SECRET)
    return new Promise((res,rej)=>{
        jwt.sign(payload, secret, {expiresIn:expiry}, (err, token)=>{
            if(err) return rej(err);
            return res(token as string);
        })
    })
}

export function verifyJwt<T extends {}>(token:string):Promise<T>{
    const secret = String(process.env.JWT_SECRET)
    return new Promise((res,rej)=>{
        jwt.verify(token, secret, (err, decoded)=>{
            if(err) return rej(err);
            return res(decoded as T)
        })
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