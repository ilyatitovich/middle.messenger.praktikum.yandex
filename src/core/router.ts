import { Block } from './block'

type RouteProps = {
  rootQuery: string
}

type BlockConstructor = new () => Block

export class Route {
  private pathname: string
  private blockClass: BlockConstructor
  private block: Block | null = null
  private props: RouteProps

  constructor(pathname: string, view: BlockConstructor, props: RouteProps) {
    this.pathname = pathname
    this.blockClass = view
    this.props = props
  }

  navigate(pathname: string): void {
    if (this.match(pathname)) {
      this.pathname = pathname
      this.render()
    }
  }

  leave(): void {
    if (this.block) {
      this.block.unmount()
    }
  }

  match(pathname: string): boolean {
    return pathname === this.pathname
  }

  render(): void {
    this.block = new this.blockClass()

    const root = document.getElementById(this.props.rootQuery)
    const page = this.block.getContent()

    if (root && page) {
      root.appendChild(page)
    }
  }

  getPathname(): string {
    return this.pathname
  }
}

export class Router {
  private static instance: Router
  private routes: Route[] = []
  private history: History = window.history
  private currentRoute: Route | null = null
  private rootQuery: string | undefined
  private checkAuth?: () => Promise<void>

  constructor(rootQuery: string, checkAuth?: () => Promise<void>) {
    if (Router.instance) {
      return Router.instance
    }

    this.checkAuth = checkAuth
    this.rootQuery = rootQuery
    Router.instance = this
  }

  use(pathname: string, block: BlockConstructor): this {
    const route = new Route(pathname, block, { rootQuery: this.rootQuery! })
    this.routes.push(route)
    return this
  }

  start(): void {
    window.onpopstate = () => {
      const { pathname } = window.location
      this._onRoute(pathname)
    }
    this._onRoute(window.location.pathname)
  }

  go(pathname: string): void {
    this.history.pushState({}, '', pathname)
    this._onRoute(pathname)
  }

  back(): void {
    this.history.back()
  }

  forward(): void {
    this.history.forward()
  }

  private _onRoute(pathname: string): void {
    const route = this.getRoute(pathname)
    if (!route) {
      this._onRoute('/404')
      return
    }

    if (this.currentRoute === route) {
      return
    }

    if (this.currentRoute) {
      this.currentRoute.leave()
    }

    this.currentRoute = route

    if (this.checkAuth) {
      this.checkAuth()
    }

    route.render()
  }

  getRoute(pathname: string): Route | undefined {
    return this.routes.find(route => route.match(pathname))
  }

  getCurrentRoute(): string | undefined {
    return this.currentRoute?.getPathname()
  }
}
