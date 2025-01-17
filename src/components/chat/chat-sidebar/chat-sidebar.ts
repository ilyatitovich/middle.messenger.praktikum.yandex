import './chat-sidebar.css'

import { Link, Button, Modal } from '@/components'
import { ChatsList, type ChatsListProps } from '@/components/chat'
import { ChatSearchForm, UpdateChatsForm } from '@/components/forms'
import { chatsController } from '@/controllers'
import { Block, type BlockProps } from '@/core'
import { chatsStore } from '@/stores'
import { debounce, getTemplate, isValidChatName } from '@/utils'

import ChatSidebarTemplate from './chat-sidebar.hbs?raw'

type ChatSideBarProps = BlockProps

export class ChatSideBar extends Block<ChatSideBarProps> {
  private chatsList: ChatsList
  private modal: Modal | null = null

  constructor(props: ChatSideBarProps = {}) {
    const settingsLink = new Link({
      to: '/settings',
      className: 'chat-sidebar__nav-link',
      content: 'Профиль'
    })

    const searchForm = new ChatSearchForm({
      handleSearch: (e: Event) => this.search(e as InputEvent)
    })

    const chatsList = new ChatsList()

    const createChatButton = new Button({
      events: {
        click: () => this.openModal()
      },
      label: 'Добавить чат',
      className: 'chat-sidebar__create-buttton'
    })

    super('aside', {
      ...props,
      childBlocks: {
        settingsLink,
        searchForm,
        chatsList,
        createChatButton
      },
      className: 'chat-sidebar'
    })

    this.chatsList = chatsList
  }

  private async addChat(title: string): Promise<void> {
    return chatsController.addChat({ title })
  }

  private search = debounce((e: InputEvent) => {
    const target = e.target as HTMLInputElement
    const filteredChatsList = chatsStore
      .get()
      .chatsList.filter(chat =>
        chat.title.toLowerCase().includes(target.value.trim().toLowerCase())
      )
    this.chatsList.setProps<ChatsListProps>({ chats: filteredChatsList })
  }, 300)

  private openModal(): void {
    this.modal = new Modal({
      content: new UpdateChatsForm({
        title: 'Новый чат',
        validate: isValidChatName,
        inputLabel: 'Название чата',
        submitButtonLabel: 'Добавить чат',
        handleCancel: () => this.hideModal(),
        handleUpdate: title => this.addChat(title)
      })
    })

    const modalContent = this.modal.getContent()
    if (modalContent) {
      document.body.append(modalContent)
    }
  }

  private hideModal(): void {
    if (this.modal) {
      this.modal.unmount()
    }
  }

  protected render(): string {
    return getTemplate(ChatSidebarTemplate)
  }
}
