import './chat-message.css'

import { Block, type BlockProps, type MessageResponse } from '@/core'
import { userStore } from '@/stores'
import { getFilePath, getTemplate } from '@/utils'

import ImageMessageTemplate from './chat-img-message.hbs?raw'
import TextMessageTemplate from './chat-text-message.hbs?raw'

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
    const { content, file } = this.props.message

    if (file) {
      return getTemplate(ImageMessageTemplate, {
        imgSrc: getFilePath(file.path),
        altText: file.filename
      })
    }

    return getTemplate(TextMessageTemplate, {
      text: content
    })
  }
}
