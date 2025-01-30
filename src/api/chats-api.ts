import type { Chat, ChatUser } from '@/stores'

import { BaseAPI } from './base-api'

export type CreateChatData = {
  title: string
}

export type DeleteChatData = {
  chatId: number
}

export type ChatUserData = {
  users: number[]
  chatId: number
}

type DeleteChatResult = {
  userId: number
  result: {
    id: number
    title: string
    avatar: string
    created_by: number
  }
}

export class ChatsAPI extends BaseAPI {
  constructor() {
    super()
  }

  async getChats(): Promise<Chat[]> {
    return this.http.get('/chats')
  }

  async createChat(data: CreateChatData): Promise<{ id: number }> {
    return this.http.post('/chats', { data })
  }

  async deleteChat(data: DeleteChatData): Promise<DeleteChatResult> {
    return this.http.delete('/chats', { data })
  }

  async addUserToChat(data: ChatUserData): Promise<void> {
    return this.http.put('/chats/users', { data })
  }

  async getChatToken(chatId: number): Promise<{ token: string }> {
    return this.http.post(`/chats/token/${chatId}`)
  }

  async getChatUsers(chatId: number): Promise<ChatUser[]> {
    return this.http.get(`/chats/${chatId}/users`)
  }

  async deleteChatUsers(data: ChatUserData): Promise<void> {
    return this.http.delete('/chats/users', { data })
  }

  async uploadFile(data: FormData): Promise<{ id: number }> {
    return this.http.post('/resources', { data })
  }

  async updateChatAvatar(data: FormData): Promise<Chat> {
    return this.http.put('/chats/avatar', { data })
  }
}
