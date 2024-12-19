import './chat-message.css'

import { Block, type BlockProps } from '@/core/block'
import { getTemplate, type Message } from '@/utils'

import MessageTemplate from './chat-message.hbs?raw'

type ChatMessageProps = BlockProps & {
  message: Message
}

export class ChatMessage extends Block<ChatMessageProps> {
  constructor(props: ChatMessageProps) {
    super('div', {
      ...props,
      className: `message ${props.message.sender === 'me' ? 'right' : 'left'}`
    })
  }

  protected render(): string {
    return getTemplate(MessageTemplate, { text: this.props.message.text })
  }
}
