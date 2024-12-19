import { Button, UserFormField } from '@/components'
import { Block, type BlockProps } from '@/core'
import { isValidLogin, isValidPassword } from '@/utils'

type SignInFormProps = BlockProps

export class SignInForm extends Block<SignInFormProps> {
  private loginField: UserFormField
  private passwordField: UserFormField

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
  }

  private handleSubmit(event: SubmitEvent): void {
    event.preventDefault()

    const validations: boolean[] = [
      this.loginField.validateValue(),
      this.passwordField.validateValue()
    ]

    if (validations.every(value => value === true)) {
      console.table({
        login: this.loginField.getValue(),
        password: this.passwordField.getValue()
      })
    }
  }
}
