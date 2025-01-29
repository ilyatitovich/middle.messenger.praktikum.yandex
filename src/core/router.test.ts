/* eslint-disable @typescript-eslint/no-unused-expressions */
import { expect } from 'chai'
import sinon from 'sinon'

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
  let route: Route

  beforeEach(() => {
    route = new Route('/home', Page, { rootQuery: 'app' })
  })

  afterEach(() => {
    const page = document.getElementById('page')

    if (page) {
      route.leave()
    }
  })

  it('should initialize with correct pathname and props', () => {
    expect(route.getPathname()).to.equal('/home')
  })

  it('should match the correct pathname', () => {
    expect(route.match('/home')).to.be.true
    expect(route.match('/about')).to.be.false
  })

  it('should navigate and render if the pathname matches', () => {
    const renderSpy = sinon.spy(route, 'render')

    route.navigate('/home')

    expect(route.getPathname()).to.equal('/home')
    expect(renderSpy.calledOnce).to.be.true
  })

  it('should not navigate if the pathname does not match', () => {
    const renderSpy = sinon.spy(route, 'render')

    route.navigate('/about')

    expect(route.getPathname()).to.equal('/home')
    expect(renderSpy.called).to.be.false
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
    const unmountSpy = sinon.spy(block!, 'unmount')

    route.leave()

    expect(unmountSpy.calledOnce).to.be.true
  })
})

describe('Router tests', () => {
  const checkAuth = sinon.fake.resolves(undefined)
  const spySandbox = sinon.createSandbox()

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

    expect(checkAuth.called).to.be.true
  })

  it('should navigate with go()', () => {
    expect(router.getCurrentRoute()).equal('/')

    router.go('/home')
    expect(router.getCurrentRoute()).equal('/home')

    router.go('/about')
    expect(router.getCurrentRoute()).equal('/about')
  })

  it('should call window.history.back()', () => {
    const spy = spySandbox.spy(window.history, 'back')

    router.back()

    expect(spy.calledOnce).to.be.true
  })

  it('should call window.history.forward()', () => {
    const spy = spySandbox.spy(window.history, 'forward')

    router.forward()

    expect(spy.calledOnce).to.be.true
  })

  it('should return the current route', () => {
    router.go('/home')

    expect(router.getCurrentRoute()).to.equal('/home')
  })

  it('should handle unknown routes by redirecting to /404', () => {
    router.go('/home')
    router.go('/unknown')

    expect(router.getCurrentRoute()).equal('/404')
  })
})
