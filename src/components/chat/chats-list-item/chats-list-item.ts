import './chats-list-item.css'

import { Block, type BlockProps } from '@/core'
import {
  type CurrentChatState,
  currentChatStore,
  type Chat,
  userStore
} from '@/stores'
import { formatTimestamp, getFilePath, getTemplate } from '@/utils'

import ChatsListItemTemplate from './chats-list-item.hbs?raw'

type ChatsListItemProps = BlockProps & {
  chat: Chat
}

export class ChatsListItem extends Block<ChatsListItemProps> {
  private id: number

  constructor(props: ChatsListItemProps) {
    const { currentChatId } = currentChatStore.get()
    const isCurrentChat = currentChatId === props.chat.id
    super('li', {
      ...props,
      className: `chat-list__item ${isCurrentChat ? 'is-current' : ''}`,
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

  protected render(): string {
    const { id, avatar, title, last_message, unread_count } = this.props.chat

    const { user: currentUser } = userStore.get()

    let lastMessage: string = ''
    let author: string | undefined = ''

    if (last_message) {
      const { content, user } = last_message
      author = currentUser?.login === user.login ? 'Вы' : user.login
      lastMessage = isNaN(parseInt(content)) ? content : 'Файл'
    }

    return getTemplate(ChatsListItemTemplate, {
      title,
      avatar: avatar ? getFilePath(avatar) : `https://robohash.org/${id}`,
      time: last_message ? formatTimestamp(last_message.time) : '',
      author,
      lastMessage,
      unreadCount: unread_count
    })
  }
}
