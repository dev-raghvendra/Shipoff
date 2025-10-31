import express, {  Request, Response } from 'express';
import cors,{CorsOptions} from "cors"
import {logger} from "@/libs/winston";
import authRouter from '@/routers/http/auth.router';
import projectRouter from '@/routers/http/project.router';
import webhookRouter from '@/routers/http/webhook.router';
import githubRouter from '@/routers/http/github.router';
import orchestratorRouter from '@/routers/http/orchestrator.router';
import { ridMiddleware } from '@/middlewares/http/rid.middleware';
import logRouter from '@/routers/http/log.router';
import { createSyncErrHandler } from '@shipoff/services-commons';
import { RequestWithMeta } from './types/request';
import { CONFIG } from './config';

const app = express();
const errHandler = createSyncErrHandler({ subServiceName: "EXPRESS_GATEWAY", logger });

const corsOptions : CorsOptions = {
    origin:CONFIG.FRONTEND_URL,
    methods:"GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: ["Content-Type", "Authorization","X-Api-Key"]
}
app.use(cors(corsOptions))
app.disable('x-powered-by');
app.use(ridMiddleware)
app.use("/apis/v1/webhooks",express.raw({type:"application/json"}),webhookRouter);
app.use(express.json({limit:"3mb"}));
app.use("/apis/v1/logs",logRouter)
app.use("/apis/v1/auth",authRouter);
app.use("/apis/v1/projects",projectRouter);
app.use("/apis/v1/github",githubRouter);
app.use("/apis/v1/orchestrator",orchestratorRouter)



app.use((_, res:Response) => {
    res.status(404).json({
        code: 404,
        message: "Endpoint not found",
        res: null
    });
});

app.use((err:any, _:RequestWithMeta, res:Response)=>{
    res.status(500).json({
        code:500,
        message:"Internal Server Error",
        res:null
    })
    errHandler(err,"EXPRESS_GLOBAL_HANDLER",_.meta?.requestId || "N/A");
})

export default app;
