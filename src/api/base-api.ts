import { appRouter } from '@/app'
import { showRequestResult } from '@/components'
import { HTTPTransport } from '@/utils'

type APIError = {
  status: number
}

export abstract class BaseAPI {
  protected http: HTTPTransport = new HTTPTransport(
    'https://ya-praktikum.tech/api/v2'
  )

  handleError(error: unknown, message: string, callback?: () => void): void {
    const { status } = error as APIError

    switch (status) {
      case 400:
        showRequestResult(false, message)
        break
      case 401:
        showRequestResult(false, 'Вы не авторизованы')
        break
      case 409:
        showRequestResult(
          false,
          'Пользователь с таким логином или почтой уже зарегистрирован'
        )
        break
      case 500:
        appRouter.go('/500')
        break
      default:
        showRequestResult(false, 'Произошла ошибка')
        break
    }

    if (callback) {
      callback()
    }
  }
}
