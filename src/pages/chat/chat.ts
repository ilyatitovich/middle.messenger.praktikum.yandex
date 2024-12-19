import './chat.css'

import { ChatMain, ChatMainEmpty, ChatSideBar } from '@/components/chat'
import { Block, type BlockProps } from '@/core'
import { ErrorPage } from '@/pages'
import { mockChats } from '@/utils'

type ChatPageProps = BlockProps

export default class ChatPage extends Block<ChatPageProps> {
  constructor(props: ChatPageProps = {}) {
    const route = window.location.pathname

    let chatMain

    if (route.startsWith('/chat/')) {
      const chatId = route.split('/').at(-1)
      const chat = mockChats.find(chat => chat.id === chatId)
      if (chat) {
        chatMain = new ChatMain({ chat })
      } else {
        chatMain = new ErrorPage({ code: 404, description: 'Чат не найден' })
      }
    } else {
      chatMain = new ChatMainEmpty({})
    }

    super('main', {
      ...props,
      className: 'chat',
      childBlocksList: [new ChatSideBar(), chatMain]
    })
  }
}
