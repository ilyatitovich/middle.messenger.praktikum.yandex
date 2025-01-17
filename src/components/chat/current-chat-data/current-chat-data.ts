import { Block, type BlockProps } from '@/core'
import { getFilePath, getTemplate } from '@/utils'

import CurrentChatDataTemplate from './current-chat-data.hbs?raw'

export type CurrentChatDataProps = BlockProps & {
  id?: number
  avatar?: string | null
  title?: string
}

export class CurrentChatData extends Block<CurrentChatDataProps> {
  constructor(props: CurrentChatDataProps) {
    super('div', { ...props, className: 'chat-main__header-left' })
  }

  protected render(): string {
    const { id, avatar, title } = this.props
    return getTemplate(CurrentChatDataTemplate, {
      avatar: avatar ? getFilePath(avatar) : `https://robohash.org/${id}`,
      title
    })
  }
}
