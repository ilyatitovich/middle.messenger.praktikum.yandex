import { AuthAPI, type LoginData, type SignUpData } from '@/api'
import { appRouter } from '@/app'
import { removePreloader, showPreloader } from '@/components'
import { authStore, userStore } from '@/stores'

class AuthController {
  private authAPI: AuthAPI = new AuthAPI()

  async login(data: LoginData): Promise<void> {
    authStore.set({ status: 'loading' })

    try {
      await this.authAPI.login(data)
      await this.getUser()

      authStore.set({ status: 'success' })
      appRouter.go('/messenger')
    } catch (error) {
      this.authAPI.handleError(error, 'Ошибка про авторизации', () =>
        authStore.set({ status: 'error' })
      )
    }
  }

  async signup(data: SignUpData): Promise<void> {
    authStore.set({ status: 'loading' })
    try {
      await this.authAPI.signup(data)
      await this.getUser()

      authStore.set({ status: 'success' })
      appRouter.go('/messenger')
    } catch (error) {
      this.authAPI.handleError(error, 'Ошибка про регистрации', () =>
        authStore.set({ status: 'error' })
      )
    }
  }

  async logout(): Promise<void> {
    try {
      await this.authAPI.logout()
      userStore.set({ user: null })
      appRouter.go('/')
    } catch (error) {
      this.authAPI.handleError(error, 'Произошла ошибка', () =>
        authStore.set({ status: 'error' })
      )
    }
  }

  async getUser(): Promise<void> {
    try {
      const user = await this.authAPI.getUser()
      userStore.set({ user })
    } catch (error) {
      console.error(error)
    }
  }

  checkAuth = async (): Promise<void> => {
    showPreloader()
    const { user: initialUser } = userStore.get()
    const currentRoute = appRouter.getCurrentRoute()

    if (initialUser && currentRoute) {
      this.handleAuthenticatedUser(currentRoute)
      return
    }

    await this.getUser()
    const { user: fetchedUser } = userStore.get()

    if (fetchedUser) {
      this.handleAuthenticatedUser(currentRoute!)
    } else {
      this.handleUnauthenticatedUser(currentRoute!)
    }
  }

  private handleAuthenticatedUser = (currentRoute: string): void => {
    removePreloader()
    if (currentRoute === '/' || currentRoute === '/sign-up') {
      appRouter.go('/messenger')
    }
  }

  private handleUnauthenticatedUser = (currentRoute: string): void => {
    removePreloader()
    if (currentRoute !== '/' && currentRoute !== '/sign-up') {
      appRouter.go('/')
    }
  }
}

export const authController = new AuthController()
