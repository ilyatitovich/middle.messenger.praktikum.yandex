import { Block, type BlockProps } from '@/core'
import { getTemplate } from '@/utils'

import ErrorMessageTemplate from './error-message.hbs?raw'

export type ErrorMessageProps = BlockProps & {
  message?: string
  isHidden?: boolean
}

export class ErrorMessage extends Block<ErrorMessageProps> {
  constructor(props: ErrorMessageProps) {
    super('span', props)
  }

  protected render(): string {
    const { isHidden, message } = this.props
    return getTemplate(ErrorMessageTemplate, {
      isHidden: isHidden ?? true,
      message: message
    })
  }
}
