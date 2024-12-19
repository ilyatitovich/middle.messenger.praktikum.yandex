import { Button, type ButtonProps } from '@/components'
import { Block, type BlockProps } from '@/core'

import HidePasswordIconTemplate from './hide-password-icon.hbs?raw'
import ShowPasswordIconTemplate from './show-password-icon.hbs?raw'

export type InputProps = BlockProps & {
  type: string
  name: string
  placeholder?: string
  value?: string
  isRequired?: boolean
  isValid?: boolean
}

export class Input extends Block<InputProps> {
  constructor(props: InputProps) {
    super('input', {
      ...props,
      className: props.className ?? 'user-form__input'
    })

    if (this.element instanceof HTMLInputElement) {
      const { type, name, placeholder, value, isRequired } = this.props

      Object.assign(this.element, {
        type,
        id: name.toLowerCase(),
        name,
        placeholder: placeholder ?? '',
        value: value ?? '',
        required: isRequired ?? false
      })
    }
  }

  private addPasswordToggle(): void {
    const passwordToggle = new Button({
      type: 'button',
      className: 'user-form__password-toggle',
      icon: HidePasswordIconTemplate,
      events: {
        click: () => this.togglePasswordVisibility(passwordToggle)
      }
    })

    this.element!.after(passwordToggle.getContent()!)
  }

  private togglePasswordVisibility(passwordToggle: Button): void {
    if (this.element instanceof HTMLInputElement) {
      if (this.element.type === 'password') {
        this.element.type = 'text'
        passwordToggle.setProps<ButtonProps>({ icon: ShowPasswordIconTemplate })
      } else {
        this.element.type = 'password'
        passwordToggle.setProps<ButtonProps>({ icon: HidePasswordIconTemplate })
      }
    }
  }

  protected componentDidMount(): void {
    if (
      this.props.type === 'password' &&
      this.element instanceof HTMLInputElement
    ) {
      this.addPasswordToggle()
    }
  }

  protected componentDidUpdate(
    _oldProps: InputProps,
    newProps: InputProps
  ): boolean {
    const { isValid } = newProps

    if (isValid === false) {
      this.element!.classList.add('is-danger')
    } else {
      this.element!.classList.remove('is-danger')
    }

    return false
  }
}
