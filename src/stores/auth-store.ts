import { Store } from './store'

export type AuthState = {
  status: 'idle' | 'loading' | 'success' | 'error'
}

const initialAuthState: AuthState = {
  status: 'idle'
}

export const authStore = new Store(initialAuthState)
