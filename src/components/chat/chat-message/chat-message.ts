import './chat-message.css'

import { Block, type BlockProps, type MessageResponse } from '@/core'
import { chatUsersStore, userStore } from '@/stores'
import {
  formatTimestamp,
  getDefaultAvatar,
  getFilePath,
  getTemplate
} from '@/utils'

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
    const { users: chatUsers } = chatUsersStore.get()
    const { user_id, content, file, time } = this.props.message

    const author = chatUsers.find(user => user.id === user_id)

    const fileProps = file
      ? { imgSrc: getFilePath(file.path), altText: file.filename }
      : { imgSrc: '', altText: '' }

    const authorProps = {
      avatar: author?.avatar
        ? getFilePath(author.avatar)
        : getDefaultAvatar(user_id),
      userName: author?.display_name || author?.login || 'Unknown'
    }

    return getTemplate(MessageTemplate, {
      ...authorProps,
      text: content,
      time: formatTimestamp(time),
      ...fileProps
    })
  }
}
