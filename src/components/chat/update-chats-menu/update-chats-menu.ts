import './update-chats-menu.css'

import { ActionMenu, Button, Modal, showRequestResult } from '@/components'
import {
  DeleteUsersForm,
  UpdateChatsForm,
  FileUploadForm
} from '@/components/forms'
import { chatsController } from '@/controllers'
import { Block, type BlockProps } from '@/core'
import { chatUsersStore, currentChatStore, userStore } from '@/stores'
import { getTemplate, isValidLogin } from '@/utils'

import UpdateChatsMenuIcon from './update-chats-menu-icon.hbs?raw'
import UpdateChatsMenuTemplate from './update-chats-menu.hbs?raw'

type UpdateChatsMenuProps = BlockProps

export class UpdateChatsMenu extends Block<UpdateChatsMenuProps> {
  private menu: ActionMenu
  private modal: Modal | null = null

  constructor(props: UpdateChatsMenuProps = {}) {
    const menu = new ActionMenu({
      className: 'update-chats-menu is-hidden',
      childBlocksList: [
        new Button({
          className: 'update-chats-menu__action_button',
          label: 'Добавить участника',
          events: {
            click: () => this.openAddUserModal()
          }
        }),

        new Button({
          className: 'update-chats-menu__action_button',
          label: 'Удалить участника',
          events: {
            click: () => this.openDeleteUserModal()
          }
        }),

        new Button({
          className: 'update-chats-menu__action_button',
          label: 'Обновить аватар чата',
          events: {
            click: () => this.openUpdateChatAvatarModal()
          }
        }),

        new Button({
          className: 'update-chats-menu__action_button is-danger',
          label: 'Удалить чат',
          events: {
            click: () => this.deleteChat()
          }
        })
      ],
      events: {
        mouseleave: () => this.menu.hide()
      }
    })

    super('div', {
      ...props,
      className: 'update-chats-menu__container',
      childBlocks: {
        button: new Button({
          className: 'update-chats-menu__button',
          icon: UpdateChatsMenuIcon,
          events: {
            click: () => this.doIfAdmin(() => this.menu.show())
          }
        }),
        menu
      }
    })

    this.menu = menu
  }

  private openAddUserModal(): void {
    this.menu.hide()
    this.modal = new Modal({
      content: new UpdateChatsForm({
        title: 'Добавить участника',
        inputLabel: 'Логин пользователя',
        submitButtonLabel: 'Добавить',
        validate: isValidLogin,
        handleUpdate: login => this.addUser(login),
        handleCancel: () => this.closeModal()
      })
    })

    const modalContent = this.modal.getContent()

    if (modalContent) {
      document.body.append(modalContent)
    }
  }

  private openDeleteUserModal(): void {
    this.menu.hide()
    this.modal = new Modal({
      content: new DeleteUsersForm({
        users: chatUsersStore.get().users,
        handleCancel: () => this.closeModal()
      })
    })

    const modalContent = this.modal.getContent()

    if (modalContent) {
      document.body.append(modalContent)
    }
  }

  private openUpdateChatAvatarModal(): void {
    this.menu.hide()
    this.modal = new Modal({
      content: new FileUploadForm({
        title: 'Загрузите аватар',
        handleCancel: () => this.closeModal(),
        handleUploadFile: (file: File) => this.updateChatAvatar(file)
      })
    })

    const modalContent = this.modal.getContent()

    if (modalContent) {
      document.body.append(modalContent)
    }
  }

  private closeModal(): void {
    if (this.modal) {
      this.modal.unmount()
    }
  }

  private async addUser(login: string): Promise<void> {
    chatsController.addUser({ login })
  }

  private deleteChat(): void {
    const { currentChatId } = currentChatStore.get()
    chatsController.deleteChat({ chatId: currentChatId as number })
  }

  private doIfAdmin(callback: () => void): void {
    const { user } = userStore.get()
    const { users: chatUsers } = chatUsersStore.get()

    if (!user) {
      console.error('Пользователь не найден')
      return
    }

    const chatUser = chatUsers.find(({ id }) => id === user.id)

    if (!chatUser) {
      console.error('Пользователь не найден в чате')
      return
    }

    if (chatUser.role !== 'admin') {
      showRequestResult(false, 'Нет прав редактировать чат')
      return
    }

    callback()
  }

  private async updateChatAvatar(file: File): Promise<void> {
    const formData = new FormData()
    const { currentChatId } = currentChatStore.get()

    formData.append('chatId', String(currentChatId))
    formData.append('avatar', file)

    await chatsController.updateChatAvatar(formData)
    this.closeModal()
  }

  protected render(): string {
    return getTemplate(UpdateChatsMenuTemplate)
  }
}
