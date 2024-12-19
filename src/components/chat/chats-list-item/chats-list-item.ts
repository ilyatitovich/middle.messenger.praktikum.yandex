import './chats-list-item.css'

import { Block, type BlockProps } from '@/core'
import { formatTimestamp, getTemplate, type Chat } from '@/utils'

import ChatsListItemTemplate from './chats-list-item.hbs?raw'

type ChatsListItemProps = BlockProps & {
  chat: Chat
}

export class ChatsListItem extends Block<ChatsListItemProps> {
  id: string

  constructor(props: ChatsListItemProps) {
    const currentChat = window.location.pathname.split('/').at(-1)

    super('li', {
      ...props,
      className: `chat-list__item ${currentChat === props.chat.id ? 'is-current' : ''}`
    })

    const { chat } = props

    this.id = chat.id
  }

  render(): string {
    const { id, name, avatar, timestamp, lastMessage } = this.props.chat
    return getTemplate(ChatsListItemTemplate, {
      id,
      name,
      avatar,
      timestamp: formatTimestamp(timestamp),
      lastMessage
    })
  }
}
