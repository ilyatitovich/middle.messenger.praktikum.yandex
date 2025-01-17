import type { User } from '@/stores'

import { BaseAPI } from './base-api'

export type UserData = Partial<User>

export type ChangePasswordData = {
  oldPassword: string
  newPassword: string
}

export type SearchUserData = {
  login: string
}

export class UserAPI extends BaseAPI {
  constructor() {
    super()
  }

  async changeData(data: UserData): Promise<User> {
    return this.http.put('/user/profile', { data })
  }

  async changeAvatar(data: FormData): Promise<User> {
    return this.http.put('/user/profile/avatar', { data })
  }

  async changePassword(data: ChangePasswordData): Promise<void> {
    return this.http.put('/user/password', { data })
  }

  async searchUser(data: SearchUserData): Promise<User[]> {
    return this.http.post('/user/search', { data })
  }
}
