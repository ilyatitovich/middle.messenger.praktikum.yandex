import type { User } from '@/stores'

import { BaseAPI, type APIResponse } from './base-api'

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

  async changeData(data: UserData): Promise<APIResponse<User>> {
    return this.http.put('/user/profile', { data })
  }

  async changeAvatar(data: FormData): Promise<APIResponse<User>> {
    return this.http.put('/user/profile/avatar', { data })
  }

  async changePassword(data: ChangePasswordData): Promise<APIResponse<null>> {
    return this.http.put('/user/password', { data })
  }

  async searchUser(data: SearchUserData): Promise<APIResponse<User[]>> {
    return this.http.post('/user/search', { data })
  }
}
