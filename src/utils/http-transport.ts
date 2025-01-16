const METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE'
} as const

type HTTPMethod = (typeof METHODS)[keyof typeof METHODS]

type RequestOptions<TData = unknown> = {
  method: HTTPMethod
  headers?: Record<string, string>
  data?: TData
}

type QueryParams = Record<string, string | number | boolean>

function queryStringify(data: QueryParams): string {
  if (!data || typeof data !== 'object') {
    return ''
  }

  return (
    '?' +
    Object.entries(data)
      .map(
        ([key, value]) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`
      )
      .join('&')
  )
}

export class HTTPTransport {
  private baseURL: string

  constructor(baseURL: string) {
    this.baseURL = baseURL
  }

  get<TResponse = unknown>(
    url: string,
    options: Partial<RequestOptions<QueryParams>> = {}
  ): Promise<TResponse> {
    const { data, ...restOptions } = options
    const urlWithParams = data ? `${url}${queryStringify(data)}` : url
    return this.request<TResponse>(urlWithParams, {
      ...restOptions,
      method: METHODS.GET
    })
  }

  post<TResponse = unknown, TData = unknown>(
    url: string,
    options: Partial<RequestOptions<TData>> = {}
  ): Promise<TResponse> {
    return this.request<TResponse>(url, { ...options, method: METHODS.POST })
  }

  put<TResponse = unknown, TData = unknown>(
    url: string,
    options: Partial<RequestOptions<TData>> = {}
  ): Promise<TResponse> {
    return this.request<TResponse>(url, { ...options, method: METHODS.PUT })
  }

  delete<TResponse = unknown>(
    url: string,
    options: Partial<RequestOptions> = {}
  ): Promise<TResponse> {
    return this.request<TResponse>(url, { ...options, method: METHODS.DELETE })
  }

  request<TResponse = unknown>(
    url: string,
    options: Partial<RequestOptions>,
    timeout = 5000
  ): Promise<TResponse> {
    const { method, headers = {}, data } = options

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      xhr.open(method as HTTPMethod, `${this.baseURL}${url}`)
      xhr.withCredentials = true
      xhr.timeout = timeout

      Object.entries(headers).forEach(([key, value]) => {
        xhr.setRequestHeader(key, value)
      })

      xhr.onload = () => {
        const status = xhr.status
        const contentType = xhr.getResponseHeader('Content-Type')

        if (status === 200) {
          try {
            let response: TResponse

            if (contentType && contentType.includes('application/json')) {
              response = JSON.parse(xhr.responseText) as TResponse
            } else {
              response = xhr.responseText as unknown as TResponse
            }

            resolve(response)
          } catch {
            reject(new Error(`Error parsing response from ${url}`))
          }
        } else {
          reject({ status, message: `Request failed with status ${status}` })
        }
      }

      xhr.onerror = () => {
        reject(new Error(`Запрос на адрес ${url} отклонен`))
      }

      xhr.ontimeout = () => {
        reject(new Error(`Превышено время ожидания запроса на адрес ${url}`))
      }

      if (method === METHODS.GET || !data) {
        xhr.send()
      } else if (data instanceof FormData) {
        xhr.send(data as FormData)
      } else {
        xhr.setRequestHeader('Content-Type', 'application/json')
        xhr.send(JSON.stringify(data))
      }
    })
  }
}

export const http = new HTTPTransport('https://ya-praktikum.tech/api/v2')
