import { Block, type BlockProps } from '@/core'
import {
  chatsStore,
  type ChatUsersState,
  chatUsersStore,
  getCurrentChat,
  userStore
} from '@/stores'
import { getDefaultAvatar, getFilePath, getTemplate } from '@/utils'

import CurrentChatDataTemplate from './current-chat-data.hbs?raw'

export type CurrentChatDataProps = BlockProps & {
  id?: number
  avatar?: string | null
  title?: string
  userNames?: string
}

export class CurrentChatData extends Block<CurrentChatDataProps> {
  private currentAvatar: string | null | undefined
  private chatsStoreUnsubscribe: () => void

  constructor(props: CurrentChatDataProps) {
    super('div', { ...props, className: 'chat-main__header-left' })

    this.currentAvatar = props.avatar

    this.storeUnsubscribe = chatUsersStore.subscribe(state => {
      const { user: currentUser } = userStore.get()
      const { users } = state as ChatUsersState

      const userNames = [...users]
        .reduce<string[]>((acc, user) => {
          const userName =
            user.id === currentUser!.id ? 'Вы' : user.display_name || user.login

          if (user.id === currentUser!.id) {
            acc.unshift(userName!)
          } else {
            acc.push(userName!)
          }

          return acc
        }, [])
        .join(', ')

      this.setProps<CurrentChatDataProps>({ userNames })
    })

    this.chatsStoreUnsubscribe = chatsStore.subscribe(() => {
      const chat = getCurrentChat()

      if (chat && this.currentAvatar !== chat.avatar) {
        this.setProps<CurrentChatDataProps>({ avatar: chat.avatar })
        this.currentAvatar = chat.avatar
      }
    })
  }

  protected render(): string {
    const { id, avatar, title, userNames } = this.props
    return getTemplate(CurrentChatDataTemplate, {
      avatar: avatar ? getFilePath(avatar) : getDefaultAvatar(id),
      title,
      userNames
    })
  }

  protected onUnmount(): void {
    this.chatsStoreUnsubscribe()
  }
}
