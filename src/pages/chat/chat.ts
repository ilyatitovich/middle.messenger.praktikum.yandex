import './chat.css'

import { ChatMain, ChatMainEmpty, ChatSideBar } from '@/components/chat'
import { Block, type BlockProps } from '@/core'
import { CurrentChatState, currentChatStore } from '@/stores'
import { getTemplate } from '@/utils'

import ChatTemplate from './chat.hbs?raw'

type ChatPageProps = BlockProps & {
  currentChatId?: number | null
}

export default class ChatPage extends Block<ChatPageProps> {
  private currentChatId: number | null

  constructor(props: ChatPageProps = {}) {
    const { currentChatId } = currentChatStore.get()
    const main = currentChatId ? new ChatMain() : new ChatMainEmpty()

    super('main', {
      ...props,
      className: 'chat',
      childBlocks: { sidebar: new ChatSideBar(), main }
    })

    this.currentChatId = currentChatId

    this.storeUnsubscribe = currentChatStore.subscribe(state => {
      const { currentChatId } = state as CurrentChatState

      if (this.currentChatId === null) {
        this.currentChatId = currentChatId
        this.setProps<ChatPageProps>({ currentChatId })
        return
      }

      if (this.currentChatId !== null && currentChatId === null) {
        this.currentChatId = currentChatId
        this.setProps<ChatPageProps>({ currentChatId })
        return
      }
    })
  }

  protected componentDidUpdate(
    _oldProps: Record<string, unknown>,
    newProps: Record<string, unknown>
  ): boolean {
    const { currentChatId } = newProps

    if (currentChatId === null && this.childBlocks) {
      this.childBlocks['main'].unmount()
      this.childBlocks['main'] = new ChatMainEmpty()
    }

    if (currentChatId && this.childBlocks) {
      this.childBlocks['main'].unmount()
      this.childBlocks['main'] = new ChatMain()
    }
    return true
  }

  protected onUnmount(): void {
    currentChatStore.set({ currentChatId: null })
  }

  protected render(): string {
    return getTemplate(ChatTemplate)
  }
}
