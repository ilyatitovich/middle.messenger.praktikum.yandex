import {
  Button,
  type ButtonProps,
  UserFormField,
  type UserFormFieldProps
} from '@/components'
import { authController } from '@/controllers/auth-controller'
import { Block, type BlockProps } from '@/core'
import { type AuthState, authStore } from '@/stores'
import { isValidLogin, isValidPassword } from '@/utils'

type SignInFormProps = BlockProps

export class SignInForm extends Block<SignInFormProps> {
  private loginField: UserFormField
  private passwordField: UserFormField
  private submitButton: Button
  private storeUnsubscribe: () => void

  constructor(props: SignInFormProps = {}) {
    const loginField = new UserFormField({
      label: 'Логин',
      name: 'login',
      type: 'text',
      validate: isValidLogin
    })

    const passwordField = new UserFormField({
      label: 'Пароль',
      type: 'password',
      name: 'password',
      validate: isValidPassword
    })

    const submitButton = new Button({
      type: 'submit',
      label: 'Bойти',
      className: 'user-form__button'
    })

    super('form', {
      ...props,
      className: 'user-form',
      childBlocksList: [loginField, passwordField, submitButton],
      events: {
        submit: (e: Event) => this.handleSubmit(e as SubmitEvent)
      }
    })

    this.loginField = loginField
    this.passwordField = passwordField
    this.submitButton = submitButton

    this.storeUnsubscribe = authStore.subscribe(state => {
      const { status } = state as AuthState

      if (status === 'loading') {
        this.submitButton.setProps<ButtonProps>({ isDisabled: true })
      }

      if (status === 'error') {
        this.submitButton.setProps<ButtonProps>({ isDisabled: false })
        this.loginField.setProps<UserFormFieldProps>({
          validationResult: { isValid: false, message: '' }
        })
        this.passwordField.setProps<UserFormFieldProps>({
          validationResult: { isValid: false, message: '' }
        })
      }
    })
  }

  private handleSubmit(event: SubmitEvent): void {
    event.preventDefault()

    const validations: boolean[] = [
      this.loginField.validateValue(),
      this.passwordField.validateValue()
    ]

    if (validations.every(value => value === true)) {
      authController.login({
        login: this.loginField.getValue(),
        password: this.passwordField.getValue()
      })
    }
  }

  protected onUnmount(): void {
    this.storeUnsubscribe()
  }
}
