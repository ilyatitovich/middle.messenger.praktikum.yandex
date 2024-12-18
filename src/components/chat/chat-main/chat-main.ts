import './chat-main.css'

import { Modal } from '@/components'
import { MessagesList, UpdateChatsMenu } from '@/components/chat'
import { SendMessageForm, FileUploadForm } from '@/components/forms'
import { Block, type BlockProps } from '@/core'
import { getTemplate, type Chat } from '@/utils'

import ChatMainTemplate from './chat-main.hbs?raw'

type ChatMainProps = BlockProps & {
  chat: Chat
}

export class ChatMain extends Block<ChatMainProps> {
  private form: HTMLFormElement
  private messagesList: MessagesList
  private sendFileModal: Modal

  constructor(props: ChatMainProps) {
    const messageForm = new SendMessageForm({
      handleOpenModal: () => this.openSendFileModal(),
      handleSubmit: e => this.handleSubmit(e as SubmitEvent)
    })

    const messagesList = new MessagesList()

    const sendFileModal = new Modal({
      content: new FileUploadForm({
        handleUploadFile: (file: File) => this.sendFile(file),
        handleCancel: () => this.hideSendFileModal()
      })
    })

    const updateChatsMenu = new UpdateChatsMenu()

    super('section', {
      ...props,
      childBlocks: {
        messagesList,
        messageForm,
        sendFileModal,
        updateChatsMenu
      },
      className: 'chat-main'
    })

    this.form = messageForm.getContent() as HTMLFormElement
    this.messagesList = messagesList
    this.sendFileModal = sendFileModal
    this.sendFileModal.hide()
  }

  private handleSubmit(e: SubmitEvent) {
    e.preventDefault()

    const message = new FormData(this.form).get('message') as string

    if (message) {
      this.messagesList.addMessage({ sender: 'me', text: message })
      console.table({ message })
      this.form.reset()
    }
  }

  private openSendFileModal(): void {
    this.sendFileModal.show()
  }

  private hideSendFileModal(): void {
    this.sendFileModal.hide()
  }

  private sendFile(file: File): void {
    console.table({ message: file })
  }

  protected render(): string {
    return getTemplate(ChatMainTemplate, { chat: this.props.chat })
  }
}
