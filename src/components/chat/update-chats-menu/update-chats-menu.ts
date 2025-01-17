import './update-chats-menu.css'

import { ActionMenu, Button, Modal } from '@/components'
import { UpdateChatsForm } from '@/components/forms'
import { chatsController } from '@/controllers'
import { Block, type BlockProps } from '@/core'
import { currentChatStore } from '@/stores'
import { getTemplate, isValidLogin } from '@/utils'

import UpdateChatsMenuIcon from './update-chats-menu-icon.hbs?raw'
import UpdateChatsMenuTemplate from './update-chats-menu.hbs?raw'

type UpdateChatsMenuProps = BlockProps

export class UpdateChatsMenu extends Block<UpdateChatsMenuProps> {
  private menu: ActionMenu
  private modal: Modal | null = null

  constructor(props: UpdateChatsMenuProps = {}) {
    const menu = new ActionMenu({
      className: 'update-chats-menu',
      childBlocksList: [
        new Button({
          className: 'update-chats-menu__action_button',
          label: 'Добавить участника',
          events: {
            click: () => {
              this.openModal()
            }
          }
        }),
        new Button({
          className: 'update-chats-menu__action_button',
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
            click: () => this.menu.show()
          }
        }),
        menu
      }
    })

    this.menu = menu
    this.menu.hide()
  }

  private openModal(): void {
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

  protected render(): string {
    return getTemplate(UpdateChatsMenuTemplate)
  }
}
