import { isDeepEqual } from '@/utils/deep-equal'

import EventBus from './event-bus'

type TagName = keyof HTMLElementTagNameMap

export type BlockProps = {
  events?: Partial<Record<keyof HTMLElementEventMap, (e: Event) => void>>
  childBlocks?: Record<string, Block<BlockProps>>
  className?: string
  childBlocksList?: Block<BlockProps>[]
}

export abstract class Block<TProps extends BlockProps = BlockProps> {
  private readonly tagName: TagName
  protected element: HTMLElement | null = null
  protected props: TProps
  protected events?: TProps['events']
  private readonly eventBus: EventBus
  protected childBlocks?: TProps['childBlocks']
  protected childBlocksList?: TProps['childBlocksList']

  static EVENTS = {
    INIT: 'init',
    FLOW_CDM: 'flow:component-did-mount',
    FLOW_CDU: 'flow:component-did-update',
    FLOW_RENDER: 'flow:render'
  } as const

  constructor(tagName: TagName = 'div', props: TProps) {
    this.tagName = tagName
    this.props = props
    this.events = props.events ?? {}
    this.childBlocks = props.childBlocks ?? {}
    this.childBlocksList = props.childBlocksList ?? []
    this.eventBus = new EventBus()

    this._registerEvents()
    this.eventBus.emit(Block.EVENTS.INIT)
  }

  private _registerEvents(): void {
    const { eventBus } = this
    eventBus.on(Block.EVENTS.INIT, this.init.bind(this))
    eventBus.on(Block.EVENTS.FLOW_CDM, this._componentDidMount.bind(this))
    eventBus.on(Block.EVENTS.FLOW_CDU, this._componentDidUpdate.bind(this))
    eventBus.on(Block.EVENTS.FLOW_RENDER, this._render.bind(this))
  }

  private init(): void {
    this.element = document.createElement(this.tagName)
    const { className } = this.props

    if (className) {
      this.element.className = className
    }

    this.eventBus.emit(Block.EVENTS.FLOW_RENDER)
  }

  private _componentDidMount(): void {
    this.componentDidMount()
  }

  protected componentDidMount(): void {}

  dispatchComponentDidMount(): void {
    this.eventBus.emit(Block.EVENTS.FLOW_CDM)
  }

  private _componentDidUpdate(oldProps: unknown, newProps: unknown): void {
    if (
      this.componentDidUpdate(
        oldProps as Record<string, unknown>,
        newProps as Record<string, unknown>
      )
    ) {
      this.removeEvents()
      this.eventBus.emit(Block.EVENTS.FLOW_RENDER)
    }
  }

  protected componentDidUpdate(
    oldProps: Record<string, unknown>,
    newProps: Record<string, unknown>
  ): boolean {
    return !isDeepEqual(oldProps, newProps)
  }

  setProps<T extends BlockProps>(nextProps: Partial<T>): void {
    if (!nextProps || Object.keys(nextProps).length === 0) {
      return
    }

    const oldProps = { ...this.props }
    Object.assign(this.props, nextProps)
    this.eventBus.emit(Block.EVENTS.FLOW_CDU, oldProps, this.props)
  }

  private _render(): void {
    if (!this.element) {
      return
    }

    this.element.innerHTML = this.render()
    this.appendChildBlocks()
    this.appendListItems()
    this.addEvents()
    this.dispatchComponentDidMount()
  }

  protected render(): string {
    return ''
  }

  private addEvents(): void {
    const { element } = this
    if (element) {
      Object.entries(this.events!).forEach(([eventName, handler]) => {
        if (handler) {
          element!.addEventListener(eventName, handler as EventListener)
        }
      })
    }
  }

  private removeEvents(): void {
    const { element } = this
    if (element) {
      Object.entries(this.events!).forEach(([eventName, handler]) => {
        if (handler) {
          element!.removeEventListener(eventName, handler as EventListener)
        }
      })
    }
  }

  private appendChildBlocks(): void {
    const childBlocks = this.childBlocks

    if (childBlocks && Object.values(childBlocks).length !== 0) {
      const slots = Array.from(
        this.element!.querySelectorAll('[data-block-id]') ?? []
      ).reduce((acc, slot) => {
        const id = slot.getAttribute('data-block-id')
        if (id) {
          acc.set(id, slot as HTMLElement)
        }
        return acc
      }, new Map<string, HTMLElement>())

      Object.entries(childBlocks).forEach(([id, block]) => {
        const slot = slots.get(id)
        const content = block.getContent()

        if (content) {
          if (slot) {
            slot.replaceWith(content)
          } else {
            throw new Error(`Слот для ${id} не найден`)
          }
        }
      })
    }
  }

  private appendListItems(): void {
    const fragment = document.createDocumentFragment()

    this.childBlocksList!.forEach(item => {
      fragment.appendChild(item.getContent()!)
    })

    if (fragment.hasChildNodes()) {
      this.element!.appendChild(fragment)
    }
  }

  getContent(): HTMLElement | null {
    return this.element
  }

  show(): void {
    if (this.element) {
      this.element.style.display = 'block'
    }
  }

  hide(): void {
    if (this.element) {
      this.element.style.display = 'none'
    }
  }
}
