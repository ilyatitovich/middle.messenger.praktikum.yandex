import {
  UserAPI,
  ChatsAPI,
  DeleteChatData,
  type CreateChatData,
  type SearchUserData,
  ChatUserData
} from '@/api'
import { showRequestResult } from '@/components'
import { chatsStore, chatUsersStore, currentChatStore } from '@/stores'

class ChatsController {
  private chatsAPI: ChatsAPI = new ChatsAPI()
  private userAPI: UserAPI = new UserAPI()

  async getChats(): Promise<void> {
    try {
      const chats = await this.chatsAPI.getChats()
      const { currentChatId } = currentChatStore.get()

      // Удаляем текущай чат если он был удален его создателем
      if (currentChatId && !chats.some(chat => chat.id === currentChatId)) {
        currentChatStore.set({ currentChatId: null })
      }

      chatsStore.set({ chatsList: chats })
    } catch (error) {
      this.chatsAPI.handleError(error)
    }
  }

  async addChat(data: CreateChatData): Promise<void> {
    try {
      await this.chatsAPI.createChat(data)
      await this.getChats()
      showRequestResult(true, 'Чат добавлен')
    } catch (error) {
      this.chatsAPI.handleError(error)
    }
  }

  async deleteChat(data: DeleteChatData): Promise<void> {
    try {
      await this.chatsAPI.deleteChat(data)
      currentChatStore.set({ currentChatId: null })
      await this.getChats()
    } catch (error) {
      this.chatsAPI.handleError(error)
    }
  }

  async addUser(data: SearchUserData): Promise<void> {
    const chatId = currentChatStore.get().currentChatId

    if (!chatId) {
      return
    }

    try {
      const users = await this.userAPI.searchUser(data)
      if (users.length === 0) {
        throw new Error('Пользователь не найден')
      }

      const addUserToChatData: ChatUserData = {
        users: [users[0].id],
        chatId
      }

      await this.chatsAPI.addUserToChat(addUserToChatData)
      await this.getChatUsers(chatId)

      showRequestResult(true, 'Пользователь добавлен')
    } catch (error) {
      this.chatsAPI.handleError(error)
    }
  }

  async getChatToken(chatId: number): Promise<string | undefined> {
    try {
      const { token } = await this.chatsAPI.getChatToken(chatId)
      return token
    } catch (error) {
      this.chatsAPI.handleError(error)
    }
  }

  async getChatUsers(chatId: number): Promise<void> {
    try {
      const users = await this.chatsAPI.getChatUsers(chatId)
      chatUsersStore.set({ users })
    } catch (error) {
      this.chatsAPI.handleError(error)
    }
  }

  async deleteChatUsers(users: number[]): Promise<void> {
    const chatId = currentChatStore.get().currentChatId!
    try {
      const data = {
        users,
        chatId
      }
      await this.chatsAPI.deleteChatUsers(data)
      await this.getChatUsers(chatId)

      showRequestResult(true, 'Пользователи удалены')
    } catch (error) {
      this.chatsAPI.handleError(error, 'Ошибка при удалении пользователей')
    }
  }

  async uploadFile(data: FormData): Promise<number | undefined> {
    try {
      const { id } = await this.chatsAPI.uploadFile(data)
      return id
    } catch (error) {
      this.chatsAPI.handleError(error)
    }
  }

  async updateChatAvatar(data: FormData): Promise<void> {
    try {
      await this.chatsAPI.updateChatAvatar(data)
      await this.getChats()
      showRequestResult(true, 'Аватар чата обновлен')
    } catch (error) {
      this.chatsAPI.handleError(error)
    }
  }
}

export const chatsController = new ChatsController()
