import { Block } from '@/core'

import {
  HomePage,
  SignInPage,
  SignUpPage,
  ProfilePage,
  ErrorPage,
  ChatPage
} from './pages'

type AppElement = HTMLElement | null

interface AppState {
  route: string
}

export default class App {
  private state: AppState
  private appElement: AppElement

  constructor() {
    this.state = {
      route: window.location.pathname
    }
    this.appElement = document.getElementById('app')
  }

  render(): void {
    if (this.state.route.startsWith('/chat')) {
      this.showPage(new ChatPage())
      return
    }

    switch (this.state.route) {
      case '/':
        this.showPage(new HomePage())
        break
      case '/signin':
        this.showPage(new SignInPage())
        break
      case '/signup':
        this.showPage(new SignUpPage())
        break
      case '/profile':
        this.showPage(new ProfilePage())
        break
      case '/profile/change-password':
        this.showPage(new ProfilePage())
        break
      case '/profile/change-data':
        this.showPage(new ProfilePage())
        break
      case '/500':
        this.showPage(
          new ErrorPage({ code: 500, description: 'Мы уже фиксим' })
        )
        break
      default:
        this.showPage(
          new ErrorPage({ code: 404, description: 'Не туда попали' })
        )
        break
    }
  }

  showPage(Page: Block): void {
    const pageContent = Page.getContent()

    if (this.appElement && pageContent) {
      this.appElement.appendChild(pageContent)
    }
  }
}
