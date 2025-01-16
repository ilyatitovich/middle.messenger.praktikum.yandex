import {
  UserAPI,
  type UserData,
  type ChangePasswordData,
  type APIError
} from '@/api'
import { showRequestResult } from '@/components'
import { userStore } from '@/stores'

class UserController {
  private userApi: UserAPI

  constructor() {
    this.userApi = new UserAPI()
  }

  async updateData(data: UserData): Promise<void> {
    userStore.set({ status: 'loading' })

    try {
      const user = await this.userApi.changeData(data)
      userStore.set({ status: 'success', user })
      showRequestResult(true, 'Данные обновлены')
    } catch (error) {
      this.userApi.handleError(
        error as APIError,
        'Ошибка при обновлении данных',
        () => userStore.set({ status: 'error' })
      )
    }
  }

  async updateAvatar(avatar: FormData): Promise<void> {
    userStore.set({ status: 'loading' })

    try {
      const user = await this.userApi.changeAvatar(avatar)
      userStore.set({ status: 'success', user })
      showRequestResult(true, 'Аватар обновлен')
    } catch (error) {
      this.userApi.handleError(
        error as APIError,
        'Ошибка при обновлении аватара',
        () => userStore.set({ status: 'error' })
      )
    }
  }

  async updatePassword(data: ChangePasswordData): Promise<void> {
    userStore.set({ status: 'loading' })

    try {
      await this.userApi.changePassword(data)
      userStore.set({ status: 'success' })
      showRequestResult(true, 'Пароль обновлен')
    } catch (error) {
      this.userApi.handleError(
        error as APIError,
        'Ошибка при обновлении пароля',
        () => userStore.set({ status: 'error' })
      )
    }
  }
}

export const userController = new UserController()
