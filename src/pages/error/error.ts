import './error.css'

import { Block, type BlockProps } from '@/core'
import { getTemplate } from '@/utils'

import ErrorTemplate from './error.hbs?raw'

type ErrorPageProps = BlockProps & {
  code: 404 | 500
  description: string
}

export default class ErrorPage extends Block<ErrorPageProps> {
  constructor(props: ErrorPageProps) {
    super('main', { ...props, className: 'error-page' })
  }

  protected render(): string {
    const { code, description } = this.props
    return getTemplate(ErrorTemplate, { code, description })
  }
}
