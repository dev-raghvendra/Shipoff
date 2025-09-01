import winston, {createLogger, format, transports} from "winston"

const devLogger = createLogger({
   transports:[
    new transports.Console({
         level:"debug",
    format:format.combine(format.timestamp({
        format:()=>new Date().toString()
    }),
    format.colorize(),
    format.printf(info=>`\n[${info.timestamp}] \n${info.level}: ${info.message}`)
    )})
   ]
})


const productionLogger = {}

export const logger = (process.env.ENV==="production" ? productionLogger : devLogger) as winston.Logger
 