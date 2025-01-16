import { Store } from './store'

export type User = {
  id: number
  first_name: string
  second_name: string
  display_name: string | null
  phone: string
  login: string
  avatar: string | null
  email: string
}

export type UserState = {
  user: User | null
}

const initialUserState: UserState = {
  user: null
}

export const userStore = new Store(initialUserState)
