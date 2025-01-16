import './error.css'

import { Link } from '@/components'
import { Block, type BlockProps } from '@/core'
import { getTemplate } from '@/utils'

import ErrorTemplate from './error.hbs?raw'

type Error404PageProps = BlockProps

export class Error404Page extends Block<Error404PageProps> {
  constructor(props: Error404PageProps = {}) {
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
      code: 404,
      description: 'Не туда попали'
    })
  }
}
