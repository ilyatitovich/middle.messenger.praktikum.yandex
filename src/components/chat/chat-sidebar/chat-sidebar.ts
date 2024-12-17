import './chat-sidebar.css'

import { ChatsList, type ChatsListProps } from '@/components/chat'
import { ChatSearchForm } from '@/components/forms'
import { Block, type BlockProps } from '@/core'
import { debounce, getTemplate, mockChats } from '@/utils'

import ChatSidebarTemplate from './chat-sidebar.hbs?raw'

type ChatSideBarProps = BlockProps

export class ChatSideBar extends Block<ChatSideBarProps> {
  private chatsList: ChatsList

  constructor(props: ChatSideBarProps = {}) {
    const searchForm = new ChatSearchForm({
      handleSearch: (e: Event) => this.search(e as InputEvent)
    })

    const chatsList = new ChatsList({ chats: mockChats })

    super('aside', {
      ...props,
      childBlocks: { searchForm, chatsList },
      className: 'chat-sidebar'
    })

    this.chatsList = chatsList
  }

  private search = debounce((e: InputEvent) => {
    const target = e.target as HTMLInputElement
    const filteredChatsList = mockChats.filter(chat =>
      chat.name.toLowerCase().includes(target.value.trim().toLowerCase())
    )
    this.chatsList.setProps<ChatsListProps>({ chats: filteredChatsList })
  }, 300)

  protected render(): string {
    return getTemplate(ChatSidebarTemplate)
  }
}
