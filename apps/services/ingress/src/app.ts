import express from "express"
import { ridMiddleware } from "./middleware/rid.middleware"
import { resolveDestinationMiddleware } from "./middleware/resolve-destination.middleware"
import { proxyMiddleware } from "./middleware/proxy.middleware"
import { errMiddleware } from "./middleware/err.middleware"
import { createProxyReqMiddleware } from "./middleware/create-proxy-req.middleware"

const app = express()


app.use(ridMiddleware)
app.use(resolveDestinationMiddleware)
app.use(createProxyReqMiddleware)
app.use(proxyMiddleware)
app.use(errMiddleware)

export default app