type Listener = (...args: unknown[]) => void

export default class EventBus {
  private listeners: Record<string, Listener[]>

  constructor() {
    this.listeners = {}
  }

  on(event: string, callback: Listener): void {
    if (!this.listeners[event]) {
      this.listeners[event] = []
    }
    this.listeners[event].push(callback)
  }

  off(event: string, callback: Listener): void {
    const eventListeners = this.listeners[event]
    if (!eventListeners) {
      throw new Error(`Нет события: ${event}`)
    }
    this.listeners[event] = eventListeners.filter(
      listener => listener !== callback
    )
  }

  emit(event: string, ...args: unknown[]): void {
    const eventListeners = this.listeners[event]
    if (!eventListeners) {
      throw new Error(`Нет события: ${event}`)
    }
    eventListeners.forEach(listener => listener(...args))
  }
}
