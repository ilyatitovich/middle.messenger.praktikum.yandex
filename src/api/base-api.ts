import { HTTPTransport } from '@/utils'

export type APIResponse<T = unknown> = {
  status: number
  data: T
}

export abstract class BaseAPI {
  protected http: HTTPTransport

  constructor() {
    this.http = new HTTPTransport('https://ya-praktikum.tech/api/v2')
  }
}
