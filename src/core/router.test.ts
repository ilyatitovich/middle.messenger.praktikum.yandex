import { expect } from 'chai'
import { createSandbox, fake } from 'sinon'

import { Block, type BlockProps } from './block'
import { Route, Router } from './router'

class Page extends Block<BlockProps> {
  constructor(props: BlockProps = {}) {
    super('main', props)
  }

  protected render(): string {
    return '<div id="page">Page Content</div>'
  }
}

describe('Route tests', () => {
  const sandbox = createSandbox()
  let route: Route

  beforeEach(() => {
    route = new Route('/home', Page, { rootQuery: 'app' })
  })

  afterEach(() => {
    sandbox.restore()
    const page = document.getElementById('page')

    if (page) {
      route.leave()
    }
  })

  it('should initialize with correct pathname and props', () => {
    expect(route.getPathname()).to.equal('/home')
  })

  it('should match the correct pathname', () => {
    expect(route.match('/home')).to.equal(true)
    expect(route.match('/about')).to.equal(false)
  })

  it('should navigate and render if the pathname matches', () => {
    const renderSpy = sandbox.spy(route, 'render')

    route.navigate('/home')

    expect(route.getPathname()).to.equal('/home')
    expect(renderSpy.calledOnce).to.equal(true)
  })

  it('should not navigate if the pathname does not match', () => {
    const renderSpy = sandbox.spy(route, 'render')

    route.navigate('/about')

    expect(route.getPathname()).to.equal('/home')
    expect(renderSpy.called).to.equal(false)
  })

  it('should render block correctly', () => {
    route.render()

    const root = document.getElementById('app')
    expect(root?.childNodes.length).to.equal(1)
    expect(root?.childNodes[0].textContent).to.equal('Page Content')
  })

  it('should call unmount when leaving', () => {
    route.render()
    const block = route['block']
    const unmountSpy = sandbox.spy(block!, 'unmount')

    route.leave()

    expect(unmountSpy.calledOnce).to.equal(true)
  })
})

describe('Router tests', () => {
  const checkAuth = fake.resolves(undefined)
  const spySandbox = createSandbox()

  let router: Router

  beforeEach(() => {
    router = new Router('app', checkAuth)
    router
      .use('/', Page)
      .use('/home', Page)
      .use('/about', Page)
      .use('/404', Page)
  })

  afterEach(() => {
    router.go('/')
    spySandbox.restore()
  })

  it('should register routes with use()', () => {
    expect(router.getRoute('/')).to.be.instanceOf(Route)
    expect(router.getRoute('/home')).to.be.instanceOf(Route)
    expect(router.getRoute('/about')).to.be.instanceOf(Route)
    expect(router.getRoute('/404')).to.be.instanceOf(Route)
  })

  it('should call checkAuth()', () => {
    router.go('/about')

    expect(checkAuth.called).to.equal(true)
  })

  it('should navigate with go()', () => {
    expect(router.getCurrentRoute()).to.equal('/')

    router.go('/home')
    expect(router.getCurrentRoute()).to.equal('/home')

    router.go('/about')
    expect(router.getCurrentRoute()).to.equal('/about')
  })

  it('should call window.history.back()', () => {
    const spy = spySandbox.spy(window.history, 'back')

    router.back()

    expect(spy.calledOnce).to.equal(true)
  })

  it('should call window.history.forward()', () => {
    const spy = spySandbox.spy(window.history, 'forward')

    router.forward()

    expect(spy.calledOnce).to.equal(true)
  })

  it('should return the current route', () => {
    router.go('/home')

    expect(router.getCurrentRoute()).to.equal('/home')
  })

  it('should handle unknown routes by redirecting to /404', () => {
    router.go('/home')
    router.go('/unknown')

    expect(router.getCurrentRoute()).to.equal('/404')
  })
})
