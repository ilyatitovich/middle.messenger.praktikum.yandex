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
  chatsList: Chat[] | null
}

export type CurrentChatState = {
  currentChatId: number | null
}

export type ChatUser = Partial<User> & {
  role: 'admin' | 'regular'
}

export type ChatUsersState = {
  users: ChatUser[]
}

const initialChatsState: ChatsState = {
  chatsList: null
}

const initinalCurrentChatStore: CurrentChatState = {
  currentChatId: null
}

const initialChatUsersState: ChatUsersState = {
  users: []
}

export const chatsStore = new Store(initialChatsState)

export const currentChatStore = new Store(initinalCurrentChatStore)

export const chatUsersStore = new Store(initialChatUsersState)

export function getCurrentChat(): Chat | undefined {
  const { currentChatId } = currentChatStore.get()
  const { chatsList } = chatsStore.get()

  return chatsList
    ? chatsList.find(chat => chat.id === currentChatId)
    : undefined
}
