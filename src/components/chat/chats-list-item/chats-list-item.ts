import './chats-list-item.css'

import { Block, type BlockProps } from '@/core'
import { type CurrentChatState, currentChatStore, type Chat } from '@/stores'
import { formatTimestamp, getFilePath, getTemplate } from '@/utils'

import ChatsListItemTemplate from './chats-list-item.hbs?raw'

type ChatsListItemProps = BlockProps & {
  chat: Chat
}

export class ChatsListItem extends Block<ChatsListItemProps> {
  private id: number
  private storeUnsubscribe: () => void

  constructor(props: ChatsListItemProps) {
    super('li', {
      ...props,
      className: 'chat-list__item',
      events: {
        click: () => this.setCurrentChat()
      }
    })

    this.id = props.chat.id

    this.storeUnsubscribe = currentChatStore.subscribe(state => {
      const { currentChatId } = state as CurrentChatState

      if (currentChatId === this.id) {
        this.element?.classList.add('is-current')
      } else {
        this.element?.classList.remove('is-current')
      }
    })
  }

  private setCurrentChat(): void {
    currentChatStore.set({ currentChatId: this.id })
  }

  render(): string {
    const { id, avatar, title, last_message, unread_count } = this.props.chat
    console.log(this.props.chat)
    return getTemplate(ChatsListItemTemplate, {
      title,
      avatar: avatar ? getFilePath(avatar) : `https://robohash.org/${id}`,
      time: last_message ? formatTimestamp(last_message.time) : '',
      lastMessage: last_message ? last_message.content : '',
      unreadCount: unread_count
    })
  }

  protected onUnmount(): void {
    this.storeUnsubscribe()
  }
}
