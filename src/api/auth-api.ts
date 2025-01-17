import type { User } from '@/stores'

import { BaseAPI } from './base-api'

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
  async login(data: LoginData): Promise<void> {
    return this.http.post('/auth/signin', { data })
  }

  async signup(data: SignUpData): Promise<{ id: number }> {
    return this.http.post('/auth/signup', { data })
  }

  async logout(): Promise<void> {
    return this.http.post('/auth/logout')
  }

  async getUser(): Promise<User> {
    return this.http.get('/auth/user')
  }
}
