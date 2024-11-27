import { compile } from 'handlebars'
import {
  error404Page,
  homePage,
  loginPage,
  signinPage,
  profilePage,
  chatPage
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
      currentPage: '/'
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
        this.showPage(error404Page)
        break
    }

    this.attachEventListeners()
  }

  attachEventListeners(): void {
    const links: NodeListOf<HTMLAnchorElement> = document.querySelectorAll('a')

    links.forEach((link: HTMLAnchorElement) => {
      link.addEventListener('click', (e: MouseEvent) => {
        e.preventDefault()

        const target = e.target as HTMLAnchorElement

        const page = target.dataset.page
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

  showPage(page: string, options: Record<string, string> = {}): void {
    const template = compile(page)
    this.appElement!.innerHTML = template(options)
  }
}
