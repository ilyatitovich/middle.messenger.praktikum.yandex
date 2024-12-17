import { Button, UserFormField, type UserFormFieldProps } from '@/components'
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

    const fields = {
      login: this.loginField.getValue(),
      password: this.passwordField.getValue()
    }

    const validations = {
      login: isValidLogin(fields.login),
      password: isValidPassword(fields.password)
    }

    this.loginField.setProps<UserFormFieldProps>({
      validationResult: validations.login
    })
    this.passwordField.setProps<UserFormFieldProps>({
      validationResult: validations.password
    })

    if (validations.login.isValid && validations.password.isValid) {
      console.table(fields)
    }
  }
}
