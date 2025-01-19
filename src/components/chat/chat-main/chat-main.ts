import './chat-main.css'

import { Modal } from '@/components'
import {
  MessagesList,
  UpdateChatsMenu,
  CurrentChatData,
  type CurrentChatDataProps,
  MessagesListProps
} from '@/components/chat'
import { SendMessageForm, FileUploadForm } from '@/components/forms'
import { chatsController } from '@/controllers'
import {
  Block,
  type BlockProps,
  MessengerWebSocket,
  type MessageResponse
} from '@/core'
import {
  CurrentChatState,
  currentChatStore,
  getCurrentChat,
  userStore,
  type Chat
} from '@/stores'
import { getTemplate } from '@/utils'

import ChatMainTemplate from './chat-main.hbs?raw'

type ChatMainProps = BlockProps & {
  chat: Chat | undefined
}

export class ChatMain extends Block<ChatMainProps> {
  private form: HTMLFormElement
  private messagesList: MessagesList
  private sendFileModal: Modal
  private currentChatData: CurrentChatData
  private webSocket: MessengerWebSocket = new MessengerWebSocket()
  private messages: MessageResponse[] = []

  constructor(props: ChatMainProps = { chat: getCurrentChat() }) {
    const currentChatData = new CurrentChatData({
      id: props.chat?.id,
      avatar: props.chat?.avatar,
      title: props.chat?.title
    })

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
        currentChatData,
        messagesList,
        messageForm,
        sendFileModal,
        updateChatsMenu
      },
      className: 'chat-main'
    })

    this.currentChatData = currentChatData
    this.form = messageForm.getContent() as HTMLFormElement
    this.messagesList = messagesList
    this.sendFileModal = sendFileModal
    this.sendFileModal.hide()

    this.storeUnsubscribe = currentChatStore.subscribe(state => {
      const { currentChatId } = state as CurrentChatState

      if (currentChatId) {
        const { id, avatar, title } = getCurrentChat()!
        this.currentChatData.setProps<CurrentChatDataProps>({
          id,
          avatar,
          title
        })

        this.connectToChat(currentChatId)
      }

      if (currentChatId === null) {
        this.webSocket.disconnect()
      }
    })

    if (props.chat) {
      this.connectToChat(props.chat.id)
    }
  }

  private async connectToChat(chatId: number): Promise<void> {
    chatsController.getChatUsers(chatId)
    this.webSocket.disconnect()
    this.messages = []
    this.messagesList.setProps<MessagesListProps>({
      messages: this.messages
    })
    const { user } = userStore.get()
    try {
      const chatToken = await chatsController.getChatToken(chatId)
      if (user) {
        this.webSocket.connect(
          `wss://ya-praktikum.tech/ws/chats/${user.id}/${chatId}/${chatToken}`
        )

        this.webSocket.onOpen(() => {
          this.webSocket.sendMessage({ content: '0', type: 'get old' })
        })

        this.webSocket.onMessage(message => {
          if (Array.isArray(message)) {
            this.messages = message as MessageResponse[]
            this.messagesList.setProps<MessagesListProps>({
              messages: this.messages
            })
          } else {
            if ((message as MessageResponse).type === 'message') {
              this.messages.unshift(message as MessageResponse)
              this.messagesList.addMessage(message as MessageResponse)
            }
          }
        })
      }
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  private handleSubmit(e: SubmitEvent) {
    e.preventDefault()

    const message = new FormData(this.form).get('message') as string

    if (message) {
      this.webSocket.sendMessage({ content: message, type: 'message' })
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

  protected onUnmount(): void {
    this.webSocket.disconnect()
  }

  protected render(): string {
    return getTemplate(ChatMainTemplate)
  }
}
