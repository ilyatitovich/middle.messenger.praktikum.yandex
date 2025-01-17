import './delete-users-form.css'

import { Button, ButtonProps } from '@/components'
import { chatsController } from '@/controllers'
import { Block, type BlockProps } from '@/core'
import type { ChatUser } from '@/stores'
import { getFilePath, getTemplate } from '@/utils'

import DeleteUsersFormTemplate from './delete-users-form.hbs?raw'

export type DeleteUsersFormProps = BlockProps & {
  users: ChatUser[]
  handleCancel: () => void
}

export class DeleteUsersForm extends Block<DeleteUsersFormProps> {
  private submitButton: Button

  constructor(props: DeleteUsersFormProps) {
    const submitButton = new Button({
      type: 'submit',
      className: 'delete-users-form__submit-button',
      label: 'Удалить'
    })

    const cancelButton = new Button({
      label: 'Отмена',
      className: 'delete-users-form__cancel-button',
      events: {
        click: () => this.closeForm()
      }
    })

    super('form', {
      ...props,
      className: 'delete-users-form',
      childBlocksList: [submitButton, cancelButton],
      events: {
        submit: (e: Event) => this.handleSubmit(e as SubmitEvent)
      }
    })

    this.submitButton = submitButton
  }

  private closeForm(): void {
    this.props.handleCancel()
  }

  private async handleSubmit(e: SubmitEvent): Promise<void> {
    e.preventDefault()

    if (this.element instanceof HTMLFormElement) {
      const formData = new FormData(this.element)
      const checkedValues = formData.getAll('user')

      if (checkedValues.length > 0) {
        const users = checkedValues.map(user => Number(user))

        try {
          this.submitButton.setProps<ButtonProps>({ isDisabled: true })
          await chatsController.deletChatUsers(users)
          this.closeForm()
        } catch (error) {
          console.error(error)
          this.submitButton.setProps<ButtonProps>({ isDisabled: false })
        }
      }
    }
  }

  protected render(): string {
    const users = this.props.users.map(user => {
      const avatar = user.avatar
        ? getFilePath(user.avatar)
        : `https://robohash.org/${user.first_name}`

      const isAdmin = user.role === 'admin'

      return { ...user, avatar, isAdmin }
    })

    return getTemplate(DeleteUsersFormTemplate, { users })
  }
}
