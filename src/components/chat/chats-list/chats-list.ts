import './chats-list.css'

import { ChatsListItem } from '@/components/chat'
import { chatsController } from '@/controllers/chats-controller'
import { Block, type BlockProps } from '@/core'
import { type ChatsState, type Chat, chatsStore } from '@/stores'

export type ChatsListProps = BlockProps & {
  chats: Chat[] | null
}

export class ChatsList extends Block<ChatsListProps> {
  private refetchInterval: NodeJS.Timeout | null = null

  constructor(props: ChatsListProps = { chats: chatsStore.get().chatsList }) {
    const childBlocksList = props.chats
      ? props.chats.map(chat => {
          return new ChatsListItem({ chat })
        })
      : undefined
    super('ul', {
      ...props,
      className: 'chats-list',
      childBlocksList
    })

    if (!props.chats) {
      chatsController.getChats()
    }

    this.startChatsRefetch()

    this.storeUnsubscribe = chatsStore.subscribe(state => {
      const { chatsList: chats } = state as ChatsState
      this.setProps<ChatsListProps>({ chats })
    })
  }

  private startChatsRefetch(): void {
    console.log('start')
    if (this.refetchInterval) {
      clearInterval(this.refetchInterval)
    }

    this.refetchInterval = setInterval(() => {
      chatsController.getChats()
    }, 5000)
  }

  private stopChatsRefetch(): void {
    console.log('stop ')
    if (this.refetchInterval) {
      clearInterval(this.refetchInterval)
      this.refetchInterval = null
    }
  }

  protected componentDidUpdate(
    _oldProps: ChatsListProps,
    newProps: ChatsListProps
  ): boolean {
    const { chats } = newProps

    if (!chats) {
      return false
    }

    this.childBlocksList?.forEach(chat => chat.unmount())

    this.childBlocksList = chats.map(chat => {
      return new ChatsListItem({ chat })
    })

    return true
  }

  protected onUnmount(): void {
    this.stopChatsRefetch()
  }
}
