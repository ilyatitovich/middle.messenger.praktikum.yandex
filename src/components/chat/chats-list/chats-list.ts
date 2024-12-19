import './chats-list.css'

import { ChatsListItem } from '@/components/chat'
import { Block, type BlockProps } from '@/core'
import type { Chat } from '@/utils'

export type ChatsListProps = BlockProps & {
  chats: Chat[]
}

export class ChatsList extends Block<ChatsListProps> {
  constructor(props: ChatsListProps) {
    super('ul', {
      ...props,
      className: 'chats-list',
      childBlocksList: props.chats.map(chat => {
        return new ChatsListItem({ chat })
      })
    })
  }

  protected componentDidUpdate(
    _oldProps: ChatsListProps,
    newProps: ChatsListProps
  ): boolean {
    ;(this.childBlocksList as ChatsListItem[]).forEach(
      (chatBlock: ChatsListItem) => {
        if (newProps.chats.some(chat => chat.id === chatBlock.id)) {
          chatBlock.show()
        } else {
          chatBlock.hide()
        }
      }
    )

    return false
  }
}
