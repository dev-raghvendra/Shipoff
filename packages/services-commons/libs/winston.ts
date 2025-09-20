import  {createLogger, format, transports} from "winston"


export const intilizeLogger = (serviceName:string)=>createLogger({
   transports:[
    new transports.Console({
         level:"debug",
    format:format.combine(format.timestamp({
        format:()=>new Date().toString()
    }),
    format.colorize(),
    format.printf(info=>`\n[${info.timestamp}]\n[${serviceName}]\n${info.level}: ${info.message}`)
    )})
   ]
})
