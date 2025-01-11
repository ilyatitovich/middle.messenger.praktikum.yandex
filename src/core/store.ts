import { EventBus, type Listener } from '@/core'
import { isDeepEqual } from '@/utils'

enum StoreEvents {
  Updated = 'updated'
}

type State = Record<string, unknown>

export class Store<T extends State> {
  private initialState: T
  private state: T
  private eventBus: EventBus

  constructor(initialState: T) {
    this.initialState = initialState
    this.state = initialState
    this.eventBus = new EventBus()

    this.eventBus.on(StoreEvents.Updated, () => {})
  }

  get(): T {
    return this.state
  }

  set(newState: Partial<T>): void {
    const updatedState = { ...this.state, ...newState }

    if (isDeepEqual(this.state, updatedState)) {
      return
    }

    this.state = updatedState
    this.eventBus.emit(StoreEvents.Updated, this.state)
  }

  subscribe(callback: Listener): void {
    this.eventBus.on(StoreEvents.Updated, callback)
  }

  unsubscribe(callback: Listener): void {
    this.eventBus.off(StoreEvents.Updated, callback)
  }

  reset(): void {
    this.state = this.initialState
  }
}
