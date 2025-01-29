import { JSDOM } from 'jsdom'
import { register } from 'node:module'
import { pathToFileURL } from 'node:url'

register('ts-node/esm', pathToFileURL('./'))

const { window } = new JSDOM(
  '<!doctype html><html><body><div id="app"></div></body></html>',
  {
    url: 'https://y-chat.com'
  }
)
global.window = window
global.document = window.document
global.HTMLElement = window.HTMLElement

// Mocking requestAnimationFrame
global.requestAnimationFrame = callback => {
  return setTimeout(callback, 0)
}
