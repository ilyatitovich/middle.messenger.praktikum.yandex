import type { Chat } from '@/stores'

import { BaseAPI, type APIResponse } from './base-api'

export type CreateChatData = {
  title: string
}

export type DeleteChatData = {
  chatId: number
}

export type AddUserToChatData = {
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

  async getChats(): Promise<APIResponse<Chat[]>> {
    return this.http.get('/chats')
  }

  async createChat(data: CreateChatData): Promise<APIResponse<{ id: number }>> {
    return this.http.post('/chats', { data })
  }

  async deleteChat(
    data: DeleteChatData
  ): Promise<APIResponse<DeleteChatResult>> {
    return this.http.delete('/chats', { data })
  }

  async addUserToChat(data: AddUserToChatData): Promise<APIResponse<null>> {
    return this.http.put('/chats/users', { data })
  }

  async getChatToken(chatId: number): Promise<APIResponse<{ token: string }>> {
    return this.http.post(`/chats/token/${chatId}`)
  }
}
