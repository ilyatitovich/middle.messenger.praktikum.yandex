import Handlebars from 'handlebars'

import {
  profileAvatar,
  profileSidebar,
  userData,
  changeUserData,
  changeUserPassword,
  userFormField
} from './components'
import {
  homePage,
  signInPage,
  signUpPage,
  profilePage,
  chatPage,
  errorPage
} from './pages'
import { mockUser } from './utils/mock-data'

type AppElement = HTMLElement | null

interface AppState {
  route: string
}

Handlebars.registerPartial('profileSidebar', profileSidebar)
Handlebars.registerPartial('profileAvatar', profileAvatar)
Handlebars.registerPartial('userData', userData)
Handlebars.registerPartial('changeUserData', changeUserData)
Handlebars.registerPartial('changeUserPassword', changeUserPassword)
Handlebars.registerPartial('userFormField', userFormField)

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
      route: window.location.pathname
    }
    this.appElement = document.getElementById('app')
  }

  render(): void {
    switch (this.state.route) {
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
      case '/profile':
        this.showPage(profilePage, {
          route: '/profile',
          user: mockUser
        })
        break
      case '/profile/change-password':
        this.showPage(profilePage, {
          route: '/profile/change-password',
          user: mockUser
        })
        break
      case '/profile/change-data':
        this.showPage(profilePage, {
          route: '/profile/change-data',
          user: mockUser
        })
        break
      case '/500':
        this.showPage(errorPage, {
          code: '500',
          description: 'Мы уже фиксим'
        })
        break
      default:
        this.showPage(errorPage, {
          code: '404',
          description: 'Не туда попали'
        })
        break
    }
  }

  showPage(page: string, props: Record<string, unknown> = {}): void {
    const template = Handlebars.compile(page)
    if (this.appElement) {
      this.appElement.innerHTML = template(props)
    }
  }
}
