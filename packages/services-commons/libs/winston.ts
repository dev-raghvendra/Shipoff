import  {createLogger, format, transports} from "winston"


export const intilizeLogger = (serviceName:string)=>createLogger({
   transports:[
    new transports.Console({
         level:"debug",
    format:format.combine(format.timestamp({
        format:()=>new Date().toString()
    }),
    format.colorize(),
    format.printf(info=>{
        if(process.env.ENV === "DEVELOPMENT") return `\n[${info.timestamp}]\n[${serviceName}]\n${info.level}: ${info.message}`
        return `[${info.timestamp}] [${serviceName}] ${info.level}: ${info.message}`
    })
    )})
   ]
})
