import { appRouter } from '@/app'
import { Block, type BlockProps } from '@/core'
import { getTemplate } from '@/utils'

type LinkProps = BlockProps & {
  to: string
  content?: string
  icon?: string
}

export class Link extends Block<LinkProps> {
  constructor(props: LinkProps) {
    super('a', { ...props, events: { click: e => this.handleClick(e) } })

    if (this.element instanceof HTMLAnchorElement) {
      this.element.href = this.props.to
      if (props.content) {
        this.element.textContent = props.content
      }
    }
  }

  handleClick(e: Event): void {
    e.preventDefault()
    appRouter.go(this.props.to)
  }

  protected render(): string {
    if (this.props.icon) {
      return getTemplate(this.props.icon)
    }

    return ''
  }
}
