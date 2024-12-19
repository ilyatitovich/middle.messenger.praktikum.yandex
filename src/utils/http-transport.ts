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
      xhr.open(method as HTTPMethod, url)

      Object.entries(headers).forEach(([key, value]) => {
        xhr.setRequestHeader(key, value)
      })

      xhr.onload = () => {
        try {
          const response = JSON.parse(xhr.responseText) as TResponse
          resolve(response)
        } catch {
          reject(new Error(`Ошибка при обработке ответа от ${url}`))
        }
      }

      xhr.onerror = () => {
        reject(new Error(`Запрос на адрес ${url} отклонен`))
      }

      xhr.ontimeout = () => {
        reject(new Error(`Превышено время ожидания запроса на адрес ${url}`))
      }

      xhr.timeout = timeout

      if (method === METHODS.GET || !data) {
        xhr.send()
      } else {
        xhr.send(JSON.stringify(data))
      }
    })
  }
}
