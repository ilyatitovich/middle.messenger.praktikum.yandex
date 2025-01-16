import type { User } from '@/stores'

import { BaseAPI, type APIResponse } from './base-api'

export type LoginData = {
  login: string
  password: string
}

export type SignUpData = {
  first_name: string
  second_name: string
  login: string
  email: string
  password: string
  phone: string
}

export class AuthAPI extends BaseAPI {
  async login(data: LoginData): Promise<APIResponse<null>> {
    return this.http.post('/auth/signin', { data })
  }

  async signup(data: SignUpData): Promise<APIResponse<{ id: number }>> {
    return this.http.post('/auth/signup', { data })
  }

  async logout(): Promise<APIResponse<null>> {
    return this.http.post('/auth/logout')
  }

  async getUser(): Promise<APIResponse<User>> {
    return this.http.get('/auth/user')
  }
}
