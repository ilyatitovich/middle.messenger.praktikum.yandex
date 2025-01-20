import { authController } from '@/controllers'
import { Router } from '@/core'

import {
  SignInPage,
  SignUpPage,
  Error404Page,
  Error500Page,
  ChatPage,
  SettingsPage,
  ChangeDataPage,
  ChangePasswordPage
} from './pages'

export const appRouter = new Router('app', authController.checkAuth)

export default class App {
  private router: Router = appRouter

  constructor() {
    this.initApp()
  }

  private initApp(): void {
    this.router
      .use('/', SignInPage)
      .use('/sign-up', SignUpPage)
      .use('/settings', SettingsPage)
      .use('/settings/change-data', ChangeDataPage)
      .use('/settings/change-password', ChangePasswordPage)
      .use('/messenger', ChatPage)
      .use('/404', Error404Page)
      .use('/500', Error500Page)
      .start()
  }
}
