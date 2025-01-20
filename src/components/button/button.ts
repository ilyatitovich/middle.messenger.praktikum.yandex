import { Block, type BlockProps } from '@/core'
import { getTemplate } from '@/utils'

export type ButtonProps = BlockProps & {
  label?: string
  type?: 'submit' | 'button'
  icon?: string
  isDisabled?: boolean
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

  protected componentDidUpdate(
    _oldProps: Record<string, unknown>,
    newProps: Record<string, unknown>
  ): boolean {
    const { isDisabled } = newProps

    if (this.element instanceof HTMLButtonElement) {
      this.element.disabled = Boolean(isDisabled)
    }

    return false
  }

  protected render(): string {
    if (this.props.icon) {
      return getTemplate(this.props.icon)
    }

    return ''
  }
}
