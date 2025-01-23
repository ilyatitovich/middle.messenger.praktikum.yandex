import './error.css'

import { Link } from '@/components'
import { Block, type BlockProps } from '@/core'
import { getTemplate } from '@/utils'

import ErrorTemplate from './error.hbs?raw'

type Error500PageProps = BlockProps

export class Error500Page extends Block<Error500PageProps> {
  constructor(props: Error500PageProps = {}) {
    super('main', {
      ...props,
      className: 'error-page',
      childBlocks: {
        backChatsLink: new Link({
          to: '/messenger',
          className: 'error-page__link',
          content: 'Назад к чатам'
        })
      }
    })
  }

  protected render(): string {
    return getTemplate(ErrorTemplate, {
      code: 500,
      description: 'Мы уже фиксим'
    })
  }
}
