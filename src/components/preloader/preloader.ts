import './preloader.css'

import { Block, BlockProps } from '@/core'
import { getTemplate } from '@/utils'

import PreloaderTemplate from './preloader.hbs?raw'

type PreloaderProps = BlockProps

class Preloader extends Block<PreloaderProps> {
  constructor(props: PreloaderProps = {}) {
    super('div', { ...props, className: 'preloader' })
  }

  protected render(): string {
    return getTemplate(PreloaderTemplate)
  }
}

let preloader: Preloader

export function showPreloader(): void {
  preloader = new Preloader()
  const preloaderContent = preloader.getContent()

  if (preloaderContent) {
    document.body.append(preloaderContent)
  }
}

export function removePreloader(): void {
  if (preloader) {
    preloader.unmount()
  }
}
