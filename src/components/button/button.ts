import { Block, type BlockProps } from '@/core'
import { getTemplate } from '@/utils'

export type ButtonProps = BlockProps & {
  label?: string
  type?: 'submit' | 'button'
  icon?: string
}

export class Button extends Block<ButtonProps> {
  constructor(props: ButtonProps) {
    super('button', props)

    if (this.element instanceof HTMLButtonElement) {
      this.element.type = props.type ?? 'button'

      if (props.label) {
        this.element.textContent = props.label
      }
    }
  }

  protected render(): string {
    if (this.props.icon) {
      return getTemplate(this.props.icon)
    }

    return ''
  }
}
