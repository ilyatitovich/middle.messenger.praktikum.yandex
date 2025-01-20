import './update-chats-form.css'

import { Button, type ButtonProps, UserFormField } from '@/components'
import { Block, type BlockProps } from '@/core'
import { chatsStore, chatUsersStore } from '@/stores'
import { getTemplate, ValidationResult } from '@/utils'

import UpdateChatsFormTemplate from './update-chats-form.hbs?raw'

export type UpdateChatsFormProps = BlockProps & {
  title: string
  inputLabel: string
  submitButtonLabel: string
  type?: 'addUser' | 'addChat'
  validate: (data: string) => ValidationResult
  handleUpdate: (chat: string) => Promise<void>
  handleCancel: () => void
}

export class UpdateChatsForm extends Block<UpdateChatsFormProps> {
  private chatField: UserFormField
  private submitButton: Button
  private type: 'addUser' | 'addChat'

  constructor(props: UpdateChatsFormProps) {
    const chatField = new UserFormField({
      type: 'text',
      label: props.inputLabel,
      name: 'chat',
      validate: props.validate
    })

    const submitButton = new Button({
      type: 'submit',
      className: 'update-chats-form__submit-button',
      label: props.submitButtonLabel
    })

    const cancelButton = new Button({
      label: 'Отмена',
      className: 'update-chats-form__cancel-button',
      events: {
        click: () => this.closeForm()
      }
    })

    super('form', {
      ...props,
      className: 'update-chats-form',
      childBlocksList: [chatField, submitButton, cancelButton],
      events: {
        submit: (e: Event) => this.handleSubmit(e as SubmitEvent)
      }
    })

    this.chatField = chatField
    this.submitButton = submitButton
    this.type = props.type ?? 'addUser'

    if (this.type === 'addUser') {
      this.storeUnsubscribe = chatUsersStore.subscribe(() => {
        this.chatField.resetValue()
      })
    }

    if (this.type === 'addChat') {
      this.storeUnsubscribe = chatsStore.subscribe(() => {
        this.chatField.resetValue()
      })
    }
  }

  private closeForm(): void {
    this.props.handleCancel()
  }

  private async handleSubmit(e: SubmitEvent): Promise<void> {
    e.preventDefault()

    const isValidLogin = this.chatField.validateValue()

    if (isValidLogin) {
      this.submitButton.setProps<ButtonProps>({ isDisabled: true })
      await this.props.handleUpdate(this.chatField.getValue())
      this.submitButton.setProps<ButtonProps>({ isDisabled: false })
    }
  }

  protected render(): string {
    return getTemplate(UpdateChatsFormTemplate, { title: this.props.title })
  }
}
