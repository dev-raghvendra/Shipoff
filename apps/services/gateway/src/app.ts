import express, {  Request, Response } from 'express';
import cors,{CorsOptions} from "cors"
import logger from "@shipoff/services-commons/libs/winston";
import authRouter from './routers/auth.router';
import projectRouter from './routers/project.router';
import webhookRouter from './routers/webhook.router';
import githubRouter from './routers/github.router';

const app = express();


const corsOptions : CorsOptions = {
    origin:"*",
    methods:"GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: ["Content-Type", "Authorization"]
}
app.use(cors(corsOptions))
app.use(express.json());
app.use("/apis/v1/auth",authRouter);
app.use("/apis/v1/projects",projectRouter);
app.use("/apis/v1/github",githubRouter);
app.use("/apis/v1/webhooks",webhookRouter);


app.use((_, res:Response) => {
    res.status(404).json({
        code: 404,
        message: "Endpoint not found",
        res: null
    });
});

app.use((err:any, _:Request, res:Response)=>{
    res.status(500).json({
        code:500,
        message:"Internal Server Error",
        res:null
    })
    logger.error(`UNEXPECTED_ERROR_OCCURED_AT_GATEWAY: ${JSON.stringify(err, null, 2)}`);
})

export default app;
