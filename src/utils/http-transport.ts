enum RequestMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE'
}

type RequestOptions<TData = unknown> = {
  method: RequestMethod
  headers?: Record<string, string>
  data?: TData
}

type QueryParams = Record<string, string | number | boolean>

type HTTPMethod = <TResponse = unknown, TData = unknown>(
  url: string,
  options?: Partial<RequestOptions<TData>>,
  timeout?: number
) => Promise<TResponse>

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

  get: HTTPMethod = (url, options = {}) => {
    const { data, ...restOptions } = options
    const urlWithParams = data ? `${url}${queryStringify(data)}` : url
    return this.request(urlWithParams, {
      ...restOptions,
      method: RequestMethod.GET
    })
  }

  post: HTTPMethod = (url, options = {}) => {
    return this.request(url, { ...options, method: RequestMethod.POST })
  }

  put: HTTPMethod = (url, options = {}) => {
    return this.request(url, { ...options, method: RequestMethod.PUT })
  }

  delete: HTTPMethod = (url, options = {}) => {
    return this.request(url, { ...options, method: RequestMethod.DELETE })
  }

  private request: HTTPMethod = (url, options = {}, timeout = 5000) => {
    const { method, headers = {}, data } = options

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      xhr.open(method as RequestMethod, `${this.baseURL}${url}`)
      xhr.withCredentials = true
      xhr.timeout = timeout

      Object.entries(headers).forEach(([key, value]) => {
        xhr.setRequestHeader(key, value)
      })

      xhr.onload = () => {
        const status = xhr.status
        const contentType = xhr.getResponseHeader('Content-Type')

        if (status >= 200 && status < 300) {
          try {
            let response

            if (contentType && contentType.includes('application/json')) {
              response = JSON.parse(xhr.responseText)
            } else {
              response = xhr.responseText
            }

            resolve(response)
          } catch {
            reject(new Error(`Ошибка при парсинге ответа от ${url}`))
          }
        } else {
          reject({ status, message: `Запрос отклонен со статусом: ${status}` })
        }
      }

      xhr.onerror = () => {
        reject(new Error('Ошибка сети, проверьте подключение'))
      }

      xhr.ontimeout = () => {
        reject(new Error(`Превышено время ожидания запроса`))
      }

      if (method === RequestMethod.GET || !data) {
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
