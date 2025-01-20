import './messages-list.css'

import { ChatMessage } from '@/components/chat'
import { Block, type BlockProps, type MessageResponse } from '@/core'

export type MessagesListProps = BlockProps & {
  messages: MessageResponse[]
  message?: MessageResponse
}

export class MessagesList extends Block<MessagesListProps> {
  constructor(props: MessagesListProps = { messages: [] }) {
    super('div', {
      ...props,
      childBlocksList: props.messages
        .reverse()
        .map(message => new ChatMessage({ message })),
      className: 'messages-list'
    })
  }

  addMessage(message: MessageResponse): void {
    const newMessage = new ChatMessage({ message })
    this.childBlocksList?.push(newMessage)
    this.element?.appendChild(newMessage.getContent()!)
    this.scrollToBottom()
  }

  private scrollToBottom(): void {
    if (this.element) {
      this.element.scrollTop = this.element!.scrollHeight
    }
  }

  protected componentDidMount(): void {
    this.scrollToBottom()
  }

  protected componentDidUpdate(
    _oldProps: Record<string, unknown>,
    newProps: MessagesListProps
  ): boolean {
    const { messages, message } = newProps

    if (messages) {
      this.childBlocksList = messages
        .reverse()
        .map(message => new ChatMessage({ message }))
    }

    if (message) {
      this.addMessage(message)
    }

    return true
  }
}
