import './chat-main-empty.css'

import { Block, type BlockProps } from '@/core'
import { getTemplate } from '@/utils'

import ChatMainEmptyTemplate from './chat-main-empty.hbs?raw'

type ChatMainEmptyProps = BlockProps

export class ChatMainEmpty extends Block<ChatMainEmptyProps> {
  constructor(props: ChatMainEmptyProps = {}) {
    super('section', {
      ...props,
      className: 'chat-main-empty'
    })
  }

  protected render(): string {
    return getTemplate(ChatMainEmptyTemplate)
  }
}
