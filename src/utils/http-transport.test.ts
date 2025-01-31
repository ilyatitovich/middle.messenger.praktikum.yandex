import { expect } from 'chai'
import { createSandbox, type SinonStub } from 'sinon'

import { HTTPTransport } from '../../src/utils/http-transport'

describe('HTTPTransport tests', () => {
  const sandbox = createSandbox()
  let http: HTTPTransport
  let request: SinonStub

  beforeEach(() => {
    http = new HTTPTransport('https://test-api.com')
    request = sandbox
      .stub(http, 'request' as keyof typeof http)
      .callsFake(() => Promise.resolve())
  })

  afterEach(() => {
    sandbox.restore()
  })

  it('should call request() once', async () => {
    await http.get('/test')
    expect(request.calledOnce).to.equal(true)
  })

  it('should call request() with correct URL', async () => {
    await http.get('/test')
    expect(request.firstCall.args[0]).to.equal('/test')
  })

  it('should format query parameters correctly', async () => {
    await http.get('/search', { data: { category: 'books', page: 2 } })
    expect(request.firstCall.args[0]).to.equal('/search?category=books&page=2')
  })

  it('should include headers in request', async () => {
    const headers = { Authorization: 'token' }
    await http.post('/test', { headers })
    expect(request.firstCall.args[1].headers).to.deep.equal(headers)
  })

  it('should call request() with method GET', async () => {
    await http.get('/test')
    expect(request.firstCall.args[1]).to.deep.include({ method: 'GET' })
  })

  it('should call request() with method POST', async () => {
    await http.post('/test')
    expect(request.firstCall.args[1]).to.deep.include({ method: 'POST' })
  })

  it('should call request() with body for POST', async () => {
    const body = { name: 'John' }
    await http.post('/test', { data: body })
    expect(request.firstCall.args[1].data).to.deep.equal(body)
  })

  it('should handle missing body for POST', async () => {
    await http.post('/test')
    expect(request.firstCall.args[1].data).to.equal(undefined)
  })

  it('should call request() with method PUT', async () => {
    await http.put('/test')
    expect(request.firstCall.args[1]).to.deep.include({ method: 'PUT' })
  })

  it('should call request() with method DELETE', async () => {
    await http.delete('/test')
    expect(request.firstCall.args[1]).to.deep.include({ method: 'DELETE' })
  })
})
