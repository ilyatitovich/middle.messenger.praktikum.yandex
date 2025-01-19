import { type SignUpData } from '@/api'
import {
  Button,
  ButtonProps,
  UserFormField,
  UserFormFieldProps
} from '@/components'
import { authController } from '@/controllers'
import { Block, type BlockProps } from '@/core'
import { type AuthState, authStore } from '@/stores'
import {
  isValidLogin,
  isValidPassword,
  isValidName,
  isValidEmail,
  isValidPhone,
  isPasswordConfirmed
} from '@/utils'

type SignUpFormProps = BlockProps

export class SignUpForm extends Block<SignUpFormProps> {
  private fields: UserFormField[]
  private emailField: UserFormField
  private loginField: UserFormField
  private passwordField: UserFormField
  private confirmPasswordField: UserFormField
  private submitButton: Button

  constructor(props: SignUpFormProps = {}) {
    const emailField = new UserFormField({
      label: 'Почта',
      name: 'email',
      type: 'email',
      validate: isValidEmail
    })

    const loginField = new UserFormField({
      label: 'Логин',
      name: 'login',
      type: 'text',
      validate: isValidLogin
    })

    const firstNameField = new UserFormField({
      label: 'Имя',
      name: 'first_name',
      type: 'text',
      validate: isValidName
    })

    const secondNameField = new UserFormField({
      label: 'Фамилия',
      name: 'second_name',
      type: 'text',
      validate: isValidName
    })

    const phoneField = new UserFormField({
      label: 'Телефон',
      name: 'phone',
      type: 'tel',
      validate: isValidPhone
    })

    const passwordField = new UserFormField({
      label: 'Пароль',
      type: 'password',
      name: 'password',
      validate: isValidPassword
    })

    const confirmPasswordField = new UserFormField({
      label: 'Пароль (еще раз)',
      type: 'password',
      name: 'confirmPassword',
      validate: () =>
        isPasswordConfirmed(
          this.passwordField.getValue(),
          this.confirmPasswordField.getValue()
        )
    })

    const submitButton = new Button({
      type: 'submit',
      label: 'Зарегистрироваться',
      className: 'user-form__button'
    })

    super('form', {
      ...props,
      className: 'user-form',
      childBlocksList: [
        emailField,
        loginField,
        firstNameField,
        secondNameField,
        phoneField,
        passwordField,
        confirmPasswordField,
        submitButton
      ],
      events: {
        submit: (e: Event) => this.handleSubmit(e as SubmitEvent)
      }
    })

    this.fields = [
      emailField,
      loginField,
      firstNameField,
      secondNameField,
      phoneField,
      passwordField,
      confirmPasswordField
    ]

    this.emailField = emailField
    this.loginField = loginField
    this.passwordField = passwordField
    this.confirmPasswordField = confirmPasswordField
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
        this.emailField.setProps<UserFormFieldProps>({
          validationResult: { isValid: false, message: '' }
        })
      }
    })
  }

  private handleSubmit(event: SubmitEvent): void {
    event.preventDefault()

    const validations: boolean[] = this.fields.map(field =>
      field.validateValue()
    )

    if (validations.every(value => value === true)) {
      const fields = this.fields.reduce<Record<string, string>>(
        (acc, field) => {
          const name = field.getName()
          if (name !== 'confirmPassword') {
            acc[name] = field.getValue()
          }
          return acc
        },
        {}
      )

      authController.signup(fields as SignUpData)
    }
  }
}
