import './send-message-form.css'

import { Button, Textarea } from '@/components'
import { Block, type BlockProps } from '@/core'

import SendFileIcon from './send-file-icon.hbs?raw'
import SendMessageIcon from './send-message-icon.hbs?raw'

type SendMessageFormProps = BlockProps & {
  handleOpenModal: () => void
  handleSubmit: (e: Event) => void
}

export class SendMessageForm extends Block<SendMessageFormProps> {
  constructor(props: SendMessageFormProps) {
    const sendFileButton = new Button({
      icon: SendFileIcon,
      className: 'send-file__button',
      events: { click: props.handleOpenModal }
    })
    const messageInput = new Textarea({
      name: 'message',
      placeholder: 'Сообщение'
    })
    const submitButton = new Button({
      type: 'submit',
      icon: SendMessageIcon,
      className: 'send-message-form__button'
    })
    super('form', {
      ...props,
      className: 'message-form',
      childBlocksList: [sendFileButton, messageInput, submitButton],
      events: { submit: e => props.handleSubmit(e) }
    })
  }
}
