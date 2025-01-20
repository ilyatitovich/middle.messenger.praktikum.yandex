import { showRequestResult } from '@/components'
import { EventBus, type Listener } from '@/core'

enum SocketEvents {
  Open = 'open',
  Close = 'close',
  Message = 'message',
  Error = 'error'
}

export type FileMessage = {
  id: number
  user_id: number
  path: string
  filename: string
  content_type: string
  content_size: number
  upload_date: string
}

export type Message = {
  content: string
  type: 'message' | 'get old'
}

export type MessageResponse = {
  id: string
  time: string
  user_id: number
  content: string
  type: 'message'
  is_read?: boolean
  file?: FileMessage | null
}

export class MessengerWebSocket {
  private pingInterval: NodeJS.Timeout | null = null
  private socket: WebSocket | null = null
  private eventBus: EventBus | null = null

  connect(url: string): void {
    this.socket = new WebSocket(url)
    this.eventBus = new EventBus()

    this.socket.addEventListener(SocketEvents.Open, () => {
      console.log('Соединение установлено')
      this.eventBus?.emit(SocketEvents.Open)

      this.pingInterval = setInterval(() => {
        if (this.socket?.readyState === WebSocket.OPEN) {
          this.socket.send(JSON.stringify({ type: 'ping' }))
        }
      }, 30000)
    })

    this.socket.addEventListener(SocketEvents.Close, event => {
      const message = event.wasClean
        ? 'Соединение закрыто'
        : 'Соединение прервано'
      console.log(message)
      this.cleanupPing()
    })

    this.socket.addEventListener(SocketEvents.Message, event => {
      this.eventBus?.emit(SocketEvents.Message, JSON.parse(event.data))
    })

    this.socket.addEventListener(SocketEvents.Error, event => {
      showRequestResult(false, 'Ошибка соединения')
      console.error('WebSocket error:', event)
    })
  }

  private cleanupPing(): void {
    if (this.pingInterval !== null) {
      clearInterval(this.pingInterval)
      this.pingInterval = null
    }
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.close()
      this.socket = null
      this.eventBus = null
    }
  }

  sendMessage(message: Message): void {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      console.error('Нельзя отправить сообщение, сокет закрыт')
      return
    }
    this.socket.send(JSON.stringify(message))
  }

  onOpen(callback: Listener): void {
    this.eventBus?.on(SocketEvents.Open, callback)
  }

  onMessage(callback: Listener): void {
    this.eventBus?.on(SocketEvents.Message, callback)
  }
}
