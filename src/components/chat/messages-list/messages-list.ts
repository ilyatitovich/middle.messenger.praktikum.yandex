import './messages-list.css'

import { ChatMessage } from '@/components/chat'
import { Block, type BlockProps } from '@/core'
import { mockMessages, type Message } from '@/utils'

export type MessagesListProps = BlockProps & {
  messages: Message[]
  message?: Message
}

export class MessagesList extends Block<MessagesListProps> {
  constructor(props: MessagesListProps = { messages: mockMessages }) {
    super('div', {
      ...props,
      childBlocksList: props.messages.map(
        message => new ChatMessage({ message })
      ),
      className: 'messages-list'
    })
  }

  addMessage(message: Message): void {
    const newMessage = new ChatMessage({ message })
    this.childBlocksList?.push(newMessage)
    this.element?.appendChild(newMessage.getContent()!)
    this.scrollToBottom()
  }

  private scrollToBottom(): void {
    this.element!.scrollTop = this.element!.scrollHeight
  }

  protected componentDidMount(): void {
    this.scrollToBottom()
  }
}
