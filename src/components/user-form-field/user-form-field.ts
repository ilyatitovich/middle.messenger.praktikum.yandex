import {
  ErrorMessage,
  Input,
  type ErrorMessageProps,
  type InputProps
} from '@/components'
import { Block, type BlockProps } from '@/core'
import { getTemplate, type ValidationResult } from '@/utils'

import UserFormFieldTemplate from './user-form-field.hbs?raw'

export type UserFormFieldProps = BlockProps & {
  name: string
  type: 'text' | 'email' | 'password' | 'tel'
  label: string
  value?: string
  validationResult?: ValidationResult
  validate: (inputData: string) => ValidationResult
}

export class UserFormField extends Block<UserFormFieldProps> {
  private name: string
  private value: string
  validate: (inputData: string) => ValidationResult
  private input: Input
  private errorMessage: ErrorMessage

  constructor(props: UserFormFieldProps) {
    const input = new Input({
      ...props,
      placeholder: props.label,
      isRequired: true,
      events: {
        change: (e: Event) => this.handleChange(e as InputEvent),
        blur: (e: Event) => this.handleBlur(e as FocusEvent)
      }
    })

    const errorMessage = new ErrorMessage({
      className: 'user-form__validation-error',
      isHidden: true
    })

    super('div', {
      ...props,
      className: 'user-form__field',
      childBlocksList: [input, errorMessage]
    })

    this.name = props.name
    this.value = props.value ?? ''
    this.validate = props.validate
    this.input = input
    this.errorMessage = errorMessage
  }

  componentDidUpdate(
    _oldProps: UserFormFieldProps,
    newProps: UserFormFieldProps
  ): boolean {
    const { validationResult } = newProps

    if (validationResult) {
      const { isValid, message } = validationResult
      this.updateValidationState(isValid, message)
    }

    return false
  }

  private handleChange(e: InputEvent): void {
    this.value = (e.target as HTMLInputElement).value.trim()
  }

  private handleBlur(e: FocusEvent): void {
    if (!(e.relatedTarget instanceof HTMLButtonElement)) {
      this.validateValue()
    }
  }

  private updateValidationState(isValid?: boolean, message = ''): void {
    this.input.setProps<InputProps>({ isValid })
    this.errorMessage.setProps<ErrorMessageProps>({
      isHidden: isValid,
      message
    })
  }

  getName(): string {
    return this.name
  }

  getValue(): string {
    return this.value
  }

  validateValue(): boolean {
    const res = this.validate(this.value)
    this.setProps<UserFormFieldProps>({
      validationResult: res
    })
    return res.isValid
  }

  protected render(): string {
    return getTemplate(UserFormFieldTemplate, {
      id: this.props.name.toLowerCase(),
      label: this.props.label
    })
  }
}
