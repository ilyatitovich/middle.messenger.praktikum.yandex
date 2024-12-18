import './update-chats-form.css'

import { Button, UserFormField, type UserFormFieldProps } from '@/components'
import { Block, type BlockProps } from '@/core'
import { getTemplate, isValidLogin } from '@/utils'

import UpdateChatsFormTemplate from './update-chats-form.hbs?raw'

export type UpdateChatsFormProps = BlockProps & {
  type: 'add' | 'delete'
  handleUpdate: (chat: string) => void
  handleCancel: () => void
}

export class UpdateChatsForm extends Block<UpdateChatsFormProps> {
  private chatField: UserFormField

  constructor(props: UpdateChatsFormProps) {
    const chatField = new UserFormField({
      type: 'text',
      label: 'Логин чата',
      name: 'chat',
      validate: isValidLogin
    })

    const cancelButton = new Button({
      label: 'Отмена',
      className: 'update-chats-form__cancel-button',
      events: {
        click: props.handleCancel
      }
    })

    super('form', {
      ...props,
      className: 'update-chats-form',
      childBlocks: { chatField, cancelButton },
      events: {
        submit: (e: Event) => this.handleSubmit(e as SubmitEvent)
      }
    })

    this.chatField = chatField
  }

  private handleSubmit(e: SubmitEvent): void {
    e.preventDefault()

    const validateChatLogin = this.chatField.validateValue()
    this.chatField.setProps<UserFormFieldProps>({
      validationResult: validateChatLogin
    })

    if (validateChatLogin.isValid) {
      this.props.handleUpdate(this.chatField.getValue())
      ;(this.element as HTMLFormElement).reset()
    }
  }

  protected render(): string {
    const title = this.props.type === 'add' ? 'Добавить чат' : 'Удалить чат'
    return getTemplate(UpdateChatsFormTemplate, { title })
  }
}
