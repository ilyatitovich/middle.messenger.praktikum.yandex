import { compile } from 'handlebars'
import {
  homePage,
  loginPage,
  signinPage,
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
      case 'login':
        this.showPage(loginPage)
        break
      case 'signin':
        this.showPage(signinPage)
        break
      case 'profile':
        this.showPage(profilePage)
        break
      case 'chat':
        this.showPage(chatPage)
        break
      default:
        this.showPage(errorPage, {
          title: '404',
          description: 'Не туда попали'
        })
        break
    }

    this.attachEventListeners()
  }

  attachEventListeners(): void {
    const links: NodeListOf<HTMLAnchorElement> = document.querySelectorAll('a')

    links.forEach((link: HTMLAnchorElement) => {
      link.addEventListener('click', (e: MouseEvent) => {
        e.preventDefault()

        const page = link.getAttribute('href')
        if (page) {
          this.changePage(page)
        }
      })
    })
  }

  changePage(page: string): void {
    this.state.currentPage = page
    this.render()
  }

  showPage(page: string, props: Record<string, string> = {}): void {
    const template = compile(page)
    this.appElement!.innerHTML = template(props)
  }
}
