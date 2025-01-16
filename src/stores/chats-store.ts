import { Store } from './store'
import { type User } from './user-store'

type LastMessage = {
  user: Partial<User>
  time: string
  content: string
}

export type Chat = {
  id: number
  title: string
  avatar: string | null
  unread_count: number
  created_by: number
  last_message: LastMessage | null
}

export type ChatsState = {
  status: 'idle' | 'loading' | 'success' | 'error'
  chatsList: Chat[]
}

export type CurrentChatState = {
  currentChatId: number | null
}

const initialChatsState: ChatsState = {
  status: 'idle',
  chatsList: []
}

const initinalCurrentChatStore: CurrentChatState = {
  currentChatId: null
}

export const chatsStore = new Store(initialChatsState)
export const currentChatStore = new Store(initinalCurrentChatStore)

export function getCurrentChat(): Chat {
  const { currentChatId } = currentChatStore.get()
  const { chatsList } = chatsStore.get()
  return chatsList.find(chat => chat.id === currentChatId)!
}
