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

    this.props = props
    if (this.element instanceof HTMLInputElement) {
      const { type, name, placeholder, value, isRequired } = this.props

      Object.assign(this.element, {
        type,
        id: name.toLocaleLowerCase(),
        name,
        placeholder: placeholder ?? '',
        value: value ?? '',
        required: isRequired ?? false
      })
    }

    if (
      this.props.type === 'password' &&
      this.element instanceof HTMLInputElement
    ) {
      this.addPasswordToggle()
    }
  }

  private addPasswordToggle(): void {
    const passwordToggle = new Button({
      type: 'button',
      className: 'user-form__password-toggle',
      icon: ShowPasswordIconTemplate,
      events: {
        click: () => this.togglePasswordVisibility(passwordToggle)
      }
    })

    requestAnimationFrame(() => {
      this.element!.after(passwordToggle.getContent()!)
    })
  }

  private togglePasswordVisibility(passwordToggle: Button): void {
    if (this.element instanceof HTMLInputElement) {
      if (this.element.type === 'password') {
        this.element.type = 'text'
        passwordToggle.setProps<ButtonProps>({ icon: HidePasswordIconTemplate })
      } else {
        this.element.type = 'password'
        passwordToggle.setProps<ButtonProps>({ icon: ShowPasswordIconTemplate })
      }
    }
  }

  protected componentDidUpdate(
    _oldProps: InputProps,
    newProps: InputProps
  ): boolean {
    if (newProps.isValid === false) {
      this.element!.classList.add('is-danger')
    } else {
      this.element!.classList.remove('is-danger')
    }
    return false
  }
}
