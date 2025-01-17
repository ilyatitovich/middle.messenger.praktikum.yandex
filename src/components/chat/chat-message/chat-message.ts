import './chat-message.css'

import { Block, type BlockProps, type MessageResponse } from '@/core'
import { userStore } from '@/stores'
import { getTemplate } from '@/utils'

import MessageTemplate from './chat-message.hbs?raw'

export type ChatMessageProps = BlockProps & {
  message: MessageResponse
}

export class ChatMessage extends Block<ChatMessageProps> {
  constructor(props: ChatMessageProps) {
    const { user } = userStore.get()
    super('div', {
      ...props,
      className: `message ${props.message.user_id === user!.id ? 'right' : 'left'}`
    })
  }

  protected render(): string {
    return getTemplate(MessageTemplate, { text: this.props.message.content })
  }
}
