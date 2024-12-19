import './update-chats-menu.css'

import { ActionMenu, Button, Modal } from '@/components'
import { UpdateChatsForm, UpdateChatsFormProps } from '@/components/forms'
import { Block, type BlockProps } from '@/core'
import { getTemplate } from '@/utils'

import UpdateChatsMenuIcon from './update-chats-menu-icon.hbs?raw'
import UpdateChatsMenuTemplate from './update-chats-menu.hbs?raw'

type UpdateChatsMenuProps = BlockProps

export class UpdateChatsMenu extends Block<UpdateChatsMenuProps> {
  private menu: ActionMenu
  private modal: Modal
  private form: UpdateChatsForm

  constructor(props: UpdateChatsMenuProps = {}) {
    const form = new UpdateChatsForm({
      type: 'add',
      handleUpdate: (chat: string) => this.addChat(chat),
      handleCancel: () => this.closeModal()
    })

    const modal = new Modal({ content: form })

    const menu = new ActionMenu({
      className: 'update-chats-menu',
      childBlocksList: [
        new Button({
          className: 'update-chats-menu__action_button',
          label: 'Добавить чат',
          events: {
            click: () => {
              this.menu.hide()
              this.openModal('add')
            }
          }
        }),
        new Button({
          className: 'update-chats-menu__action_button',
          label: 'Удалить чат',
          events: {
            click: () => {
              this.menu.hide()
              this.openModal('delete')
            }
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
        menu,
        modal
      }
    })

    this.form = form
    this.modal = modal
    this.menu = menu
    this.modal.hide()
    this.menu.hide()
  }

  private openModal(formType: 'add' | 'delete'): void {
    this.form.setProps<UpdateChatsFormProps>({
      type: formType,
      handleUpdate: formType === 'add' ? this.addChat : this.deleteChat
    })

    this.modal.show()
  }

  private addChat(chat: string): void {
    console.table({ chat })
    console.log(`Чат ${chat} добавлен!`)
  }

  private deleteChat(chat: string): void {
    console.table({ chat })
    console.log(`Чат ${chat} удален!`)
  }

  private closeModal(): void {
    this.modal.hide()
  }

  protected render(): string {
    return getTemplate(UpdateChatsMenuTemplate)
  }
}
