// BaseService.ts
import { createErrHandler } from "@/utils/error.utils"
import { serviceReqInterceptor, serviceResIntercepter } from "@/utils/service.utils"
import axios, { AxiosInstance } from "axios"

interface ServiceOptions {
  baseURL: string
  serviceName: string
}

export abstract class BaseService {
  protected _axiosInstance: AxiosInstance
  protected _isFetching = false
  protected _authToken: string | null = null
  protected _sessionExpired = false
  protected handleError: ReturnType<typeof createErrHandler>

  constructor({ baseURL, serviceName }: ServiceOptions) {
    this._axiosInstance = axios.create({ baseURL })

    this._axiosInstance.interceptors.request.use(
      serviceReqInterceptor.apply(this)
    )

    this._axiosInstance.interceptors.response.use(
      (res) => res,
      serviceResIntercepter.apply(this)
    )

    this.handleError = createErrHandler({ serviceName })
  }
}
