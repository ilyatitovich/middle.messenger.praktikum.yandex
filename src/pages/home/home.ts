import './home.css'

import { Block, type BlockProps } from '@/core'
import { getTemplate } from '@/utils'

import HomeTemplate from './home.hbs?raw'

type HomePageProps = BlockProps

export default class HomePage extends Block<HomePageProps> {
  constructor(props: HomePageProps = {}) {
    super('main', { ...props, className: 'home' })
  }

  protected render(): string {
    return getTemplate(HomeTemplate)
  }
}
