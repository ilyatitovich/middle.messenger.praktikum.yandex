import Handlebars from 'handlebars'
import {
  homePage,
  signInPage,
  signUpPage,
  profilePage,
  chatPage,
  errorPage
} from './pages'

import {
  profileAvatar,
  profileSidebar,
  userInfo,
  changeUserData,
  changeUserPassword,
  formField
} from './components'

import { mockUser } from './utils/mock-data'

type AppElement = HTMLElement | null

interface AppState {
  currentPage: string
}

Handlebars.registerPartial('profileSidebar', profileSidebar)
Handlebars.registerPartial('profileAvatar', profileAvatar)
Handlebars.registerPartial('userInfo', userInfo)
Handlebars.registerPartial('changeUserData', changeUserData)
Handlebars.registerPartial('changeUserPassword', changeUserPassword)
Handlebars.registerPartial('formField', formField)

Handlebars.registerHelper(
  'ifEquals',
  function (
    this: Record<string, unknown>,
    arg1: unknown,
    arg2: unknown,
    options: Handlebars.HelperOptions
  ) {
    return arg1 === arg2 ? options.fn(this) : options.inverse(this)
  }
)

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
    if (this.state.currentPage.startsWith('/profile')) {
      this.showPage(profilePage, {
        route: this.state.currentPage,
        user: mockUser as unknown as string
      })
      return
    }

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
    const template = Handlebars.compile(page)
    if (this.appElement) {
      this.appElement.innerHTML = template(props)
    }
  }
}
