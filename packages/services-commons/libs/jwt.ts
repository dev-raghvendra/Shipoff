import jwt from "jsonwebtoken"

const secret = String(process.env.JWT_SECRET)

export function createJwt(payload : object,expiry: StringValue | number = "1d"  ){
    return new Promise((res,rej)=>{
        jwt.sign(payload, secret, {expiresIn:expiry}, (err, token)=>{
            if(err) return rej(err);
            return res(token);
        })
    })
}

export function verifyJwt(token:string){
    return new Promise((res,rej)=>{
        jwt.verify(token, secret, (err, decoded)=>{
            if(err) return rej(false);
            return res(decoded)
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