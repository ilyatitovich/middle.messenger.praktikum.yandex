import './messages-list.css'

import { ChatMessage } from '@/components/chat'
import { Block, type BlockProps, type MessageResponse } from '@/core'

export type MessagesListProps = BlockProps & {
  messages?: MessageResponse[]
  message?: MessageResponse
}

export class MessagesList extends Block<MessagesListProps> {
  constructor(props: MessagesListProps = {}) {
    super('div', {
      ...props,
      className: 'messages-list'
    })
  }

  addMessage(message: MessageResponse): void {
    const newMessage = new ChatMessage({ message })
    this.childBlocksList?.push(newMessage)
    this.element?.append(newMessage.getContent()!)

    requestAnimationFrame(() => {
      this.scrollToBottom()
    })
  }

  private scrollToBottom(): void {
    if (!this.element) return

    const images = this.element.querySelectorAll('img')
    const promises = Array.from(images).map(
      img =>
        new Promise<void>(resolve => {
          if (img.complete) {
            resolve()
          } else {
            img.onload = () => resolve()
            img.onerror = () => resolve()
          }
        })
    )

    Promise.all(promises).then(() => {
      this.element!.scrollTo({
        top: this.element!.scrollHeight,
        behavior: 'smooth'
      })
    })
  }

  protected componentDidMount(): void {
    requestAnimationFrame(() => {
      this.scrollToBottom()
    })
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
