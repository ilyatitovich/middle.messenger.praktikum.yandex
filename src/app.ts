import { compile } from 'handlebars'
import {
  homePage,
  signInPage,
  signUpPage,
  profilePage,
  chatPage,
  errorPage
} from './pages'

type AppElement = HTMLElement | null

interface AppState {
  currentPage: string
}

export default class App {
  private state: AppState
  private appElement: AppElement

  constructor() {
    this.state = {
      currentPage: window.location.pathname
    }
    this.appElement = document.getElementById('app')
  }

  render(): void {
    switch (this.state.currentPage) {
      case '/':
        this.showPage(homePage)
        break
      case '/signin':
        this.showPage(signInPage)
        break
      case '/signup':
        this.showPage(signUpPage)
        break
      case '/profile':
        this.showPage(profilePage)
        break
      case '/chat':
        this.showPage(chatPage)
        break
      case '/500':
        this.showPage(errorPage, {
          title: '500',
          description: 'Мы уже фиксим'
        })
        break
      default:
        this.showPage(errorPage, {
          title: '404',
          description: 'Не туда попали'
        })
        break
    }
  }

  changePage(page: string): void {
    this.state.currentPage = page
    this.render()
  }

  showPage(page: string, props: Record<string, string> = {}): void {
    const template = compile(page)
    if (this.appElement) {
      this.appElement.innerHTML = template(props)
    }
  }
}
