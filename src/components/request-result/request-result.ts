import './request-result.css'

import { Block, BlockProps } from '@/core'
import { getTemplate } from '@/utils'

import RequestResultTemplate from './request-result.hbs?raw'

type RequestResultProps = BlockProps & {
  isOk: boolean
  message: string
}

class RequestResult extends Block<RequestResultProps> {
  constructor(props: RequestResultProps) {
    super('div', {
      ...props,
      className: `request-result ${props.isOk ? 'is-success' : 'is-danger'}`
    })
  }

  protected componentDidMount(): void {
    setTimeout(() => {
      this.unmount()
    }, 7000)
  }

  protected render(): string {
    return getTemplate(RequestResultTemplate, { message: this.props.message })
  }
}

export function showRequestResult(isOk: boolean, message: string): void {
  const requestResult = new RequestResult({ isOk, message })
  window.scrollTo({ top: 0 })
  document.body.append(requestResult.getContent()!)
}
